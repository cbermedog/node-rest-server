const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const query = { status: true };

  // const usuarios = await Usuario.find(query)
  // .skip(Number(desde))
  // .limit(Number(limite));

  // const total = await Usuario.countDocuments(query);

  const [usuarios, total] = await Promise.all([
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
    Usuario.countDocuments(query),
  ]);

  res.json({
    usuarios,
    total,
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, role } = req.body;
  const usuario = new Usuario({ nombre, correo, password, role });

  //encriptar password
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const id = req.params.id;

  const { _id, password, google, correo, ...request } = req.body;

  //TODO: validar contra la base de datos
  if (password) {
    const salt = bcryptjs.genSaltSync();
    request.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, request, { new: true });

  res.json({
    id,
    usuario,
  });
};

const usuariosDelete = async (req, res = response) => {
  const id = req.params.id;

  // borrar registro fisico de la base de datos (No recomendado)
  // const usuario = await Usuario.findByIdAndDelete(id);
  
  const usuario = await Usuario.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json({
    usuario,
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
