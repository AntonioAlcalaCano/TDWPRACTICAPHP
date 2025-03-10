<?php

/**
 * PHP version 7.4
 * config/routesUsers.php
 *
 * @license  https://opensource.org/licenses/MIT MIT License
 * @link     http://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

use Slim\App;
use TDW\ACiencia\Controller\UserController;
use TDW\ACiencia\Middleware\JwtMiddleware;

/**
 * ############################################################
 * routes /api/v1/users
 * ############################################################
 * @param App $app
 */
return function (App $app) {

    $REGEX_USER_ID = '/{userId:[0-9]+}';
    $REGEX_USERNAME = '[a-zA-Z0-9()áéíóúÁÉÍÓÚñÑ %$\.+-]+';

    // CGET: Returns all users
    $app->get(
        $_ENV['RUTA_API'] . UserController::PATH_USERS,
        UserController::class . ':cget'
    )->setName('tdw_cget_users')
        ->add(JwtMiddleware::class);

    // GET: Returns a user based on a single ID
    $app->get(
        $_ENV['RUTA_API'] . UserController::PATH_USERS . $REGEX_USER_ID,
        UserController::class . ':get'
    )->setName('tdw_get_users')
        ->add(JwtMiddleware::class);

    // GET: Returns status code 204 if username exists
    $app->get(
        $_ENV['RUTA_API'] . UserController::PATH_USERS . '/username/{username:' . $REGEX_USERNAME . '}',
        UserController::class . ':getUsername'
    )->setName('tdw_get_user_name');

    // DELETE: Deletes a user
    $app->delete(
        $_ENV['RUTA_API'] . UserController::PATH_USERS . $REGEX_USER_ID,
        UserController::class . ':delete'
    )->setName('tdw_delete_users')
        ->add(JwtMiddleware::class);

    // OPTIONS: Provides the list of HTTP supported methods
    $app->options(
        $_ENV['RUTA_API'] . UserController::PATH_USERS . '[' . $REGEX_USER_ID . ']',
        UserController::class . ':options'
    )->setName('tdw_options_users');

    // POST: Creates a new user
    $app->post(
        $_ENV['RUTA_API'] . UserController::PATH_USERS,
        UserController::class . ':post'
    )->setName('tdw_post_users');
        //->add(JwtMiddleware::class);

    // PUT: Updates a user
    $app->put(
        $_ENV['RUTA_API'] . UserController::PATH_USERS . $REGEX_USER_ID,
        UserController::class . ':put'
    )->setName('tdw_put_users')
        ->add(JwtMiddleware::class);
};
