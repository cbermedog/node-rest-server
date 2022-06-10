const { response, request } = require('express');

const usuariosGet = (req, res = response) => {

  const {q, nombre='No Name', apikey, page=1, limit=5} = req.query;

  res.json({
    msg: 'get API - controller',
    q, 
    nombre,
    apikey,
    page,
    limit
  });
};

const usuariosPost = (req, res = response) => {
  const {nombre, edad} = req.body;

  res.json({
    msg: 'post API -- controller',
    nombre,
    edad
  });
};

const usuariosPut = (req, res = response) => {
  const id = req.params.id;
  res.json({
    msg: 'put API -- controller',
    id
  });
};

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: 'delete API -controller',
  });
};

const usuariosPatch = (req, res) => {
  res.json({
    msg: 'patch API- controller',
  });
};
module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
