const { response } = require('express');
const { Categoria } = require('../models');

const obtenerCategorias = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const query = { estado: true };

  const [categoria, total] = await Promise.all([
    Categoria.find(query)
      .populate('usuario', 'nombre')
      .skip(Number(desde))
      .limit(Number(limite)),
    Categoria.countDocuments(query),
  ]);

  res.json({
    categoria,
    total,
  });
};

const obtenerCategoria = async (req, res = response) => {
  const id = req.params.id;

  const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

  if (!categoria) {
    res.status(404).json({
      error: true,
      msj: 'No existe la categoria',
    });
  }

  res.status(200).json(categoria);
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const existeCategoria = await Categoria.findOne({ nombre });
  if (existeCategoria) {
    return res.status(400).json({
      msg: `la categoria ${existeCategoria.nombre} ya existe.`,
    });
  }

  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);
  await categoria.save();

  res.status(201).json(categoria);
};

const actualizarCategorias = async (req, res = response) => {
  const id = req.params.id;

  const { _id, status, usuario, ...data } = req.body;

  const existeCategoria = await Categoria.findOne({ nombre: data.nombre.toUpperCase() });

  if (existeCategoria && existeCategoria.id !== id) {
    return res.status(401).json({
      error: true,
      msj: 'Ya existe una categoria con ese nombre.',
    });
  }

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, {
    new: true,
  }).populate('usuario', 'nombre');

  res.status(200).json(categoria);
};

const eliminarCategorias = async (req, res = response) => {
  const id = req.params.id;
  const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {
    new: true,
  }).populate('usuario', 'nombre');

  res.status(200).json(categoria);
};


module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategorias,
  eliminarCategorias,
};
