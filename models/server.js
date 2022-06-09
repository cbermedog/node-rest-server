const express = require('express');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //middlewares de mi aplicacion
    this.middlewares();

    //rutas de mi aplicacion
    this.routes();
  }

  middlewares() {
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.get('/', (req, res) => {
      res.sendFile('Hello World');
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Aplicacion corriendo en el puerto', this.port);
    });
  }
}

module.exports = Server;
