<?php

/**
 * PHP version 7.4
 * src/Entity/User.php
 */

namespace TDW\ACiencia\Entity;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;
use OutOfRangeException;
use DateTime;
/**
 * @ORM\Entity()
 * @ORM\Table(
 *     name                 = "user",
 *     uniqueConstraints    = {
 *          @ORM\UniqueConstraint(
 *              name="IDX_UNIQ_USERNAME", columns={ "username" }
 *          ),
 *          @ORM\UniqueConstraint(
 *              name="IDX_UNIQ_EMAIL", columns={ "email" }
 *          )
 *      }
 *     )
 */
class User implements JsonSerializable
{
    /**
     * @ORM\Column(
     *     name="id",
     *     type="integer",
     *     nullable=false
     *     )
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected int $id;

    /**
     * @ORM\Column(
     *     name     = "username",
     *     type     = "string",
     *     length   = 32,
     *     unique   = true,
     *     nullable = false
     *     )
     */
    private string $username;

    /**
     * @ORM\Column(
     *     name     = "email",
     *     type     = "string",
     *     length   = 60,
     *     nullable = false,
     *     unique   = true
     *     )
     */
    private string $email;

    /**
     * @ORM\Column(
     *     name     = "password",
     *     type     = "string",
     *     length   = 60,
     *     nullable = false
     *     )
     */
    private string $password;

    /**
     * @ORM\Column(
     *     name="role",
     *     type="object"
     *     )
     */
    private Role $role;

    /**
     * @ORM\Column(
     *     name="authorized",
     *     type="boolean",
     *     nullable=false,
     *     options = { "default" = false }
     *     )
     */
    private bool $authorized;

    /**
     * @ORM\Column(
     *     name="active",
     *     type="boolean",
     *     nullable=false,
     *     options = { "default" = true }
     *     )
     */
    private bool $active;

    /**
     * @ORM\Column(
     *     name="name",
     *     type="string",
     *     length   = 60,
     *     nullable=true
     *     )
     */
    private ?string $name;

    /**
     * @ORM\Column(
     *     name="surname",
     *     type="string",
     *     length   = 60,
     *     nullable=true
     *     )
     */
    private ?string $surname;

    /**
     * @ORM\Column(
     *     name="birthdate",
     *     type="datetime",
     *     nullable=true
     *     )
     */
    protected ?DateTime $birthDate = null;

    /**
     * User constructor.
     *
     * @param string $username username
     * @param string $email email
     * @param string $password password
     * @param string $role Role::ROLE_READER | Role::ROLE_WRITER
     * @param bool $authorized authorized
     * @param bool $active active
     * @param string|null $name name
     * @param string|null $surname surname
     * @param DateTime|null $birthDate birthDate
     */
    public function __construct(
        string $username = '',
        string $email = '',
        string $password = '',
        string $role = Role::ROLE_READER,
        bool $authorized = false,
        bool $active = true,
        ?string $name = null,
        ?string $surname = null,
        ?DateTime $birthDate = null
    ) {
        $this->id       = 0;
        $this->username = $username;
        $this->email    = $email;
        $this->setPassword($password);
        $this->role     = new Role($role);
        $this->authorized = $authorized;
        $this->active = $active;
        $this->name = $name;
        $this->surname = $surname;
        $this->birthDate = $birthDate;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * Set username
     *
     * @param string $username username
     * @return User
     */
    public function setUsername(string $username): self
    {
        $this->username = $username;
        return $this;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $email email
     * @return User
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    /**
     * @param string $role
     * @return boolean
     */
    public function hasRole(string $role): bool
    {
        return $this->role->hasRole($role);
    }

    /**
     * @param string $role [ 'ROLE_READER' | 'ROLE_WRITER' ]
     * @throws OutOfRangeException
     * @return User
     */
    public function setRole(string $role): self
    {
        $this->role = new Role($role);
        return $this;
    }

    /**
     * @return array ['reader'] | ['reader', 'writer']
     */
    public function getRoles(): array
    {
        $roles = array_filter(
            Role::ROLES,
            fn($myRole) => $this->hasRole($myRole)
        );

        return $roles;
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @param string $password password
     * @return User
     */
    public function setPassword(string $password): self
    {
        $this->password = (string) password_hash($password, PASSWORD_DEFAULT);
        return $this;
    }

    /**
     * Verifies that the given hash matches the user password.
     *
     * @param string $password password
     * @return boolean
     */
    public function validatePassword($password): bool
    {
        return password_verify($password, $this->password);
    }

    /**
     * @return bool
     */
    public function isAuthorized(): bool
    {
        return $this->authorized;
    }

    /**
     * @param bool $authorized authorized
     * @return User
     */
    public function setAuthorized(bool $authorized): self
    {
        $this->authorized = $authorized;
        return $this;
    }

    /**
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->active;
    }

    /**
     * @param bool $active active
     * @return User
     */
    public function setActive(bool $active): self
    {
        $this->active = $active;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string|null $name name
     * @return User
     */
    public function setName(?string $name): self
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getSurname(): ?string
    {
        return $this->surname;
    }

    /**
     * @param string|null $surname surname
     * @return User
     */
    public function setSurname(?string $surname): self
    {
        $this->surname = $surname;
        return $this;
    }

    /**
     * @return DateTime|null
     */
    public function getBirthDate(): ?DateTime
    {
        return $this->birthDate;
    }

    /**
     * @param DateTime|null $birthDate birthDate
     * @return User
     */
    public function setBirthDate(?DateTime $birthDate): self
    {
        $this->birthDate = $birthDate;
        return $this;
    }

    /**
     * The __toString method allows a class to decide how it will react when it is converted to a string.
     *
     * @return string
     * @link http://php.net/manual/en/language.oop5.magic.php#language.oop5.magic.tostring
     */
    public function __toString(): string
    {
        $birthDate = (null !== $this->getBirthDate())
            ? $this->getBirthDate()->format('"Y-m-d"')
            : '"null"';
        return '[' . basename(get_class($this)) . ' ' .
            '(id=' . $this->getId() . ', ' .
            'username="' . $this->getUsername() . '", ' .
            'email="' . $this->getEmail() . '", ' .
            'role="' . $this->role . '", ' .
            'authorized="' . $this->isAuthorized() . '", ' .
            'active="' . $this->isActive() . '", ' .
            'name="' . $this->getName() . '", ' .
            'surname="' . $this->getSurname() . '", ' .
            'birthDate=' . $birthDate .
            '")]';
    }

    /**
     * Specify data which should be serialized to JSON
     * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    public function jsonSerialize()
    {
        return [
            'user' => [
                'id' => $this->getId(),
                'username' => $this->getUsername(),
                'email' => $this->getEmail(),
                'role' => $this->role->__toString(),
                'authorized' => $this->isAuthorized(),
                'active' => $this->isActive(),
                'name' => $this->getName() ?? null,
                'surname' => $this->getSurname() ?? null,
                'birthDate' => ($this->getBirthDate()) ? $this->getBirthDate()->format('Y-m-d') : null,
            ]
        ];
    }
}
