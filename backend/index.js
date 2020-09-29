
/* Objeto de pruebas -------------------------------------------------------
{
  "id": "prueba",
  "clientId": "1000",
  "products": ["100","300","400","500","600","700","800"],
  "amount": 10000,
  "paymentMethod": "Credit Card"
}
--------------------------------------------------------------------------*/


// Se importan dependencias.
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const uniqid = require("uniqid");
// https://www.npmjs.com/package/uniqid


// Se instancia la API.
const app = express();

// Se define el puerto.
const PORT = 3001;

//////////////////// Aplico Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));


///////////////////// Init Array de Compras. (Simulo una Base de datos)
let compras = [];

//////////////////// Defino Rutas, me baso en el modelo REST
app.get("/compras", function (req, res)
{
  // Aviso por consola.
  console.log("//---------------------------------------------------------------\n ");
  console.log("  >> Mostrando lista de compras.\n")
  console.log("//---------------------------------------------------------------\n ");

  res.status(201).send({ compras });
});

app.get("/compras/:id", function (req, res)
{
  const ID_COMPRA = req.params.id;

  let compraBuscada = compras.filter(compra => compra.id == ID_COMPRA)[0]; // Atención a los conchetes y el valor 0 del final.
  // Filter retorna un nuevo arreglo, y en este caso solo puede estar vacío o contener el elemento que conincide en ID con ID_COMPRA.
  // Por eso uso los corchetes, para que compraBuscada guarde el elemento de la poscición 0, en lugar de guardar el arreglo.
  // Documentación FILTER: https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/filter

  if ( compraBuscada )
  {
    // Aviso por consola.
    console.log("//---------------------------------------------------------------\n ");
    console.log(`  >> Mostrando compra ID: ${compraBuscada.id}.\n`);
    console.log(`     > ID cliente: ${compraBuscada.clientId}.`);
    console.log(`     > Productos: ${compraBuscada.products}.`);
    console.log(`     > Precio total: ${compraBuscada.amount}.`);
    console.log(`     > Método de pago: ${compraBuscada.paymentMethod}.\n`);
    console.log("//---------------------------------------------------------------\n ");

    res.status(201).send(compraBuscada);
  }
  else
  {
    // Aviso por consola.
    console.log("//---------------------------------------------------------------\n ");
    console.log(`   >> Compra ${ID_COMPRA}: No registrada en el sistema\n.`);
    console.log("//---------------------------------------------------------------\n ");

    res.status(404).send({error: `Compra ${ID_COMPRA}: No registrada en el sistema.`});
  }
  
});

app.post("/compras", function (req, res)
{
  let nuevaCompra = req.body;

  const DATOS_OK = validarExistenciaDatos(nuevaCompra); // Retorna true o false.

  if ( DATOS_OK )
  {
    // Se termina de conformar el objeto compra.
    nuevaCompra = agregarIDYFecha(nuevaCompra);

    // Se agrega
    compras.push(nuevaCompra);

    // Aviso por consola.
    console.log("//---------------------------------------------------------------\n ");
    console.log(`   >> Compra ${nuevaCompra.id}: Agregada a lista de compras.\n.`);
    console.log("//---------------------------------------------------------------\n ");

    res.status(201).send({mensaje: `Compra ${nuevaCompra.id}: Agregada a lista de compras.`});
  }
  else
  {
    // Aviso por consola.
    console.log("//---------------------------------------------------------------\n ");
    console.log(`   >> No se han recibido elementos crear la compra.\n.`);
    console.log("//---------------------------------------------------------------\n ");
    
    res.status(404).send({error: `No se han recibido elementos crear la compra.`});
  }
});

app.put("/compras/:id", function (req, res)
{
  // Guardo en constantes:
  //   - El ID a reemplazar.
  const ID_REPLACE = req.params.id;
  //   - El nuevo elemento a ubicar en la poscición que posiblemente se encuentre ID_REPLACE.
  
  let nuevaCompra = req.body;

  // Busco ID_REPLACE en el arreglo.
  const INDICE_ID_REPLACE = compras.findIndex(function(compra) { return compra.id == ID_REPLACE });
  // El método findIndex() devuelve el índice del primer elemento de un array que cumpla con la 
  // función de prueba proporcionada. En caso contrario devuelve -1
  // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/findIndex

  if ( INDICE_ID_REPLACE > -1 )
  {
    const DATOS_OK = validarExistenciaDatos(nuevaCompra); // Retorna true o false.

    if ( DATOS_OK )
    {
      // Agrego ID original de la compra al objeto que se recibío.
      nuevaCompra = mantenerIdOriginal(nuevaCompra, ID_REPLACE);

      // Reemplazo.
      compras.splice(INDICE_ID_REPLACE, 1, nuevaCompra);
      // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/splice

      // Aviso por consola.
      console.log("//---------------------------------------------------------------\n ");
      console.log(`   >> Compra ${nuevaCompra.id}: Actualizada en lista de compras.\n.`);
      console.log("//---------------------------------------------------------------\n ");

      res.status(201).send({mensaje: `Compra ${nuevaCompra.id}: Actualizada en lista de compras.`});
    }
    else
    {
      // Aviso por consola.
      console.log("//---------------------------------------------------------------\n ");
      console.log(`   >> No se han recibido elementos actualizar la compra.\n.`);
      console.log("//---------------------------------------------------------------\n ");
      
      res.status(404).send({error: `No se han recibido elementos actualizar la compra.`});
    }
  }
  else
  {
    // Aviso por consola.
    console.log("//---------------------------------------------------------------\n ");
    console.log(`   >> No se ha encontrado el ID de la compra a actualizar.\n.`);
    console.log("//---------------------------------------------------------------\n ");
    
    res.status(404).send({error: `No se ha encontrado el ID de la compra a actualizar.`});
  }
});

app.delete("/compras/:id", function (req, res)
{
  const ID_DELETE = req.params.id;
  const INDICE_ID_DELETE = compras.findIndex(function(compra) { return compra.id == ID_DELETE });

  if ( INDICE_ID_DELETE > -1 )
  {
    compras.splice(INDICE_ID_DELETE, 1);

    // Aviso por consola.
    console.log("//---------------------------------------------------------------\n ");
    console.log(`   >> Compra ${ID_DELETE}: Borrada.\n.`);
    console.log("//---------------------------------------------------------------\n ");

    res.status(201).send({mensaje: `Compra ${ID_DELETE}: Borrada.`});

  }
  else
  {
    // Aviso por consola.
    console.log("//---------------------------------------------------------------\n ");
    console.log(`   >> Compra ${ID_DELETE}: No existe, no encontrada.\n.`);
    console.log("//---------------------------------------------------------------\n ");

    res.status(404).send({mensaje: `Compra ${ID_DELETE}: No existe, no encontrada.`});
  }
});

//////////////////// Ahora que tengo todo definido y creado, levanto el servicio escuchando peticiones en el puerto
app.listen(PORT, function () {
  console.log(`Maraton Guayerd running on PORT: ${PORT}\n\n`);
});





// Funciones extra -----------------------------------------------------------------------------


function agregarIDYFecha(compra)
{// Esta función crea un nuevo objeto, (con ID y fecha) a partir de la compra que se envía desde el frontend.
  let objCompra = 
  {
    "id": uniqid(),
    "clientId": compra.clientId,
    "products": compra.products,
    "amount": compra.amount,
    "paymentMethod": compra.paymentMethod,
    "createdAt": new Date()
  }

  return objCompra;
}

function mantenerIdOriginal(compra, idCompra)
{
  // Esta función recibe 2 parametros: La compra, desde el método PUT, y el ID que se intenta actualizar.
  // Retorna un nuevo objeto que contiene un campo ID, con el ID original de la compra.
  // ¿Cómo? Si lo que estamos haciendo es reemplazar/actualizar una compra, no debemos cambiar el ID de la compra,
  //        entonces el objeto que se envía desde el frontend podría contener el ID de la compra y problema resuelto.
  // ¿Entonces por qué no? Porque en ese caso, desde el frontend se tendrían que enviar dos objetos distintos según el caso:
  //        Si se está usando el método POST el frontend debería mandar un objeto sin el campo ID.
  //        Si se está usando el método PUT el frontend debería mandar un objeto con el campo ID.
  // Entonces, prefiero evitar ese trabajo desde el frontend, y que quien sea responsable de esa parte solo tenga que preocuparse
  //         por enviar un solo tipo de objeto, sea cual sea el caso.

  let objCompra = 
  {
    "id": idCompra,
    "clientId": compra.clientId,
    "products": compra.products,
    "amount": compra.amount,
    "paymentMethod": compra.paymentMethod,
    "createdAt": new Date() // La fecha también se actualiza.
  }

  return objCompra;
}

function validarExistenciaDatos(compra)
{
  let rta = false; // Respuesta

  if ( compra && compra.clientId && compra.products && compra.amount && compra.paymentMethod )
  {
    rta = true;
  }

  return rta;
}