//Importa los middlewares para su uso en las rutas.
const middlewares = require('./middlewares');  

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

  app.post('/profile', middlewares.validarPalabraMiddleware, (req, res) => {
    res.send(`
      <h1>Ruta del Perfil</h1>
      <form method="post" action="/logout">
        <button type="submit">Log Out</button>
      </form>
    `);
  });

  app.get('/profile', middlewares.verificarSesionMiddleware, (req, res) => {
    res.send(`
      <h1>Ruta del Perfil (Sesión activa)</h1>
      <form method="post" action="/logout">
        <button type="submit">Log Out</button>
      </form>
    `);
  });

  app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
      }
      res.redirect('/');
    });
  });
};

//Define y exporta las rutas de la aplicación.
module.exports = {
  setup,
};
