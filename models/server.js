const express = require('express');
const cors = require('cors');
const {DbConnection} = require('../database/config')

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.authPath = '/api/auth';
    this.usuariosPath = '/api/usuarios';

    //DBConnection
    this.connectingDb();

    //middlewares de mi aplicacion
    this.middlewares();

    //rutas de mi aplicacion
    this.routes();
  }


  async connectingDb() {
    await DbConnection();
  }

  middlewares() {
    //Cors
    this.app.use(cors());
    // parseo y lectura de jsons
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.authPath, require('../routes/auth'));
    this.app.use(this.usuariosPath, require('../routes/usuarios'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Aplicación corriendo en el puerto', this.port);
    });
  }
}

module.exports = Server;
