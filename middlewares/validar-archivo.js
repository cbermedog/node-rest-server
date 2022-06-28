const { validationResult } = require('express-validator');

const validarExisteArchivo = (req, res, next) => {
  
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).send({msg: 'No hay archivo que subir.'});
  }
  
  next();
};

module.exports = {
  validarExisteArchivo,
};
