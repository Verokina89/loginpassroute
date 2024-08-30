//Usado?: Yes
const middlewares = require('./middlewares');
//--- Explicación: Llamamos a todas las funciones o valores que se exportan en middleware.
// -------------------------------------------------------------------------------------

//Usado?: Yes
const bodyParser = require('body-parser');
//--- Explicación: Llamamos body-parser; el middleware de Express, para analizar las solicitudes HTTP (datos enviados en el formularios).
// -------------------------------------------------------------------------------------

//Usado?: Yes
const session = require('express-session');
//--- Explicación: Llamamos a express-session para manejar las sesiones.
// -------------------------------------------------------------------------------------

//Usado?: Yes
const express = require('express');
//--- Explicación: Llamamos a Express para crear y gestionar el servidor.
// -------------------------------------------------------------------------------------

//Usado?: Yes
const dotenv = require('dotenv');
//--- Explicación: llamamos a dotenv para poder manejar las variables de entorno, para configurar la aplicación con .env 
// -------------------------------------------------------------------------------------

//Usado?: Yes
const routes = require('./routes');
//--- Explicación: Requerimos las rutas desde routes.js; donde se maneja las middlewares y las lógicas.
// -------------------------------------------------------------------------------------

//Usado?: Yes
dotenv.config();
//--- Explicación: Carga las variables de entorno definidas en .env. (lo que mejora la seguridad y flexibilidad, permite adaptar con facilidad diferentes entornos sin necesidad de cambiar el codigo)
// -------------------------------------------------------------------------------------

//Usado?: Yes
const app = express();
//--- Explicación: Creamos Express (una nueva instancia de la aplicación).Donde app representa Express que define las rutas, middlewares y configuraciones del servidor(Express).
//-------------------------------------------------------------------------------------

//Usado?: Yes
const PORT = 4000;
//--- Explicación: Define el puerto donde la aplicación escuchara las peticiones HTTP.
// -------------------------------------------------------------------------------------

//Usado?: Yes
middlewares.setupApp(app);
//--- Explicación: Configura Express con los middlewares body-parser` y `express-session`
// -------------------------------------------------------------------------------------

//Usado?: Yes
routes.setup(app);
//--- Explicación: Configura las rutas; ruta de inicio, perfil, y logout.
// -------------------------------------------------------------------------------------

//Usado?: Yes
const validarPalabraMiddleware = (req, res, next) => {
  const palabraCorrecta = process.env.PALABRA_SECRETA || '';

  if (req.body.palabra === palabraCorrecta) {
    req.session.palabraSecreta = req.body.palabra;
    next();
  } else {
    res.redirect('/?error=1');
  }
};
//--- Explicación: En este middleware se valida si la palabra ingresada es la correcta y la guarda en la sesión para continuar. En el cas de no ser correcta; redirige al usuario con un mensaje de error.
// -------------------------------------------------------------------------------------

//Usado?: Yes
const setup = (app) => {
  app.get('/', (req, res) => {
    const mensajeError = req.query.error
      ? (req.query.error === '1' ? 'Palabra incorrecta, inténtalo de nuevo.' : 'No estás logado.')
      : '';
    if (req.session.palabraSecreta) {
      return res.redirect('/profile');
    }
   
    res.send(`
      <html>
        <body>
          <h1>Página de Inicio</h1>
          <p>${mensajeError}</p>
          <form method="post" action="/profile">
            <label for="palabra">Introduce la palabra:</label>
            <input type="text" name="palabra" required>
            <button type="submit">Enviar</button>
          </form>
        </body>
      </html>
    `);
  });
};
//--- Explicación: Se configra la ruta de inicio (`/`); con un formulario que recoje la palabra secreta. En caso de error; muestra mensaje antes determinado. 
// -------------------------------------------------------------------------------------

//Usado?: Yes
const setupAPP = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: 'secretoSuperSecreto',
    resave: false,
    saveUninitialized: true,
  }));
};
//--- Explicación:Parsea datos en el formulario con body-parser para interpretarlos y con express-session gestiona las sesiones que mantienen los datos del usuario con distintas soliciudes  como middlewares.
// -------------------------------------------------------------------------------------

//Usado?: Yes
app.post('/profile', middlewares.validarPalabraMiddleware, (req, res) => {
  res.send(`
    <h1>Ruta del Perfil</h1>
    <form method="post" action="/logout">
      <button type="submit">Log Out</button>
    </form>
  `);
});
//--- Explicación: Genera la ruta /profile; donde se accede solo con la palabra secreta. Indica el mensaje apropiado y mustra tambien el boton de cerrar sesion.
// -------------------------------------------------------------------------------------

//Usado?: Yes
app.use(bodyParser.urlencoded({ extended: true }));
//--- Explicación: Configura a body-parser como middleware procesando datos de los formularios enviados por el usuario.
// -------------------------------------------------------------------------------------

//Usado?: Yes
app.use(session({
  secret: process.env.PALABRA_SECRETA || 'secretoSuperSecreto',
  resave: false,
  saveUninitialized: true,
}));
//--- Explicación: Genera express-session que se encarga de manejar las sesiones en la aplicacion.
// -------------------------------------------------------------------------------------

//Usado?: YES
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
//--- Explicación: Inicia al servidor en el puerto ants definido y muestra en la terminal el mensaje.
// -------------------------------------------------------------------------------------

//Usado?: YES
const verificarSesionMiddleware = (req, res, next) => {
  if (req.session.palabraSecreta) {
    next();
  } else {
    res.redirect('/?error=2');
  }
};
//--- Explicación: Middleware que verifica si hay sesion activa con la palabra secreta. Si no, redirige al usuario con mensaje de error.
// -------------------------------------------------------------------------------------

//Usado?: YES
app.get('/profile', middlewares.verificarSesionMiddleware, (req, res) => {
  res.send(`
    <h1>Ruta del Perfil (Sesión activa)</h1>
    <form method="post" action="/logout">
      <button type="submit">Log Out</button>
    </form>
  `);
});
//--- Explicación: Configura a /profile para que sea accesible solo cuando la sesion esta activa. Muestra un mensaje y boton de cerrar sesion.
// -------------------------------------------------------------------------------------

//Usado?: YES
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.redirect('/');
  });
});
//--- Explicación: Configura  /logout para cerrar sesion y redirigir a inicio al usuaio.
// -------------------------------------------------------------------------------------

//Usado?: YES
module.exports = {
  setup,
};
//--- Explicación: Exporta a las function setup que configura las rutas.
// -------------------------------------------------------------------------------------

//Usado?: YES
module.exports = {
  validarPalabraMiddleware,
  verificarSesionMiddleware,
  setupAPP,
};
//--- Explicación: Exporta los middlewares y la configuración para que puedan usarse en el resto de archivos.