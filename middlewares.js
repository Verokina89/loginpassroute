const bodyParser = require('body-parser');
//Importa bodyParser para manejar los cuerpos de las solicitudes.

const session = require('express-session');
//Importa express-session para manejar las sesiones de usuario.

//Middleware que valida si la palabra ingresada es la correcta.
const validarPalabraMiddleware = (req, res, next) => {
  const palabraCorrecta = process.env.PALABRA_SECRETA || '';
  
  if (req.body.palabra === palabraCorrecta) {
    req.session.palabraSecreta = req.body.palabra;
    next();
  } else {
    res.redirect('/?error=1');
  }
};

//Middleware que verifica si hay una sesión activa.
const verificarSesionMiddleware = (req, res, next) => {
  if (req.session.palabraSecreta) {
    next();
  } else {
    res.redirect('/?error=2');
  }
};

//Configura la aplicación para usar bodyParser y session.
const setupAPP = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: process.env.PALABRA_SECRETA || 'secretoSuperSecreto',
    resave: false,
    saveUninitialized: true,
  }));
};

//Exporta los middlewares para ser utilizados en otros archivos.
module.exports = {
  validarPalabraMiddleware,
  verificarSesionMiddleware,
  setupAPP,
};
