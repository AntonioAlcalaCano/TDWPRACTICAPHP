function logout(){
    sessionStorage.setItem('token', null);
    sessionStorage.setItem('userName', null);
    sessionStorage.setItem('passwd', null);
    sessionStorage.setItem('active', null);
    sessionStorage.setItem('authorized', null);
}

function readIndex(){
    sessionStorage.setItem('targetGuardado', null);
    listaProductos();
    listaAutores();
    listaEntidades();
    cargarBarra();
}
function cargarBarra() {
    let rol = sessionStorage.getItem('rol');
    let name = sessionStorage.getItem('userName');
    if(rol == "writer"){
        let nav = document.getElementById("writerNav");
        let p = document.createElement("p");
        let text = document.createTextNode("Usuario "+name);
        p.appendChild(text);
        nav.appendChild(p);
        p.style.color = "#ffffff";


        let input=document.createElement("input");
        nav.appendChild(input);
        input.setAttribute("type","button");
        input.setAttribute("value","Logout");
        input.setAttribute("onclick","location.href='index.html'; logout();");

        input=document.createElement("input");
        nav.appendChild(input);
        input.setAttribute("type","button");
        input.setAttribute("value","Perfil");
        input.setAttribute("onclick","location.href='PERFIL.html';");

        input=document.createElement("input");
        nav.appendChild(input);
        input.setAttribute("type","button");
        input.setAttribute("value","Añadir Producto");
        input.setAttribute("onclick","location.href='CREAR_PRODUCTO.html'");

        input=document.createElement("input");
        nav.appendChild(input);
        input.setAttribute("type","button");
        input.setAttribute("value","Añadir Entidad");
        input.setAttribute("onclick","location.href='CREAR_ENTIDAD.html'");

        input=document.createElement("input");
        nav.appendChild(input);
        input.setAttribute("type","button");
        input.setAttribute("value","Añadir Autor");
        input.setAttribute("onclick","location.href='CREAR_AUTOR.html'");

        input=document.createElement("input");
        nav.appendChild(input);
        input.setAttribute("type","button");
        input.setAttribute("value","Administrar Usuarios");
        input.setAttribute("onclick","location.href='USUARIOS.html'");
    }
    else{
        let nav = document.getElementById("writerNav");
        let p = document.createElement("p");
        let text = document.createTextNode("Usuario "+name);
        p.appendChild(text);
        nav.appendChild(p);
        p.style.color = "#ffffff";


        let input=document.createElement("input");
        nav.appendChild(input);
        input.setAttribute("type","button");
        input.setAttribute("value","Logout");
        input.setAttribute("onclick","location.href='index.html'; logout();");

        input=document.createElement("input");
        nav.appendChild(input);
        input.setAttribute("type","button");
        input.setAttribute("value","Perfil");
        input.setAttribute("onclick","location.href='PERFIL.html';");
    }
}
function checkAll(uToken, userName){
    var token = uToken;
    $.ajax({
        type: "GET",
        url: '/api/v1/users',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            var index = data.users.map(function(x){return x.user.username}).indexOf(userName);
            var rol = data.users[index].user.role;
            var active = data.users[index].user.active;
            var authorized = data.users[index].user.authorized;
            console.log(rol);
            console.log(authorized);
            console.log(active);
            if((authorized == 1) && (active == 1)){
                if(rol == 1){
                    window.location.replace("./SHOWED_INDEX.html");
                    sessionStorage.setItem('rol', rol);
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('userName', userName);
                }else{
                    window.location.replace("./OPENED_INDEX.html");
                    sessionStorage.setItem('rol', rol);
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('userName', userName);
                }
            }else if((authorized == 0)){
                alert("Error al iniciar sesión, la cuenta aun no ha sido validada por un writer");
                window.location.replace("./index.html");
            }else if((authorized == 1) && (active == 0)){
                alert("Error al iniciar sesión, la cuenta no esta activa.");
                window.location.replace("./index.html");
            }
        }
    });
}
function guardarTarget(event){
    let target = event.target.innerHTML;
    sessionStorage.setItem('targetGuardado', target);
    //window.localStorage.setItem("targetGuardado", target);
}
function listaProductos(){

    let rol = sessionStorage.getItem('rol');

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
        }
    });
}
function listaAutores(){

    let target = sessionStorage.getItem('token');
    let rol = sessionStorage.getItem('rol');
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

                if(rol == "writer"){
                    var input=document.createElement("input");
                    tr.appendChild(input);
                    input.setAttribute("type","button");
                    input.setAttribute("value","Eliminar Autor");
                    input.setAttribute("onclick","deletePerson(event)");
                }
            }
        }
    });
}
function listaEntidades(){

    let target = sessionStorage.getItem('token');
    let rol = sessionStorage.getItem('rol');
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
                if(rol == "writer"){
                    var input=document.createElement("input");
                    tr.appendChild(input);
                    input.setAttribute("type","button");
                    input.setAttribute("value","Eliminar Entidad");
                    input.setAttribute("onclick","deleteEntity(event)");
                }
            }
        }
    });
}
function readPerson(){

    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');
    let rol = sessionStorage.getItem('rol');
    var name = sessionStorage.getItem('userName');

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

            var nav = document.getElementById("navPerson");

            var p = document.createElement("p");
            var text = document.createTextNode("Usuario "+name);
            p.appendChild(text);
            nav.appendChild(p);
            p.style.color = "#ffffff";

            var input=document.createElement("input");
            nav.appendChild(input);
            input.setAttribute("type","button");
            input.setAttribute("value","Indice");
            input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

            if(rol == "writer"){
                var input=document.createElement("input");
                nav.appendChild(input);
                input.setAttribute("type","button");
                input.setAttribute("value","Editar");
                input.setAttribute("onclick","location.href='CREAR_AUTOR.html';");

                var input=document.createElement("input");
                nav.appendChild(input);
                input.setAttribute("type","button");
                input.setAttribute("value","Añadir Relación");
                input.setAttribute("onclick","location.href='CREAR_RELACION_AUTOR.html';");

                var input=document.createElement("input");
                nav.appendChild(input);
                input.setAttribute("type","button");
                input.setAttribute("value","Eliminar Relación");
                input.setAttribute("onclick","location.href='ELIMINAR_RELACION_AUTOR.html';");
            }

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

            if (data.persons[index].person.deathDate != null) {

                var text = document.createTextNode("Fecha De Muerte: ");
                p.appendChild(text);
                var text = document.createTextNode(data.persons[index].person.deathDate);
                p.appendChild(text);

                var br = document.createElement("br");
                p.appendChild(br);

            }
            var h1 = document.createElement("p");
            p.appendChild(h1);
            var text = document.createTextNode("Productos Participantes: ");
            h1.appendChild(text);

            var autorID = data.persons[index].person.id;
            $.ajax({
                type: "GET",
                url: '/api/v1/persons/' + autorID + '/products',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    if(data.products.length == 0){
                        var text = document.createTextNode("Ninguno");
                        h1.appendChild(text);
                    }
                    for(var j = 0; j< data.products.length; j++){
                        if(j==0){
                            var text = document.createTextNode(data.products[index].product.name);
                            h1.appendChild(text);
                        }else{
                            var text = document.createTextNode(', ' + data.products[index].product.name);
                            h1.appendChild(text);
                        }
                    }
                }
            });
            var h2 = document.createElement("p");
            p.appendChild(h2);
            var text = document.createTextNode("Entidades Participantes: ");
            h2.appendChild(text);

            $.ajax({
                type: "GET",
                url: '/api/v1/persons/' + autorID + '/entities',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    if(data.entities.length == 0){
                        var text = document.createTextNode("Ninguna");
                        h2.appendChild(text);
                    }
                    for(var j = 0; j< data.entities.length; j++){
                        if(j==0){
                            var text = document.createTextNode(data.entities[index].entity.name);
                            h2.appendChild(text);
                        }else{
                            var text = document.createTextNode(', ' + data.entities[index].entity.name);
                            h2.appendChild(text);
                        }
                    }
                }
            });
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
    let rol = sessionStorage.getItem('rol');
    var name = sessionStorage.getItem('userName');

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

            var nav = document.getElementById("navEntity");

            var p = document.createElement("p");
            var text = document.createTextNode("Usuario "+name);
            p.appendChild(text);
            nav.appendChild(p);
            p.style.color = "#ffffff";


            var input=document.createElement("input");
            nav.appendChild(input);
            input.setAttribute("type","button");
            input.setAttribute("value","Indice");
            input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

            if(rol == "writer"){
                var input=document.createElement("input");
                nav.appendChild(input);
                input.setAttribute("type","button");
                input.setAttribute("value","Editar");
                input.setAttribute("onclick","location.href='CREAR_ENTIDAD.html';");

                var input=document.createElement("input");
                nav.appendChild(input);
                input.setAttribute("type","button");
                input.setAttribute("value","Añadir Relación");
                input.setAttribute("onclick","location.href='CREAR_RELACION_ENTIDAD.html';");

                var input=document.createElement("input");
                nav.appendChild(input);
                input.setAttribute("type","button");
                input.setAttribute("value","Eliminar Relación");
                input.setAttribute("onclick","location.href='ELIMINAR_RELACION_ENTIDAD.html';");
            }

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

            if(data.entities[index].entity.deathDate != null){

                var text = document.createTextNode("Fecha De Muerte: ");
                p.appendChild(text);
                var text = document.createTextNode(data.entities[index].entity.deathDate);
                p.appendChild(text);

                var br = document.createElement("br");
                p.appendChild(br);

            }

            var h1 = document.createElement("p");
            p.appendChild(h1);
            var text = document.createTextNode("Autores Participantes: ");
            h1.appendChild(text);

            var entidadID = data.entities[index].entity.id;
            $.ajax({
                type: "GET",
                url: '/api/v1/entities/' + entidadID + '/persons',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    if(data.persons.length == 0){
                        var text = document.createTextNode("Ninguna");
                        h1.appendChild(text);
                    }
                    for(var j = 0; j< data.persons.length; j++){
                        if(j==0){
                            var text = document.createTextNode(data.persons[index].person.name);
                            h1.appendChild(text);
                        }else{
                            var text = document.createTextNode(', ' + data.persons[index].person.name);
                            h1.appendChild(text);
                        }
                    }
                }
            });
            var h2 = document.createElement("p");
            p.appendChild(h2);
            var text = document.createTextNode("Productos Participantes: ");
            h2.appendChild(text);

            $.ajax({
                type: "GET",
                url: '/api/v1/entities/' + entidadID + '/products',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    if(data.products.length == 0){
                        var text = document.createTextNode("Ninguna");
                        h2.appendChild(text);
                    }
                    for(var j = 0; j< data.products.length; j++){
                        if(j==0){
                            var text = document.createTextNode(data.products[index].product.name);
                            h2.appendChild(text);
                        }else{
                            var text = document.createTextNode(', ' + data.products[index].products.name);
                            h2.appendChild(text);
                        }
                    }
                }
            });
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
    let name = sessionStorage.getItem('userName');

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

            var p = document.createElement("p");
            var text = document.createTextNode("Usuario "+name);
            p.appendChild(text);
            nav.appendChild(p);
            p.style.color = "#ffffff";

            var input=document.createElement("input");
            nav.appendChild(input);
            input.setAttribute("type","button");
            input.setAttribute("value","Indice");
            input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

            if(rol == "writer"){
                var input=document.createElement("input");
                nav.appendChild(input);
                input.setAttribute("type","button");
                input.setAttribute("value","Editar");
                input.setAttribute("onclick","location.href='CREAR_PRODUCTO.html';");

                var input=document.createElement("input");
                nav.appendChild(input);
                input.setAttribute("type","button");
                input.setAttribute("value","Añadir Relación");
                input.setAttribute("onclick","location.href='CREAR_RELACION_PRODUCTO.html';");

                var input=document.createElement("input");
                nav.appendChild(input);
                input.setAttribute("type","button");
                input.setAttribute("value","Eliminar Relación");
                input.setAttribute("onclick","location.href='ELIMINAR_RELACION_PRODUCTO.html';");
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

            if(data.products[index].product.deathDate != null){

                var text = document.createTextNode("Fecha De Muerte: ");
                p.appendChild(text);
                var text = document.createTextNode(data.products[index].product.deathDate);
                p.appendChild(text);

                var br = document.createElement("br");
                p.appendChild(br);

            }
            var h1 = document.createElement("p");
            p.appendChild(h1);
            var text = document.createTextNode("Autores Participantes: ");
            h1.appendChild(text);

            var productoID = data.products[index].product.id;
            $.ajax({
                type: "GET",
                url: '/api/v1/products/' + productoID + '/persons',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    if(data.persons.length == 0){
                        var text = document.createTextNode("Ninguna");
                        h1.appendChild(text);
                    }
                    for(var j = 0; j< data.persons.length; j++){
                        if(j==0){
                            var text = document.createTextNode(data.persons[index].person.name);
                            h1.appendChild(text);
                        }else{
                            var text = document.createTextNode(', ' + data.persons[index].person.name);
                            h1.appendChild(text);
                        }
                    }
                }
            });
            var h2 = document.createElement("p");
            p.appendChild(h2);
            var text = document.createTextNode("Entidades Participantes: ");
            h2.appendChild(text);

            $.ajax({
                type: "GET",
                url: '/api/v1/products/' + productoID + '/entities',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    if(data.entities.length == 0){
                        var text = document.createTextNode("Ninguna");
                        h2.appendChild(text);
                    }
                    for(var j = 0; j< data.entities.length; j++){
                        if(j==0){
                            var text = document.createTextNode(data.entities[index].entity.name);
                            h2.appendChild(text);
                        }else{
                            var text = document.createTextNode(', ' + data.entities[index].entity.name);
                            h2.appendChild(text);
                        }
                    }
                }
            });
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

            var br = document.createElement("br");
            p.appendChild(br);
            var br = document.createElement("br");
            p.appendChild(br);
            var br = document.createElement("br");
            p.appendChild(br);
            var br = document.createElement("br");
            p.appendChild(br);

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
    let name = sessionStorage.getItem('userName');

    console.log(target);
    var nav = document.getElementById("navProduct");

    let p = document.createElement("p");
    let text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    if(target != "null"){
        var boton = document.getElementById("botonCreacion");
        boton.setAttribute("value","Actualizar Datos");

        var input=document.createElement("input");
        nav.appendChild(input);
        input.setAttribute("type","button");
        input.setAttribute("value","Atras");
        input.setAttribute("onclick","location.href='MOSTRAR_PRODUCTO.html';");
    }

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
function createPerson(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');

    var nombreAutor = document.getElementById("nombre").value;
    var nacimientoAutor = document.getElementById("nacimiento").value;
    var muerteAutor = document.getElementById("muerte").value;
    var retratoAutor = document.getElementById("retrato").value;
    var wikiAutor = document.getElementById("wiki").value;

    if(target == "null"){
        $.ajax({
            type: "POST",
            url: '/api/v1/persons',
            headers: {"Authorization": token},
            dataType: 'json',
            data: {
                "name" :nombreAutor,
                "birthDate" :nacimientoAutor,
                "deathDate" :muerteAutor,
                "imageUrl" :retratoAutor,
                "wikiUrl" :wikiAutor
            },
            success: function (data){
                alert("Realizado correctamente");
            }
        });
    } else{
        $.ajax({
            type: "GET",
            url: '/api/v1/persons',
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data) {

                var index = data.persons.map(function(x){return x.person.name}).indexOf(target);
                var id = data.persons[index].person.id;
                $.ajax({
                    type: "PUT",
                    url: '/api/v1/persons/'+id,
                    headers: {"Authorization": token},
                    dataType: 'json',
                    data: {
                        "name" :nombreAutor,
                        "birthDate" :nacimientoAutor,
                        "deathDate" :muerteAutor,
                        "imageUrl" :retratoAutor,
                        "wikiUrl" :wikiAutor,
                    },
                    success: function (data) {
                        alert("Realizado correctamente");
                    }
                });
            }
        });
    }

}
function editPerson(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');
    var name = sessionStorage.getItem('userName');

    console.log(target);
    if(target != "null"){
        var boton = document.getElementById("botonCreacion");
        boton.setAttribute("value","Actualizar Datos");
    }

    var nav = document.getElementById("navPerson");

    var p = document.createElement("p");
    var text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Atras");
    input.setAttribute("onclick","location.href='MOSTRAR_AUTOR.html';");

    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            var index = data.persons.map(function(x){return x.person.name}).indexOf(target);

            console.log(data.persons[index].person);

            document.getElementById("nombre").value = data.persons[index].person.name;
            document.getElementById("nacimiento").value = data.persons[index].person.birthDate;
            document.getElementById("muerte").value = data.persons[index].person.deathDate;
            document.getElementById("retrato").value = data.persons[index].person.imageUrl;
            document.getElementById("wiki").value = data.persons[index].person.wikiUrl;
        }
    });
}

function deletePerson(event){

    let token = sessionStorage.getItem('token');
    var autores = document.getElementById("cuerpoAutores");

    var autorTarget = event.target.parentElement.firstChild.nextSibling.innerHTML;

    console.log(autorTarget);

    var texto = autorTarget.replace(/<[^>]*>?/g, '');

    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {

            var index = data.persons.map(function(x){return x.person.name}).indexOf(texto);
            var id = data.persons[index].person.id;
            $.ajax({
                type: "DELETE",
                url: '/api/v1/persons/'+id,
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    alert("Realizado correctamente");
                }
            });
        }
    });

    autores.removeChild(event.target.parentElement);
}
function createEntity(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');

    var nombreEntidad = document.getElementById("nombre").value;
    var creacionEntidad = document.getElementById("creacion").value;
    var muerteEntidad = document.getElementById("muerte").value;
    var logoEntidad = document.getElementById("logo").value;
    var wikiEntidad = document.getElementById("wiki").value;
    if(target == "null"){
        $.ajax({
            type: "POST",
            url: '/api/v1/entities',
            headers: {"Authorization": token},
            dataType: 'json',
            data: {
                "name" :nombreEntidad,
                "birthDate" :creacionEntidad,
                "deathDate" :muerteEntidad,
                "imageUrl" :logoEntidad,
                "wikiUrl" :wikiEntidad
            },
            success: function (data){
                alert("Realizado correctamente");
            }
        });
    } else{
        $.ajax({
            type: "GET",
            url: '/api/v1/entities',
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data) {

                var index = data.entities.map(function(x){return x.entity.name}).indexOf(target);
                var id = data.entities[index].entity.id;
                $.ajax({
                    type: "PUT",
                    url: '/api/v1/entities/'+id,
                    headers: {"Authorization": token},
                    dataType: 'json',
                    data: {
                        "name" :nombreEntidad,
                        "birthDate" :creacionEntidad,
                        "deathDate" :muerteEntidad,
                        "imageUrl" :logoEntidad,
                        "wikiUrl" :wikiEntidad
                    },
                    success: function (data) {
                        alert("Realizado correctamente");
                    }
                });
            }
        });
    }

}
function editEntity(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');
    var name = sessionStorage.getItem('userName');

    console.log(target);
    if(target != "null"){
        var boton = document.getElementById("botonCreacion");
        boton.setAttribute("value","Actualizar Datos");
    }

    var nav = document.getElementById("navEntity");

    var p = document.createElement("p");
    var text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Atras");
    input.setAttribute("onclick","location.href='MOSTRAR_ENTIDAD.html';");

    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            var index = data.entities.map(function(x){return x.entity.name}).indexOf(target);

            document.getElementById("nombre").value = data.entities[index].entity.name;
            document.getElementById("creacion").value = data.entities[index].entity.birthDate;
            document.getElementById("muerte").value = data.entities[index].entity.deathDate;
            document.getElementById("logo").value = data.entities[index].entity.imageUrl;
            document.getElementById("wiki").value = data.entities[index].entity.wikiUrl;
        }
    });
}

function deleteEntity(event){

    let token = sessionStorage.getItem('token');
    var entidades = document.getElementById("cuerpoEntidades");

    var entidadTarget = event.target.parentElement.firstChild.nextSibling.innerHTML;


    var texto = entidadTarget.replace(/<[^>]*>?/g, '');
    console.log(texto);

    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {

            var index = data.entities.map(function(x){return x.entity.name}).indexOf(texto);
            var id = data.entities[index].entity.id;
            $.ajax({
                type: "DELETE",
                url: '/api/v1/entities/'+id,
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    alert("Realizado correctamente");
                }
            });
        }
    });

    entidades.removeChild(event.target.parentElement);
}
function loadProfile() {
    let name = sessionStorage.getItem('userName');
    let token = sessionStorage.getItem('token');

    $.ajax({
        type: "GET",
        url: '/api/v1/users',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            var index = data.users.map(function(x){return x.user.username}).indexOf(name);
            console.log(index);
            var username = data.users[index].user.username;
            var email = data.users[index].user.email;
            var rol = data.users[index].user.role;
            var nombre = data.users[index].user.name;
            var apellidos = data.users[index].user.surname;
            var fNacimiento =  data.users[index].user.birthDate;

            var nav = document.getElementById("navProfile");
            var p = document.createElement("p");
            var text = document.createTextNode("Usuario "+name);
            p.appendChild(text);
            nav.appendChild(p);
            p.style.color = "#ffffff";

            var input=document.createElement("input");
            nav.appendChild(input);
            input.setAttribute("type","button");
            input.setAttribute("value","Indice");
            input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

            var input=document.createElement("input");
            nav.appendChild(input);
            input.setAttribute("type","button");
            input.setAttribute("value","Editar");
            input.setAttribute("onclick","location.href='EDITAR_PERFIL.html';");

            var section = document.getElementById("profileInfo");

            var titulo = document.createElement("h1");
            var text = document.createTextNode("Información Personal");
            titulo.appendChild(text);
            section.appendChild(titulo);

            var hr = document.createElement("hr");
            section.appendChild(hr);

            var p = document.createElement("p");
            section.appendChild(p);

            var br = document.createElement("br");
            section.appendChild(br);

            var text = document.createTextNode("Nombre de usuario: ");
            p.appendChild(text);
            var text = document.createTextNode(username);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Email: ");
            p.appendChild(text);
            var text = document.createTextNode(email);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Tipo de ROL: ");
            p.appendChild(text);
            var text = document.createTextNode(rol);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Nombre: ");
            p.appendChild(text);
            var text = document.createTextNode(nombre);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Apellidos: ");
            p.appendChild(text);
            var text = document.createTextNode(apellidos);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);

            var text = document.createTextNode("Fecha de nacimiento: ");
            p.appendChild(text);
            var text = document.createTextNode(fNacimiento);
            p.appendChild(text);

            var br = document.createElement("br");
            p.appendChild(br);
        }
    });
}
function getidAutor(nombre) {
    var token = sessionStorage.getItem('token');
    var idAutor = null;
    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        headers: {"Authorization": token},
        dataType: 'json',
        async: false,
        success: function (data) {
            var index = data.persons.map(function (x) {return x.person.name}).indexOf(nombre);
            var idAutor = data.persons[index].person.id;
            sessionStorage.setItem('idAutor', idAutor);
        }
    });
}
function getidProducto(nombre) {
    var token = sessionStorage.getItem('token');
    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        headers: {"Authorization": token},
        dataType: 'json',
        async: false,
        success: function (data) {
            var index = data.products.map(function (x) {return x.product.name}).indexOf(nombre);
            var idProducto = data.products[index].product.id;
            sessionStorage.setItem('idProducto', idProducto);
        }
    });
}
function getidEntidad(nombre) {

    var token = sessionStorage.getItem('token');

    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        headers: {"Authorization": token},
        dataType: 'json',
        async: false,
        success: function (data) {
            var index = data.entities.map(function (x) {return x.entity.name}).indexOf(nombre);
            var idEntidad = data.entities[index].entity.id;
            sessionStorage.setItem('idEntidad', idEntidad);
        }
    });
}
function editRelationProduct(){
    var target = sessionStorage.getItem('targetGuardado');
    var token = sessionStorage.getItem('token');
    var name = sessionStorage.getItem('userName');

    var nav = document.getElementById("navRelaciones");

    var p = document.createElement("p");
    var text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Atras");
    input.setAttribute("onclick","location.href='MOSTRAR_PRODUCTO.html';");

    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            var index = data.products.map(function (x) {
                return x.product.name
            }).indexOf(target);
            var productoID = data.products[index].product.id;
            $.ajax({
                type: "GET",
                url: '/api/v1/products/' + productoID + '/persons',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    for (var j = 0; j < data.persons.length; j++) {
                        let listaAutores = document.getElementById("listaAutores");
                        var autor = document.createElement("option");
                        autor.setAttribute("value", j);
                        var text = document.createTextNode(data.persons[j].person.name);
                        autor.appendChild(text);
                        listaAutores.appendChild(autor);
                    }
                }
            });
            $.ajax({
                type: "GET",
                url: '/api/v1/products/' + productoID + '/entities',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    let listaEntidades = document.getElementById("listaEntidades");
                    for (var j = 0; j < data.entities.length; j++) {
                        var entidad = document.createElement("option");
                        entidad.setAttribute("value", j);
                        var text = document.createTextNode(data.entities[j].entity.name);
                        entidad.appendChild(text);
                        listaEntidades.appendChild(entidad);
                    }
                }
            });
        }
    });
}
function loadRelationsProduct() {
    var name = sessionStorage.getItem('userName');

    var nav = document.getElementById("navRelaciones");

    var p = document.createElement("p");
    var text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Atras");
    input.setAttribute("onclick","location.href='MOSTRAR_PRODUCTO.html';");

    var token = sessionStorage.getItem('token');
    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            let listaAutores = document.getElementById("listaAutores");
            for(let i = 0; i < data.persons.length; i++){
                var autor = document.createElement("option");
                autor.setAttribute("value", i);
                var text = document.createTextNode(data.persons[i].person.name);
                autor.appendChild(text);
                listaAutores.appendChild(autor);
            }
        }
    });
    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            let listaEntidades = document.getElementById("listaEntidades");
            for(let i = 0; i < data.entities.length; i++){
                var entidad = document.createElement("option");
                entidad.setAttribute("value", i);
                var text = document.createTextNode(data.entities[i].entity.name);
                entidad.appendChild(text);
                listaEntidades.appendChild(entidad);
            }
        }
    });
}
function createRelationProduct(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');

    var nombreAutor = document.getElementById("autor");
    var nombreEntidad = document.getElementById("entidad");
    console.log(nombreAutor);
    console.log(nombreEntidad);

    console.log(nombreAutor.selectedIndex);
    console.log(nombreEntidad.selectedIndex);
    debugger;

    var autor = nombreAutor.options[nombreAutor.selectedIndex].text;
    var entidad = nombreEntidad.options[nombreEntidad.selectedIndex].text;

    getidProducto(target);
    var idProducto = sessionStorage.getItem('idProducto');
    console.log(idProducto);

    if(autor != "Elige una opción"){
        getidAutor(autor);
        var idAutor = sessionStorage.getItem('idAutor');

        $.ajax({
            type: "PUT",
            url: '/api/v1/products/' + idProducto + '/persons/add/' + idAutor,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación añadida correctamente");
            }
        });
    }
    if(entidad != "Elige una opción"){
        getidEntidad(entidad);
        var idEntidad = sessionStorage.getItem('idEntidad');
        console.log(idEntidad);
        debugger;
        $.ajax({
            type: "PUT",
            url: '/api/v1/products/' + idProducto + '/entities/add/' + idEntidad,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación añadida correctamente");
            }
        });
    }
}
function deleteRelationProduct(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');

    var nombreAutor = document.getElementById("autor");
    var nombreEntidad = document.getElementById("entidad");
    console.log(nombreAutor);
    console.log(nombreEntidad);

    console.log(nombreAutor.selectedIndex);
    console.log(nombreEntidad.selectedIndex);
    debugger;

    var autor = nombreAutor.options[nombreAutor.selectedIndex].text;
    var entidad = nombreEntidad.options[nombreEntidad.selectedIndex].text;

    getidProducto(target);
    var idProducto = sessionStorage.getItem('idProducto');
    console.log(idProducto);

    if(autor != "Elige una opción"){
        getidAutor(autor);
        var idAutor = sessionStorage.getItem('idAutor');

        $.ajax({
            type: "PUT",
            url: '/api/v1/products/' + idProducto + '/persons/rem/' + idAutor,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación elminada correctamente");
            }
        });
    }
    if(entidad != "Elige una opción"){
        getidEntidad(entidad);
        var idEntidad = sessionStorage.getItem('idEntidad');
        console.log(idEntidad);
        debugger;
        $.ajax({
            type: "PUT",
            url: '/api/v1/products/' + idProducto + '/entities/rem/' + idEntidad,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación elminada correctamente");
            }
        });
    }
}
function loadRelationsEntity() {
    var name = sessionStorage.getItem('userName');

    var nav = document.getElementById("navRelaciones");

    var p = document.createElement("p");
    var text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Atras");
    input.setAttribute("onclick","location.href='MOSTRAR_ENTIDAD.html';");

    var token = sessionStorage.getItem('token');
    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            let listaAutores = document.getElementById("listaAutores");
            for(let i = 0; i < data.persons.length; i++){
                var autor = document.createElement("option");
                autor.setAttribute("value", i);
                var text = document.createTextNode(data.persons[i].person.name);
                autor.appendChild(text);
                listaAutores.appendChild(autor);
            }
        }
    });
    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            let listaProductos = document.getElementById("listaProductos");
            for(let i = 0; i < data.products.length; i++){
                var producto = document.createElement("option");
                producto.setAttribute("value", i);
                var text = document.createTextNode(data.products[i].product.name);
                producto.appendChild(text);
                listaProductos.appendChild(producto);
            }
        }
    });
}
function createRelationEntity(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');

    var nombreAutor = document.getElementById("autor");
    var nombreProducto = document.getElementById("producto");
    console.log(nombreAutor);
    console.log(nombreProducto);

    console.log(nombreAutor.selectedIndex);
    console.log(nombreProducto.selectedIndex);
    debugger;

    var autor = nombreAutor.options[nombreAutor.selectedIndex].text;
    var producto = nombreProducto.options[nombreProducto.selectedIndex].text;

    getidEntidad(target);
    var idEntidad = sessionStorage.getItem('idEntidad');
    console.log(idEntidad);

    if(autor != "Elige una opción"){
        getidAutor(autor);
        var idAutor = sessionStorage.getItem('idAutor');

        $.ajax({
            type: "PUT",
            url: '/api/v1/entities/' + idEntidad + '/persons/add/' + idAutor,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación añadida correctamente");
            }
        });
    }
    if(producto != "Elige una opción"){
        getidProducto(producto);
        var idProducto = sessionStorage.getItem('idProducto');
        console.log(idProducto);
        $.ajax({
            type: "PUT",
            url: '/api/v1/entities/' + idEntidad + '/products/add/' + idProducto,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación añadida correctamente");
            }
        });
    }
}
function editRelationEntity(){
    var target = sessionStorage.getItem('targetGuardado');
    var token = sessionStorage.getItem('token');
    var name = sessionStorage.getItem('userName');

    var nav = document.getElementById("navRelaciones");

    var p = document.createElement("p");
    var text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Atras");
    input.setAttribute("onclick","location.href='MOSTRAR_ENTIDAD.html';");

    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            var index = data.entities.map(function (x) {
                return x.entity.name
            }).indexOf(target);
            var entidadID = data.entities[index].entity.id;
            $.ajax({
                type: "GET",
                url: '/api/v1/entities/' + entidadID + '/persons',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    for (var j = 0; j < data.persons.length; j++) {
                        let listaAutores = document.getElementById("listaAutores");
                        var autor = document.createElement("option");
                        autor.setAttribute("value", j);
                        var text = document.createTextNode(data.persons[j].person.name);
                        autor.appendChild(text);
                        listaAutores.appendChild(autor);
                    }
                }
            });
            $.ajax({
                type: "GET",
                url: '/api/v1/entities/' + entidadID + '/products',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    let listaProductos = document.getElementById("listaProductos");
                    for (var j = 0; j < data.products.length; j++) {
                        var producto = document.createElement("option");
                        producto.setAttribute("value", j);
                        var text = document.createTextNode(data.products[j].product.name);
                        producto.appendChild(text);
                        listaProductos.appendChild(producto);
                    }
                }
            });
        }
    });
}
function deleteRelationEntity(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');

    var nombreAutor = document.getElementById("autor");
    var nombreProducto = document.getElementById("producto");

    var autor = nombreAutor.options[nombreAutor.selectedIndex].text;
    var producto = nombreProducto .options[nombreProducto .selectedIndex].text;

    getidEntidad(target);
    var idEntidad = sessionStorage.getItem('idEntidad');

    if(autor != "Elige una opción"){
        getidAutor(autor);
        var idAutor = sessionStorage.getItem('idAutor');

        $.ajax({
            type: "PUT",
            url: '/api/v1/entities/' + idEntidad + '/persons/rem/' + idAutor,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación elminada correctamente");
            }
        });
    }
    if(producto != "Elige una opción"){
        getidProducto(producto);
        var idProducto = sessionStorage.getItem('idProducto');

        $.ajax({
            type: "PUT",
            url: '/api/v1/entities/' + idEntidad + '/products/rem/' + idProducto,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación elminada correctamente");
            }
        });
    }
}
function loadRelationsPerson() {
    var name = sessionStorage.getItem('userName');

    var nav = document.getElementById("navRelaciones");

    var p = document.createElement("p");
    var text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Atras");
    input.setAttribute("onclick","location.href='MOSTRAR_AUTOR.html';");

    var token = sessionStorage.getItem('token');
    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            let listaProductos = document.getElementById("listaProductos");
            for(let i = 0; i < data.products.length; i++){
                var producto = document.createElement("option");
                producto.setAttribute("value", i);
                var text = document.createTextNode(data.products[i].product.name);
                producto.appendChild(text);
                listaProductos.appendChild(producto);
            }
        }
    });
    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            let listaEntidades = document.getElementById("listaEntidades");
            for(let i = 0; i < data.entities.length; i++){
                var entidad = document.createElement("option");
                entidad.setAttribute("value", i);
                var text = document.createTextNode(data.entities[i].entity.name);
                entidad.appendChild(text);
                listaEntidades.appendChild(entidad);
            }
        }
    });
}
function createRelationPerson(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');

    var nombreProducto = document.getElementById("producto");
    var nombreEntidad = document.getElementById("entidad");

    var producto = nombreProducto.options[nombreProducto.selectedIndex].text;
    var entidad = nombreEntidad.options[nombreEntidad.selectedIndex].text;

    getidAutor(target);
    var idAutor = sessionStorage.getItem('idAutor');

    if(producto != "Elige una opción"){
        getidProducto(producto);
        var idProducto = sessionStorage.getItem('idProducto');
        $.ajax({
            type: "PUT",
            url: '/api/v1/persons/' + idAutor + '/products/add/' + idProducto,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación añadida correctamente");
            }
        });
    }
    if(entidad != "Elige una opción"){
        getidEntidad(entidad);
        var idEntidad = sessionStorage.getItem('idEntidad');
        console.log(idEntidad);
        debugger;
        $.ajax({
            type: "PUT",
            url: '/api/v1/persons/' + idAutor + '/entities/add/' + idEntidad,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación añadida correctamente");
            }
        });
    }
}
function editRelationPerson(){
    var target = sessionStorage.getItem('targetGuardado');
    var token = sessionStorage.getItem('token');
    var name = sessionStorage.getItem('userName');

    var nav = document.getElementById("navRelaciones");

    var p = document.createElement("p");
    var text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Atras");
    input.setAttribute("onclick","location.href='MOSTRAR_AUTOR.html';");

    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            var index = data.persons.map(function (x) {
                return x.person.name
            }).indexOf(target);
            var autorID = data.persons[index].person.id;
            $.ajax({
                type: "GET",
                url: '/api/v1/persons/' + autorID + '/products',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    for (var j = 0; j < data.products.length; j++) {
                        let listaProductos = document.getElementById("listaProductos");
                        var producto = document.createElement("option");
                        producto.setAttribute("value", j);
                        var text = document.createTextNode(data.products[j].product.name);
                        producto.appendChild(text);
                        listaProductos.appendChild(producto);
                    }
                }
            });
            $.ajax({
                type: "GET",
                url: '/api/v1/persons/' + autorID + '/entities',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function (data) {
                    let listaEntidades = document.getElementById("listaEntidades");
                    for (var j = 0; j < data.entities.length; j++) {
                        var entidad = document.createElement("option");
                        entidad.setAttribute("value", j);
                        var text = document.createTextNode(data.entities[j].entity.name);
                        entidad.appendChild(text);
                        listaEntidades.appendChild(entidad);
                    }
                }
            });
        }
    });
}
function deleteRelationPerson(){
    let target = sessionStorage.getItem('targetGuardado');
    let token = sessionStorage.getItem('token');

    var nombreProducto = document.getElementById("producto");
    var nombreEntidad = document.getElementById("entidad");

    var producto = nombreProducto.options[nombreProducto.selectedIndex].text;
    var entidad = nombreEntidad.options[nombreEntidad.selectedIndex].text;

    getidAutor(target);
    var idAutor = sessionStorage.getItem('idAutor');

    if(producto != "Elige una opción"){
        getidProducto(producto);
        var idProducto = sessionStorage.getItem('idProducto');

        $.ajax({
            type: "PUT",
            url: '/api/v1/persons/' + idAutor + '/products/rem/' + idProducto,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación elminada correctamente");
            }
        });
    }
    if(entidad != "Elige una opción"){
        getidEntidad(entidad);
        var idEntidad = sessionStorage.getItem('idEntidad');
        $.ajax({
            type: "PUT",
            url: '/api/v1/persons/' + idAutor + '/entities/rem/' + idEntidad,
            headers: {"Authorization": token},
            dataType: 'json',
            success: function (data, status, response) {
                alert("Relación elminada correctamente");
            }
        });
    }
}
function editProfile(){
    let token = sessionStorage.getItem('token');
    let name = sessionStorage.getItem('userName');

    var boton = document.getElementById("botonCreacion");
    boton.setAttribute("value","Actualizar Perfil");

    var nav = document.getElementById("navPerfil");

    let p = document.createElement("p");
    let text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Perfil");
    input.setAttribute("onclick","location.href='PERFIL.html';");

    $.ajax({
        type: "GET",
        url: '/api/v1/users',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            var index = data.users.map(function(x){return x.user.username}).indexOf(name);
            console.log(data.users[index].user);
            document.getElementById("usern").value = data.users[index].user.username;
            document.getElementById("nombre").value = data.users[index].user.name;
            document.getElementById("apellidos").value = data.users[index].user.surname;
            document.getElementById("cumpleaños").value = data.users[index].user.birthDate;
            document.getElementById("correo").value = data.users[index].user.email;

        }
    });
}
function updateProfile(){
    let token = sessionStorage.getItem('token');
    let name = sessionStorage.getItem('userName');

    var usern = document.getElementById("usern").value;
    var nombre = document.getElementById("nombre").value;
    var apellidos = document.getElementById("apellidos").value;
    var cumpleaños = document.getElementById("cumpleaños").value;
    var correo = document.getElementById("correo").value;
    var contraseña = document.getElementById("contraseña").value;
    console.log(usern);

    console.log(contraseña);
    debugger;
    $.ajax({
        type: "GET",
        url: '/api/v1/users',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            var index = data.users.map(function(x){return x.user.username}).indexOf(name);
            var id = data.users[index].user.id;

            if((correo == data.users[index].user.email) && (usern == data.users[index].user.username) && (contraseña == '')){
                usuario = {
                    name: nombre,
                    surname: apellidos,
                    birthDate: cumpleaños
                }
            }else if ((correo == data.users[index].user.email) && (usern == data.users[index].user.username) && (contraseña != '')){
                    usuario = {
                        password: contraseña,
                        name: nombre,
                        surname: apellidos,
                        birthDate: cumpleaños
                    }
            }else if ((correo == data.users[index].user.email) && (usern != data.users[index].user.username) && (contraseña == '')){
                    sessionStorage.setItem('userName', usern);
                    usuario = {
                        username: usern,
                        name: nombre,
                        surname: apellidos,
                        birthDate: cumpleaños
                    }
                }else if ((correo == data.users[index].user.email) && (usern != data.users[index].user.username) && (contraseña != '')){
                    sessionStorage.setItem('userName', usern);
                    usuario = {
                        username: usern,
                        password: contraseña,
                        name: nombre,
                        surname: apellidos,
                        birthDate: cumpleaños
                    }
                }else if ((correo != data.users[index].user.email) && (usern == data.users[index].user.username) && (contraseña == '')){
                    usuario = {
                        email: correo,
                        name: nombre,
                        surname: apellidos,
                        birthDate: cumpleaños
                    }
                }else if ((correo != data.users[index].user.email) && (usern == data.users[index].user.username) && (contraseña != '')){
                    usuario = {
                        email: correo,
                        password: contraseña,
                        name: nombre,
                        surname: apellidos,
                        birthDate: cumpleaños
                    }
                }
                else if ((correo != data.users[index].user.email) && (usern != data.users[index].user.username) && (contraseña == '')){
                    sessionStorage.setItem('userName', usern);
                    usuario = {
                        email: correo,
                        username: usern,
                        name: nombre,
                        surname: apellidos,
                        birthDate: cumpleaños
                    }
                }
                else if ((correo != data.users[index].user.email) && (usern != data.users[index].user.username) && (contraseña != '')){
                    sessionStorage.setItem('userName', usern);
                    usuario = {
                        email: correo,
                        username: usern,
                        password: contraseña,
                        name: nombre,
                        surname: apellidos,
                        birthDate: cumpleaños
                    }
                }

                $.ajax({
                    type: "PUT",
                    url: '/api/v1/users/'+id,
                    headers: {"Authorization": token},
                    dataType: 'json',
                    data: usuario,
                        success: function (data) {
                            alert("Realizado correctamente");
                        }
                    });
                }
            });
}
function loadUsers() {
    let token = sessionStorage.getItem('token');
    let nombreU = sessionStorage.getItem('userName');
    var nav = document.getElementById("navUsuarios");

    var p = document.createElement("p");
    var text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Solicitudes de registro");
    input.setAttribute("onclick","location.href='SOLICITUDES_REGISTRO.html';");

    var tablaUsers = document.getElementById("tablaUsuarios");
    var tbody = document.createElement("tbody");
    tbody.setAttribute("id", "cuerpoUsuarios");
    tablaUsers.appendChild(tbody);
    $.ajax({
        type: "GET",
        url: '/api/v1/users',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            for(var i = 0; i < data.users.length; i++){
                if((data.users[i].user.username != nombreU) && (data.users[i].user.authorized == 1)){

                    var tr = document.createElement("tr");
                    tbody.appendChild(tr);
                    var td = document.createElement("td");
                    tr.appendChild(td);
                    var text = document.createTextNode(data.users[i].user.id);
                    td.appendChild(text);

                    var td = document.createElement("td");
                    tr.appendChild(td);
                    text = document.createTextNode(data.users[i].user.username);
                    td.appendChild(text);

                    var td = document.createElement("td");
                    tr.appendChild(td);
                    text = document.createTextNode(data.users[i].user.email);
                    td.appendChild(text);

                    var td = document.createElement("td");
                    tr.appendChild(td);
                    text = document.createTextNode(data.users[i].user.firstname);
                    td.appendChild(text);

                    var td = document.createElement("td");
                    tr.appendChild(td);
                    text = document.createTextNode(data.users[i].user.lastname);
                    td.appendChild(text);

                    var td = document.createElement("td");
                    tr.appendChild(td);
                    text = document.createTextNode(data.users[i].user.birthDate);
                    td.appendChild(text);

                    var td = document.createElement("td");
                    tr.appendChild(td);
                    text = document.createTextNode(data.users[i].user.role);
                    td.appendChild(text);

                    if(data.users[i].user.active == 1){
                        var td = document.createElement("td");
                        tr.appendChild(td);
                        text = document.createTextNode("Si");
                        td.appendChild(text);
                    }else{
                        var td = document.createElement("td");
                        tr.appendChild(td);
                        text = document.createTextNode("No");
                        td.appendChild(text);
                    }

                    var input=document.createElement("input");
                    tr.appendChild(input);
                    if(data.users[i].user.active == 0){
                        input.setAttribute("type","button");
                        input.setAttribute("value","Activar Usuario");
                        input.setAttribute("onclick","activeUser(event);location.href='USUARIOS.html';");
                    }else{
                        input.setAttribute("type","button");
                        input.setAttribute("value","Desactivar Usuario");
                        input.setAttribute("onclick","desactiveUser(event);location.href='USUARIOS.html';");
                    }
                    var input=document.createElement("input");
                    tr.appendChild(input);
                    input.setAttribute("type","button");
                    input.setAttribute("value","Dar de baja usuario");
                    input.setAttribute("onclick","deleteUser(event);location.href='USUARIOS.html';");
                }
            }
        }
    });
}
function desactiveUser(event){
    let token = sessionStorage.getItem('token');
    var idTarget = event.target.parentElement.firstChild.innerHTML;

    var usuario = {
        active: 0
    }
    $.ajax({
        type: "PUT",
        url: '/api/v1/users/'+idTarget,
        headers: {"Authorization": token},
        dataType: 'json',
        data: usuario,
        success: function (data) {
            alert("Realizado correctamente");
        }
    });
}
function activeUser(event){
    let token = sessionStorage.getItem('token');
    var idTarget = event.target.parentElement.firstChild.innerHTML;

    var usuario = {
        active: 1
    }
    $.ajax({
        type: "PUT",
        url: '/api/v1/users/'+idTarget,
        headers: {"Authorization": token},
        dataType: 'json',
        data: usuario,
        success: function (data) {
            alert("Realizado correctamente");
        }
    });
}
function registerUser() {

    var usern = document.getElementById("usern").value;
    var contraseña = document.getElementById("contraseña").value;
    console.log(usern);
    debugger;
    $.ajax({
        type: "GET",
        url: '/api/v1/users/username/'+usern,
        dataType: 'json',
        success: function (data) {
            alert("Error al validar los datos, el nombre de usuario introducido ya existe");
        },
        error: function (data) {
            sessionStorage.setItem('usuarioRegistro', usern);
            sessionStorage.setItem('contraseñaRegistro', contraseña);
            window.location.replace("./REGISTRO_COMPLETO.html");
        }
    });
    debugger;
}

function validateRegister() {
    var nombreU = sessionStorage.getItem('usuarioRegistro');
    var contraseñaU = sessionStorage.getItem('contraseñaRegistro');
    var nombre = document.getElementById("nombre").value;
    var apellidos = document.getElementById("apellidos").value;
    var correo = document.getElementById("correo").value;
    var cumpleaños = document.getElementById("cumpleaños").value;

    var usuario = {
        username: nombreU,
        password: contraseñaU,
        email: correo,
        name: nombre,
        surname: apellidos,
        birthDate: cumpleaños,
        role: "reader",
        authorized: 0,
        active: 0
    }
    $.ajax({
        type: "POST",
        url: '/api/v1/users',
        dataType: 'json',
        data: usuario,
        async: false,
        success: function (data) {
            window.location.replace("./index.html");
            alert("Te has registrado correctamente");

        }, error: function () {
            alert("El correo introducido ya está en uso, porfavor introduce otro");
        }
    });
    debugger;
}
function loadUsersRegister() {
    var token = sessionStorage.getItem('token');
    var name = sessionStorage.getItem('userName');

    var nav = document.getElementById("navUsuarios");

    var p = document.createElement("p");
    var text = document.createTextNode("Usuario "+name);
    p.appendChild(text);
    nav.appendChild(p);
    p.style.color = "#ffffff";

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Indice");
    input.setAttribute("onclick","location.href='SHOWED_INDEX.html';");

    var input=document.createElement("input");
    nav.appendChild(input);
    input.setAttribute("type","button");
    input.setAttribute("value","Atras");
    input.setAttribute("onclick","location.href='USUARIOS.html';");

    var tablaUsers = document.getElementById("tablaUsuarios");
    var tbody = document.createElement("tbody");
    tablaUsers.appendChild(tbody);
    $.ajax({
        type: "GET",
        url: '/api/v1/users',
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            for(var i = 0; i < data.users.length; i++){
                if(data.users[i].user.authorized == 0){

                    var tr = document.createElement("tr");
                    tbody.appendChild(tr);
                    var td = document.createElement("td");
                    tr.appendChild(td);
                    var text = document.createTextNode(data.users[i].user.id);
                    td.appendChild(text);

                    var td = document.createElement("td");
                    tr.appendChild(td);
                    text = document.createTextNode(data.users[i].user.username);
                    td.appendChild(text);

                    var td = document.createElement("td");
                    tr.appendChild(td);
                    text = document.createTextNode(data.users[i].user.email);
                    td.appendChild(text);

                    var td = document.createElement("td");
                    tr.appendChild(td);
                    text = document.createTextNode(data.users[i].user.firstname);
                    td.appendChild(text);

                    var td = document.createElement("td");
                    tr.appendChild(td);
                    text = document.createTextNode(data.users[i].user.lastname);
                    td.appendChild(text);

                    var td = document.createElement("td");
                    tr.appendChild(td);
                    text = document.createTextNode(data.users[i].user.birthDate);
                    td.appendChild(text);

                    var select = document.createElement("select");

                    select.innerHTML = `<select>
                    <option selected="" value="0">Selecciona un Rol</option>
                    <optgroup label="Roles">
                    <option value="0">Writer</option>
                    <option value="1">Reader</option>
                    </optgroup>
                    </select>`;
                    select.setAttribute("id", "rol");
                    var td = document.createElement("td");
                    tr.appendChild(td);
                    td.appendChild(select);

                    var input=document.createElement("input");
                    tr.appendChild(input);
                    input.setAttribute("type","button");
                    input.setAttribute("value","Validar Usuario");
                    input.setAttribute("onclick","validateUser(event);location.href='SOLICITUDES_REGISTRO.html';");
                }
            }
        }
    });
}

function validateUser(event){
    let token = sessionStorage.getItem('token');
    var idTarget = event.target.parentElement.firstChild.innerHTML;
    var nombreRol = document.getElementById("rol");
    var rol = nombreRol.options[nombreRol.selectedIndex].text;
    console.log(rol);
    debugger;
    if(rol != "Selecciona un Rol"){
        var usuario = {
            active: 1,
            authorized: 1,
            role: rol
        }
        $.ajax({
            type: "PUT",
            url: '/api/v1/users/'+idTarget,
            headers: {"Authorization": token},
            dataType: 'json',
            data: usuario,
            success: function (data) {
                alert("Usuario validado correctamente");
            }
        });
    }else{
        alert("Error al validar el usuario, debes seleccionar un Rol")
    }
}
function deleteUser(event){

    let token = sessionStorage.getItem('token');
    var usuarios = document.getElementById("cuerpoUsuarios");

    var idTarget = event.target.parentElement.firstChild.innerHTML;

    $.ajax({
        type: "DELETE",
        url: '/api/v1/users/'+idTarget,
        headers: {"Authorization": token},
        dataType: 'json',
        success: function (data) {
            alert("Usuario eliminado correctamente");
        }
    });
}
