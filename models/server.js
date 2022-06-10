const express = require('express');
const cors = require('cors');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = '/api/usuarios';

    //middlewares de mi aplicacion
    this.middlewares();

    //rutas de mi aplicacion
    this.routes();
  }

  middlewares() {
    //Cors
    this.app.use(cors());
    // parseo y lectura de jsons
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.usuariosPath, require('../routes/usuarios'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Aplicación corriendo en el puerto', this.port);
    });
  }
}

module.exports = Server;
