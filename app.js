const express = require('express');  
//Inicializa el servidor.

const dotenv = require('dotenv');
//Importa dotenv y las variables de entorno.

dotenv.config();
//Carga las variables de entorno desde el archivo `.env`.

const app = express();
//Crea una instancia de la aplicación Express.

const middlewares = require('./middlewares');
//Importa los middlewares personalizados desde el archivo `middlewares.js`.

const routes = require('./routes');
//Importa las rutas desde el archivo `routes.js`.

//Configura la aplicación con los middlewares requeridos.
middlewares.setupAPP(app);

//Configura las rutas necesarias para la aplicación.
routes.setup(app);

//Define el puerto en el que la aplicación escuchará.
const PORT = 4000;

// Inicia el servidor en el puerto especificado.
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});