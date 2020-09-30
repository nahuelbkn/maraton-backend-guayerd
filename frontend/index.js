
document.addEventListener("DOMContentLoaded", init);

function init()
{
    // Url servidor
    const URL_SERVER = "http://localhost:3001";



    // Dom --------------------------------------------------------------------------------------------------------------------
    const buttonAgregar = document.querySelector('button.agregar');
    const buttonBusqueda = document.querySelector('button.busqueda');
    const buttonEditar = document.querySelector('button.editar');
    const buttonBorrar = document.querySelector('button.borrar');

    


    // Ejecuciones necesarias -------------------------------------------------------------------------------------------------
    cargarLista();



    // Eventos ----------------------------------------------------------------------------------------------------------------
    buttonAgregar.addEventListener("click", agregarHandler);
    buttonBusqueda.addEventListener("click", busquedaHandler); // TODO 
    buttonEditar.addEventListener("click", editarHandler); // TODO 
    buttonBorrar.addEventListener("click", borrarHandler);  // TODO 



    // 



    // Handlers ----------------------------------------------------------------------------------------------------------------
    function agregarHandler(event)
    {
        event.preventDefault();

        // Dom div.agregar
        const divCompras = document.querySelector('div.nuevaCompra');
        

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
                    
                        <div class="mini-bloque">
                            <label for="products">Productos</label> </br>
                            <input type="text" name="products" id="products" class="products" placeholder="Ingrese el/los códigos."></br>
                            <label class="reducir-fuente" for="products">Si es más de un código, </br>ingreselos separados por comas.</label> </br>
                        </div>

                        <div class="mini-bloque">
                            <label for="amount">Monto de la compra</label> </br>
                            <input type="number" name="amount" id="amount" class="amount" placeholder="Ingrese el monto de la compra.">
                        </div>

                        <div class="mini-bloque">
                            <label for="paymentMethod">Método de pago</label> </br>
                            <select name="paymentMethod" id="paymentMethod" class="paymentMethod">
                                <option disabled selected class="disabled">Seleccione método de pago.</option>
                                <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Bitcoin">Bitcoin</option>
                            </select>
                        </div>
                    </div>

                    <div class="boton"><button type="submit" class="submitCompra" id="submitCompra">Guardar compra</button></div>
                </form>
            `;

            divCompras.classList.remove("agregar");
            divCompras.classList.add("agregando");
            divCompras.innerHTML = tarjetaFormAgregar;

            // Alterno función botón
            buttonAgregar.classList.remove("agregar");
            buttonAgregar.classList.add("cancelar");
            buttonAgregar.textContent = "Cancelar compra";

            const BUTTON_SUBMIT = document.querySelector('button.submitCompra');
            BUTTON_SUBMIT.addEventListener("click", submitHandler);
            
        }
        else if ( buttonAgregar.classList.toString().includes("cancelar") )
        {
            divCompras.innerHTML = "";
            divCompras.classList.remove("agregando");

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

        if ( INPUT_clientId.value && INPUT_products.value && INPUT_amount.value && SELECT_paymentMethod.value )
        {
            let productos = INPUT_products.value.split(",");
            console.log(productos)
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

            INPUT_clientId.value = "";
            INPUT_products.value = "";
            INPUT_amount.value = "";

            cargarLista();
            enviarDatosAlServidor(compra);
        }
    }



    // Funciones extra ----------------------------------------------------------------------
    function cargarLista()
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
                                    <button class="put">Editar</button>
                                    <button class="delete">Borrar</button>
                                </div>
                            </td>
                        </tr>

                    `;

                    tarjetas += tarjeta;
                });

                bodyTabla.innerHTML = tarjetas;


                // Solo si hay al menos un elemento en la lista, se añade un buscador por ID de compra...
                const divBusqueda = document.querySelector('div.lista-busqueda');
                
                let tarjetaBuscador =
                `
                    <input type="text" class="busqueda" placeholder="Buscar por ID">
                    <button class="busqueda">Buscar</button>
                `;
                
                divBusqueda.innerHTML += tarjetaBuscador;
            }
        }
    }

    function enviarDatosAlServidor(OBJ_Mensaje)
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
            console.log(mensaje);
        });
    }
}





