function load() {
    getProducts();
}
function readIndex(){
    sessionStorage.setItem('targetGuardado', null);
    listaProductos();
    listaAutores();
    listaEntidades();
    cargarBarra();
}
function cargarBarra() {
    var name = sessionStorage.getItem('userName');

    var div = document.getElementById("headerNav");
    var ul = document.createElement("ul");
    ul.setAttribute("class", "nav");
    div.appendChild(ul);

    var li = document.createElement("li");
    var text = document.createTextNode("Logout");
    var a = document.createElement("a");
    li.appendChild(a);
    a.appendChild(text);
    a.setAttribute("href","index.html");
    ul.appendChild(li);

    li = document.createElement("li");
    text = document.createTextNode("Bienvenido "+name);
    var a = document.createElement("a");
    li.appendChild(a);
    a.appendChild(text);
    a.setAttribute("href","");
    ul.appendChild(li);

    var ul2 = document.createElement("ul");
    li.appendChild(ul2);
    var li2 = document.createElement("li");
    text = document.createTextNode("Ver Perfil");
    var a = document.createElement("a");
    li2.appendChild(a);
    a.appendChild(text);
    a.setAttribute("href","PERFIL.html");
    ul2.appendChild(li2);
}
function guardarToken(event){
    sessionStorage.setItem('token', event);
}
function guardarUsername(event){
    sessionStorage.setItem('userName', event);
}
function guardarRol(){
    let token = sessionStorage.getItem('token');
    let name = sessionStorage.getItem('userName');
    $.ajax({
        type: "GET",
        url: '/api/v1/users',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            var index = data.users.map(function(x){return x.user.username}).indexOf(name);
            var rol = data.users[index].user.role;
            sessionStorage.setItem('rol', rol);
        }
    });
}
function guardarTarget(event){
    let target = event.target.innerHTML;
    sessionStorage.setItem('targetGuardado', target);
    //window.localStorage.setItem("targetGuardado", target);
}
function logout(){
    sessionStorage.setItem('token', null);
    sessionStorage.setItem('userName', null);
}
function listaProductos(){

    let rol = sessionStorage.getItem('rol');
    console.log(rol);
    debugger;

    let token = sessionStorage.getItem('token');
    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {

            let table = document.getElementById("tablaProductos");

            let thead = document.createElement("thead");
            table.appendChild(thead);

            let tbody = document.createElement("tbody");
            table.appendChild(tbody);
            tbody.setAttribute("id", "cuerpoProductos");

            for (let i = 0; i < data.products.length; i++) {

                console.log(data.products.length);
                let tr = document.createElement("tr");
                tbody.appendChild(tr);

                let td = document.createElement("td");
                tr.appendChild(td);

                let img = document.createElement("img");

                img.width = 50;
                img.height = 50;

                img.src = data.products[i].product.imageUrl;
                let src = document.createElement("src");

                src.appendChild(img);

                td.appendChild(src);

                td = document.createElement("td");
                tr.appendChild(td);

                let text = document.createTextNode(data.products[i].product.name);

                let a = document.createElement("a");
                td.appendChild(a);
                a.appendChild(text);
                a.setAttribute("href","MOSTRAR_PRODUCTO.html");
                a.setAttribute("onclick","guardarTarget(event)");

                if(rol == "writer"){
                    var input=document.createElement("input");
                    tr.appendChild(input);
                    input.setAttribute("type","button");
                    input.setAttribute("value","Eliminar Producto");
                    input.setAttribute("onclick","deleteProduct(event)");
                }
            }
            if(rol == "writer"){
                var input=document.createElement("input");
                tbody.appendChild(input);
                input.setAttribute("type","button");
                input.setAttribute("value","Añadir Producto");
                input.setAttribute("onclick","location.href='CREAR_PRODUCTO.html'");
            }
        }
    });
}
function listaAutores(){

    let target = sessionStorage.getItem('token');
    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        headers: {"Authorization": target},
        dataType: 'json',
        success: function (data) {
            console.log(JSON.stringify(data));
            let table = document.getElementById("tablaAutores");

            let thead = document.createElement("thead");
            table.appendChild(thead);

            let tbody = document.createElement("tbody");
            table.appendChild(tbody);
            tbody.setAttribute("id", "cuerpoAutores");

            for (let i = 0; i < data.persons.length; i++) {
                let tr = document.createElement("tr");
                tbody.appendChild(tr);

                let td = document.createElement("td");
                tr.appendChild(td);

                let img = document.createElement("img");

                img.width = 50;
                img.height = 50;

                img.src = data.persons[i].person.imageUrl;
                let src = document.createElement("src");

                src.appendChild(img);

                td.appendChild(src);

                td = document.createElement("td");
                tr.appendChild(td);

                let text = document.createTextNode(data.persons[i].person.name);

                let a = document.createElement("a");
                td.appendChild(a);
                a.appendChild(text);
                a.setAttribute("href", "MOSTRAR_AUTOR.html");
                a.setAttribute("onclick", "guardarTarget(event)");
            }
        }
    });
}
function listaEntidades(){

    let target = sessionStorage.getItem('token');
    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        headers: {"Authorization": target},
        dataType: 'json',
        success: function (data) {
            var table = document.getElementById("tablaEntidades");

            var thead = document.createElement("thead");
            table.appendChild(thead);

            var tbody = document.createElement("tbody");
            table.appendChild(tbody);
            tbody.setAttribute("id", "cuerpoEntidades");

            for (var i = 0; i < data.entities.length; i++) {
                var tr = document.createElement("tr");
                tbody.appendChild(tr);

                var td = document.createElement("td");
                tr.appendChild(td);

                var img = document.createElement("img");

                img.width = 50;
                img.height = 50;

                img.src = data.entities[i].entity.imageUrl;
                var src = document.createElement("src");

                src.appendChild(img);

                td.appendChild(src);

                var td = document.createElement("td");
                tr.appendChild(td);

                var text = document.createTextNode(data.entities[i].entity.name);

                var a = document.createElement("a");
                td.appendChild(a);
                a.appendChild(text);
                a.setAttribute("href", "MOSTRAR_ENTIDAD.html");
                a.setAttribute("onclick", "guardarTarget(event)");
            }
        }
    });
}
function getProducts(){
    let target = sessionStorage.getItem('token');
    let aux = null;
    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        headers: {"Authorization": target},
        dataType: 'json',
        success: function (data) {
            aux = data;
            console.log(data);
            console.log(data.products[0].product.name);
            console.log(data.products.length);
            $('#resultado').html(JSON.stringify(data));
        }
    });
}
function readPerson(){

    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');
    console.log(token);
    console.log(target);
    let index = null;

    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            for (let i = 0; i < data.persons.length; i++) {
                if (data.persons[i].person.name == target)
                    index = i;
            }
            console.log(target);
            console.log(index);

            var section = document.getElementById("personInfo");

            var titulo = document.createElement("h1");
            var text = document.createTextNode("Información del autor");
            titulo.appendChild(text);
            section.appendChild(titulo);

            var hr = document.createElement("hr");
            section.appendChild(hr);

            var p = document.createElement("p");
            section.appendChild(p);

            var img = document.createElement("img");
            img.width = 500;

            img.src = data.persons[index].person.imageUrl;
            var src = document.createElement("src");

            src.appendChild(img);

            p.appendChild(src);

            var br = document.createElement("br");
            section.appendChild(br);

            var text = document.createTextNode("Nombre: ");
            p.appendChild(text);
            var text = document.createTextNode(data.persons[index].person.name);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Fecha de nacimiento: ");
            p.appendChild(text);
            var text = document.createTextNode(data.persons[index].person.birthDate);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            if (data.persons[index].person.deathDate != "1111-05-11") {

                var text = document.createTextNode("Fecha De Muerte: ");
                p.appendChild(text);
                var text = document.createTextNode(data.persons[index].person.deathDate);
                p.appendChild(text);

                var br = document.createElement("br");
                p.appendChild(br);

            }
            /*
            var text = document.createTextNode("Productos en los que ha participado: ");
            p.appendChild(text);
            var text = document.createTextNode(datos.autores[index].productosParticipa);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Entidades en las que ha participado: ");
            p.appendChild(text);
            var text = document.createTextNode(datos.autores[index].entidadesParticipa);
            p.appendChild(text);
            */
            var hr = document.createElement("hr");
            section.appendChild(hr);

            var titulo = document.createElement("h1");
            var text = document.createTextNode("Wiki del autor");
            titulo.appendChild(text);
            section.appendChild(titulo);

            var figure = document.createElement("figure");

            var iframe = document.createElement("iframe");
            iframe.width = 1195;
            iframe.height = 672;
            console.log(data.persons[index].person.wikiUrl);
            iframe.src = data.persons[index].person.wikiUrl;

            var src = document.createElement("src");

            iframe.appendChild(src);

            figure.appendChild(iframe);
            section.appendChild(figure);
        }
    });
}
function readEntity(){

    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');
    console.log(token);
    console.log(target);
    let index = null;

    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            for (let i = 0; i < data.entities.length; i++) {
                if (data.entities[i].entity.name == target)
                    index = i;
            }
            console.log(target);
            console.log(index);

            var section = document.getElementById("entityInfo");

            var titulo = document.createElement("h1");
            var text = document.createTextNode("Información de la entidad");
            titulo.appendChild(text);
            section.appendChild(titulo);

            var hr = document.createElement("hr");
            section.appendChild(hr);

            var p = document.createElement("p");
            section.appendChild(p);

            var img = document.createElement("img");
            img.width = 500;

            img.src = data.entities[index].entity.imageUrl;
            var src = document.createElement("src");

            src.appendChild(img);

            p.appendChild(src);

            var br = document.createElement("br");
            section.appendChild(br);

            var text = document.createTextNode("Nombre: ");
            p.appendChild(text);
            var text = document.createTextNode(data.entities[index].entity.name);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Fecha De Creación: ");
            p.appendChild(text);
            var text = document.createTextNode(data.entities[index].entity.birthDate);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            if(data.entities[index].entity.deathDate != ""){

                var text = document.createTextNode("Fecha De Muerte: ");
                p.appendChild(text);
                var text = document.createTextNode(data.entities[index].entity.deathDate);
                p.appendChild(text);

                var br = document.createElement("br");
                p.appendChild(br);

            }
            /*
            var text = document.createTextNode("Personas Participantes: ");
            p.appendChild(text);
            var text = document.createTextNode(datos.entidades[index].personasParticipantes);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Productos: ");
            p.appendChild(text);
            var text = document.createTextNode(datos.entidades[index].productos);
            p.appendChild(text);
            */
            var hr = document.createElement("hr");
            section.appendChild(hr);

            var titulo = document.createElement("h1");
            var text = document.createTextNode("Wiki de la entidad");
            titulo.appendChild(text);
            section.appendChild(titulo);

            var figure = document.createElement("figure");

            var iframe = document.createElement("iframe");
            iframe.width = 1195;
            iframe.height = 672;

            iframe.src = data.entities[index].entity.wikiUrl;

            var src = document.createElement("src");

            iframe.appendChild(src);

            figure.appendChild(iframe);
            section.appendChild(figure);
        }
    });
}
function readProduct(){

    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');
    let rol = sessionStorage.getItem('rol');

    console.log(token);
    console.log(target);
    let index = null;

    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            for (let i = 0; i < data.products.length; i++) {
                if (data.products[i].product.name == target)
                    index = i;
            }
            console.log(target);
            console.log(index);

            var nav = document.getElementById("navProduct");

            var input=document.createElement("input");
            nav.appendChild(input);
            input.setAttribute("type","button");
            input.setAttribute("value","Indice");
            input.setAttribute("onclick","location.href='OPENED_INDEX.html';");

            if(rol == "writer"){
                var input=document.createElement("input");
                nav.appendChild(input);
                input.setAttribute("type","button");
                input.setAttribute("value","Editar");
                input.setAttribute("onclick","location.href='CREAR_PRODUCTO.html';");
            }

            var section = document.getElementById("productInfo");

            var titulo = document.createElement("h1");
            var text = document.createTextNode("Información del producto");
            titulo.appendChild(text);
            section.appendChild(titulo);

            var hr = document.createElement("hr");
            section.appendChild(hr);

            var p = document.createElement("p");
            section.appendChild(p);

            var img = document.createElement("img");
            img.width = 500;

            img.src = data.products[index].product.imageUrl;
            var src = document.createElement("src");

            src.appendChild(img);

            p.appendChild(src);

            var br = document.createElement("br");
            p.appendChild(br);
            var br = document.createElement("br");
            p.appendChild(br);
            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Nombre: ");
            p.appendChild(text);
            var text = document.createTextNode(data.products[index].product.name);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Fecha De Creación: ");
            p.appendChild(text);
            var text = document.createTextNode(data.products[index].product.birthDate);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            if(data.products[index].product.deathDate != ""){

                var text = document.createTextNode("Fecha De Muerte: ");
                p.appendChild(text);
                var text = document.createTextNode(data.products[index].product.deathDate);
                p.appendChild(text);

                var br = document.createElement("br");
                p.appendChild(br);

            }
            /*
            var text = document.createTextNode("Personas Participantes: ");
            p.appendChild(text);
            var text = document.createTextNode(datos.productos[index].personasParticipantes);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Productos: ");
            p.appendChild(text);
            var text = document.createTextNode(datos.productos[index].entidadesParticipantes);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);
            var br = document.createElement("br");
            p.appendChild(br);
            var br = document.createElement("br");
            p.appendChild(br);
            */
            var hr = document.createElement("hr");
            section.appendChild(hr);

            var titulo = document.createElement("h1");
            var text = document.createTextNode("Wiki del Producto");
            titulo.appendChild(text);
            section.appendChild(titulo);

            var figure = document.createElement("figure");

            var iframe = document.createElement("iframe");
            iframe.width = 1195;
            iframe.height = 672;

            iframe.src = data.products[index].product.wikiUrl;

            var src = document.createElement("src");

            iframe.appendChild(src);

            figure.appendChild(iframe);
            section.appendChild(figure);
        }
    });
}
function createProduct(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');

    var nombreProducto = document.getElementById("nombre").value;
    var creacionProducto = document.getElementById("creacion").value;
    var muerteProducto = document.getElementById("muerte").value;
    var logoProducto = document.getElementById("logo").value;
    var wikiProducto = document.getElementById("wiki").value;
    if(target == "null"){
        $.ajax({
            type: "POST",
            url: '/api/v1/products',
            headers: {"Authorization": token},
            dataType: 'json',
            data: {
                "name" :nombreProducto,
                "birthDate" :creacionProducto,
                "deathDate" :muerteProducto,
                "imageUrl" :logoProducto,
                "wikiUrl" :wikiProducto,
            },
            success: function (data){
                alert("Realizado correctamente");
            }
        });
    } else{
        $.ajax({
            type: "GET",
            url: '/api/v1/products',
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data) {

                var index = data.products.map(function(x){return x.product.name}).indexOf(target);
                var id = data.products[index].product.id;
                console.log(index);
                debugger;
                $.ajax({
                    type: "PUT",
                    url: '/api/v1/products/'+id,
                    headers: {"Authorization": token},
                    dataType: 'json',
                    data: {
                        "name" :nombreProducto,
                        "birthDate" :creacionProducto,
                        "deathDate" :muerteProducto,
                        "imageUrl" :logoProducto,
                        "wikiUrl" :wikiProducto,
                    },
                    success: function (data) {
                        alert("Realizado correctamente");
                    }
                });
            }
        });
    }

}
function editProduct(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');
    console.log(target);
    if(target != "null"){
        var boton = document.getElementById("botonCreacion");
        boton.setAttribute("value","Actualizar Datos");
    }

    var nav = document.getElementById("navProduct");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='OPENED_INDEX.html';");

    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            var index = data.products.map(function(x){return x.product.name}).indexOf(target);

            document.getElementById("nombre").value = data.products[index].product.name;
            document.getElementById("creacion").value = data.products[index].product.birthDate;
            document.getElementById("muerte").value = data.products[index].product.deathDate;
            document.getElementById("logo").value = data.products[index].product.imageUrl;
            document.getElementById("wiki").value = data.products[index].product.wikiUrl;
        }
    });
}

function deleteProduct(event){

    let token = sessionStorage.getItem('token');
    var productos = document.getElementById("cuerpoProductos");

    var productoTarget = event.target.parentElement.firstChild.nextSibling.innerHTML;

    console.log(productoTarget);

    var texto = productoTarget.replace(/<[^>]*>?/g, '');
    console.log(texto);

    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {

            var index = data.products.map(function(x){return x.product.name}).indexOf(texto);
            var id = data.products[index].product.id;
            $.ajax({
                type: "DELETE",
                url: '/api/v1/products/'+id,
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    alert("Realizado correctamente");
                }
            });
        }
    });

    productos.removeChild(event.target.parentElement);
}