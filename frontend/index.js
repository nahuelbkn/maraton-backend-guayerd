

// PENDIENTE: Queda pendiente una revisión de todo este código, tiene muchas cosas que mejorar, modularizar, etc.




const URL_SERVER = "http://localhost:3001";

document.addEventListener("DOMContentLoaded", init);

function init()
{
    // Url servidor
    



    // Dom --------------------------------------------------------------------------------------------------------------------
    const buttonAgregar = document.querySelector('button.agregar');
    

    


    // Ejecuciones necesarias -------------------------------------------------------------------------------------------------
    cargarLista();



    // Eventos ----------------------------------------------------------------------------------------------------------------
    buttonAgregar.addEventListener("click", agregarHandler);




    // Handlers ----------------------------------------------------------------------------------------------------------------
    function agregarHandler(event)
    {
        event.preventDefault();

        // Dom div.agregar
        const divNuevaCompra = document.querySelector('div.nuevaCompra');
        

        if( buttonAgregar.classList.toString().includes("agregar") )
        {
            let tarjetaFormAgregar =
            `
                <h3>Nueva compra</h3>

                <br>

                <form action="#" class="agregarElemento">
                    <div class="bloque-datos">
                        <div class="mini-bloque">
                            <label for="clientId">Código cliente</label> </br>
                            <input type="number" name="clientId" id="clientId" class="clientId" placeholder="Ingrese el código del cliente.">
                        </div>

                        </br>
                    
                        <div class="mini-bloque">
                            <label for="products">Productos</label> </br>
                            <input type="text" name="products" id="products" class="products" placeholder="Ingrese el/los códigos."></br>
                            <label class="reducir-fuente" for="products">Si es más de un código, </br>ingreselos separados por comas.</label> </br>
                        </div>

                        </br>

                        <div class="mini-bloque">
                            <label for="amount">Monto de la compra</label> </br>
                            <input type="number" name="amount" id="amount" class="amount" placeholder="Ingrese el monto de la compra.">
                        </div>

                        </br>

                        <div class="mini-bloque">
                            <label for="paymentMethod">Método de pago</label> </br>
                            <select name="paymentMethod" id="paymentMethod" class="paymentMethod">
                                <option disabled selected value="0" class="disabled">Seleccione método de pago.</option>
                                <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Bitcoin">Bitcoin</option>
                            </select>
                        </div>

                        </br>
                    </div>

                    <div class="boton"><button type="submit" class="submitCompra" id="submitCompra">Guardar compra</button></div>
                </form>
            `;

                divNuevaCompra.classList.remove("agregar");
                divNuevaCompra.classList.add("agregando");
            divNuevaCompra.innerHTML = tarjetaFormAgregar;

            // Alterno función botón
            buttonAgregar.classList.remove("agregar");
            buttonAgregar.classList.add("cancelar");
            buttonAgregar.textContent = "Cancelar compra";

            const BUTTON_SUBMIT = document.querySelector('button.submitCompra');
            BUTTON_SUBMIT.addEventListener("click", submitHandler);
            
        }
        else if ( buttonAgregar.classList.toString().includes("cancelar") )
        {
            divNuevaCompra.classList.remove("agregando");
            divNuevaCompra.innerHTML = "";

            // Alterno función botón
            buttonAgregar.classList.remove("cancelar");
            buttonAgregar.classList.add("agregar");
            buttonAgregar.textContent = "Agregar compra";
        }
    }


    function submitHandler(event)
    {
        event.preventDefault();
        
        // DOM
        const INPUT_clientId = document.querySelector('input.clientId');
        const INPUT_products = document.querySelector('input.products');
        const INPUT_amount = document.querySelector('input.amount');
        const SELECT_paymentMethod = document.querySelector('select.paymentMethod');
        

        if ( INPUT_clientId.value && INPUT_products.value && INPUT_amount.value && SELECT_paymentMethod.value != 0 )
        {
            let productos = INPUT_products.value.split(",");
            // Se podrían recibir datos de dos maneras diferentes:
            //      - "10"
            //      - "10,20,30,40,50,60,70"
            // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String/split

            let compra = 
            {
                "clientId": INPUT_clientId.value,
                "products": productos,
                "amount": INPUT_amount.value,
                "paymentMethod": SELECT_paymentMethod.value
            };

            enviarDatosAlServidor(compra);
        }
    }

    function busquedaHandler(event)
    {
        event.preventDefault();

        const INPUT_busqueda = document.querySelector('input.busqueda');

        if ( INPUT_busqueda.value )
        {
            busquedaPorID(INPUT_busqueda.value);
        }
    }








    // Funciones extra ----------------------------------------------------------------------
    function cargarLista() // GET/compras
    {
        fetch(URL_SERVER + "/compras")
        .then(function(response)
        {
            return response.json();
        })
        .then(function(datos)
        {
            mostrarLista(datos.compras);   
        });


        function mostrarLista(arrayDatos)
        {
            if ( arrayDatos[0] )
            {
                let tabla =
                `
                    <div class="lista-cargada">
                        <table class="compras">
                            <thead>
                                <tr>
                                    <td>ID compra</td>
                                    <td>Código de cliente</td>
                                    <td>Productos</td>
                                    <td>Monto de la compra</td>
                                    <td>Método de pago</td>
                                    <td>Opciones</td>
                                </tr>
                            </thead>
                            <tbody class="compras"></tbody>
                        </table>
                    </div>
                `;


                const divLista = document.querySelector('div.lista');
                divLista.innerHTML = tabla;

                const bodyTabla = document.querySelector('tbody.compras');
                let tarjetas = "";

                
                arrayDatos.forEach(function(compra)
                {
                    let tarjeta = 
                    `
                        <tr>
                            <td>${compra.id}</td>
                            <td>${compra.clientId}</td>
                            <td>${compra.products}</td>
                            <td>${compra.amount}</td>
                            <td>${compra.paymentMethod}</td>
                            <td>
                                <div class"botones-BM">
                                    <button class="put" onclick="editarCompra('${compra.id}')">Editar</button>
                                    <button class="delete" onclick="borrarCompra('${compra.id}')">Borrar</button>
                                </div>
                            </td>
                        </tr>
                    `;

                    tarjetas += tarjeta;
                });

                bodyTabla.innerHTML = tarjetas;


                // Solo si hay al menos un elemento en la lista, se añade un buscador por ID de compra...
                const divBusqueda = document.querySelector('div.busqueda');
                
                let tarjetaBuscador =
                `
                    <input type="text" class="busqueda" placeholder="Buscar por ID">
                    <button class="busqueda">Buscar</button>
                `;
                
                divBusqueda.innerHTML = tarjetaBuscador;

                const BUTTON_busqueda = document.querySelector('button.busqueda');
                BUTTON_busqueda.addEventListener("click", busquedaHandler);
            }
        }
    }

    function enviarDatosAlServidor(OBJ_Mensaje) // POST/compras
    {
        fetch(`${URL_SERVER}/compras`, {
            method:'POST',
            body: JSON.stringify(OBJ_Mensaje),
            headers:{'Content-Type':'application/json'} 
        })
        .then(function(response)
        {
            return response.json()
        })
        .then(function(mensaje)
        {
            cargarLista();
            console.log(mensaje);
            const divNuevaCompra = document.querySelector('div.nuevaCompra');
            divNuevaCompra.innerHTML = `<h3>Compra guardada.</h3>`;

            // Alterno función botón
            buttonAgregar.classList.remove("cancelar");
            buttonAgregar.classList.add("agregar");
            buttonAgregar.textContent = "Agregar compra";
        });
    }
}


// Funciones ONCLICK -------------------------------------------------------------------------------------------
function editarCompra(idEditar)
{
    const divBotonAgregar = document.querySelector('div.agregar-compra');
    const divEDIT = document.querySelector('div.edit');

    divBotonAgregar.innerHTML = "";
    divEDIT.classList.add("editando");

    busquedaPorID(idEditar)

    divEDIT.innerHTML = 
    `
        <h3>
            Editar compra (ID: ${idEditar})
        </h3>
        
        <div class="bloque-datos">
            <div class="mini-bloque">
                <label for="clientId">Código cliente</label> </br>
                <input type="number" name="clientId" id="clientId" class="clientId" placeholder="Ingrese el código del cliente.">
            </div>

            </br>
        
            <div class="mini-bloque">
                <label for="products">Productos</label> </br>
                <input type="text" name="products" id="products" class="products" placeholder="Ingrese el/los códigos."></br>
                <label class="reducir-fuente" for="products">Si es más de un código, </br>ingreselos separados por comas.</label> </br>
            </div>

            </br>

            <div class="mini-bloque">
                <label for="amount">Monto de la compra</label> </br>
                <input type="number" name="amount" id="amount" class="amount" placeholder="Ingrese el monto de la compra.">
            </div>

            </br>

            <div class="mini-bloque">
                <label for="paymentMethod">Método de pago</label> </br>
                <select name="paymentMethod" id="paymentMethod" class="paymentMethod">
                    <option disabled selected class="disabled" value="0">Seleccione método de pago.</option>
                    <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Bitcoin">Bitcoin</option>
                </select>
            </div>

            </br>
        </div>

        <div class="boton">
            <button class="cancelarCambios" id="cancelarCambios">Cancelar cambios</button>
            <button type="submit" class="submitCambios" id="submitCambios" idcompra="${idEditar}">Guardar cambios</button>
        </div>
    `;

    const buttonCancelEdit = document.querySelector('button.cancelarCambios');
    const buttonSaveEdit = document.querySelector('button.submitCambios');

    buttonCancelEdit.addEventListener("click", cancelEditHandler)
    buttonSaveEdit.addEventListener("click", saveEditHandler)
    

    function cancelEditHandler(event)
    {
        event.preventDefault();

        const divEditando = document.querySelector('div.editando');

        divEditando.innerHTML = 
        `
            <h3>
                Cambios cancelados.
            </h3>
        `;
    }


    function saveEditHandler(event)
    {
        event.preventDefault();

       

        const INPUT_clientId = document.querySelector('input.clientId');
        const INPUT_products = document.querySelector('input.products');
        const INPUT_amount = document.querySelector('input.amount');
        const SELECT_paymentMethod = document.querySelector('select.paymentMethod');
        

        if ( INPUT_clientId.value && INPUT_products.value && INPUT_amount.value && SELECT_paymentMethod.value != 0 )
        {
            console.log(event.target);

            const ID_EDIT = event.target.getAttribute("idcompra");
            console.log(ID_EDIT);


            let productos = INPUT_products.value.split(",");
            // Se podrían recibir datos de dos maneras diferentes:
            //      - "10"
            //      - "10,20,30,40,50,60,70"
            // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String/split

            let compraActualizada = 
            {
                "clientId": INPUT_clientId.value,
                "products": productos,
                "amount": INPUT_amount.value,
                "paymentMethod": SELECT_paymentMethod.value
            };

            actualizarDatosEnServidor(ID_EDIT, compraActualizada);
        }
    
    }
}

function borrarCompra(idBorrar)
{
    if( confirm("¿Realmente quiere borrar la compra?") )
    {
        fetch(`${URL_SERVER}/compras/${idBorrar}`,{
            'method':'DELETE'
        }).then(function(response)
        {
            return response.json();
        }).then(function(respuesta)
        {
            const divBotonAgregar = document.querySelector('div.agregar-compra');
            divBotonAgregar.innerHTML = "";

            console.log(respuesta.mensaje || respuesta.error );
            
            const divLista = document.querySelector('div.lista-cargada');
            let tarjeta = 
            `
                <div class="borrada">
                    <h3>
                        Compra borrada.
                    </h3>
                </div>
            `;

    
            divLista.innerHTML = tarjeta;

            const divBusqueda = document.querySelector('div.busqueda');            
            const divNuevaCompra = document.querySelector('div.nuevaCompra');
            const divEDIT = document.querySelector('div.edit');

            divBusqueda.innerHTML = `<button class="volver" onclick="window.location.reload()">Volver al listado</button>`;
            divNuevaCompra.classList.remove("agregando");
            divNuevaCompra.innerHTML = "";

            divEDIT.classList.remove("editando");
            divEDIT.innerHTML = "";
        });
    }
}



////////////////////////////////////////////////////// Más funciones ////////////////////////////////////////////7

function busquedaPorID(id)
{
    const divBotonAgregar = document.querySelector('div.agregar-compra');
    divBotonAgregar.innerHTML = "";
    
    fetch(`${URL_SERVER}/compras/${id}`)
    .then(function(response)
    {
        return response.json();
    })
    .then(function(respuesta)
    {
        mostrarRespuesta(respuesta);
    });


    let mostrarRespuesta = function(objRespuesta)
    {
        const divNuevaCompra = document.querySelector('div.nuevaCompra');
        
        divNuevaCompra.innerHTML = "";
        divNuevaCompra.classList.remove("agregando");

        const divLista = document.querySelector('div.lista-cargada');
        let tarjeta = "";

        if ( objRespuesta.id )
        {
            // Convertir fecha. (Se puede modularizar) -----------------------
            let fechaOriginal = objRespuesta.createdAt;
            let fecha = 
                fechaOriginal.substr(8,2) + "-" +
                fechaOriginal.substr(5,2) + "-" +
                fechaOriginal.substr(0,4) + " " +
                fechaOriginal.substr(11,5);
                // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String/substr
            //----------------------------------------------------------------

            const divBusqueda = document.querySelector('div.busqueda');
            divBusqueda.innerHTML = `<button class="volver" onclick="window.location.reload()">Volver al listado</button>`;


            tarjeta = 
            `
                <table class="compras">
                    <thead>
                        <tr>
                            <td>ID compra</td>
                            <td>Código de cliente</td>
                            <td>Productos</td>
                            <td>Monto de la compra</td>
                            <td>Método de pago</td>
                            <td>Fecha</td>
                            <td>Opciones</td>
                        </tr>
                    </thead>
                    <tbody class="compras">
                        <tr>
                            <td>${objRespuesta.id}</td>
                            <td>${objRespuesta.clientId}</td>
                            <td>${objRespuesta.products}</td>
                            <td>${objRespuesta.amount}</td>
                            <td>${objRespuesta.paymentMethod}</td>
                            <td>${fecha}</td>
                            <td>
                                <div class"botones-BM">
                                    <button class="put" onclick="editarCompra('${objRespuesta.id}')">Editar</button>
                                    <button class="delete" onclick="borrarCompra('${objRespuesta.id}')">Borrar</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;
        }
        else
        {
            tarjeta = 
            `
                <div class="not-found-id">
                    <h3>
                        No se encontró el ID (${id}).
                    </h3>
                </div>
            `;           
            
            const divBusqueda = document.querySelector('div.busqueda');
            divBusqueda.innerHTML = `<button class="volver" onclick="window.location.reload()">Volver al listado</button>`;
            
        }

        divLista.innerHTML = tarjeta;
    }
}

function actualizarDatosEnServidor(idEditar, OBJ_Mensaje)
{
    fetch(`${URL_SERVER}/compras/${idEditar}`, {
        method:'PUT',
        body: JSON.stringify(OBJ_Mensaje),
        headers:{'Content-Type':'application/json'} 
    })
    .then(function(response)
    {
        return response.json()
    })
    .then(function(respuesta)
    {
        // Aviso por consola (Desde el servidor).
        console.log(respuesta.mensaje);

        busquedaPorID(idEditar);

        const divEditando = document.querySelector('div.editando');
        divEditando.innerHTML = `<h3>Cambios guardados.</h3>`;
    });
}