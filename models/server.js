const express = require('express');
const cors = require('cors');
const { DbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
  constructor() {
    this.app = express();

    this.port = process.env.PORT;

    this.path = {
      authPath: '/api/auth',
      buscar: '/api/buscar',
      categorias: '/api/categorias',
      productos: '/api/productos',
      uploadPath: '/api/uploads',
      usuariosPath: '/api/usuarios',
    };

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

    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
  }));
  }

  routes() {
    this.app.use(this.path.authPath, require('../routes/auth'));
    this.app.use(this.path.buscar, require('../routes/buscar'));
    this.app.use(this.path.categorias, require('../routes/categorias'));
    this.app.use(this.path.productos, require('../routes/productos'));
    this.app.use(this.path.uploadPath, require('../routes/uploads'));
    this.app.use(this.path.usuariosPath, require('../routes/usuarios'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Aplicación corriendo en el puerto', this.port);
    });
  }
}

module.exports = Server;
