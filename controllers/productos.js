const { response } = require('express');
const { Producto } = require('../models');

const obtenerProductos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const query = { estado: true };

  const [categoria, total] = await Promise.all([
    Producto.find(query)
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre')
      .skip(Number(desde))
      .limit(Number(limite)),
    Producto.countDocuments(query),
  ]);

  res.json({
    categoria,
    total,
  });
};

const obtenerProducto = async (req, res = response) => {
  const id = req.params.id;

  const categoria = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

  if (!categoria) {
    res.status(404).json({
      error: true,
      msj: 'No existe la categoria',
    });
  }

  res.status(200).json(categoria);
};

const crearProducto = async (req, res = response) => {
  const { estado, ...request } = req.body;
  const nombre = request.nombre.toUpperCase();

  const existeProducto = await Producto.findOne({ nombre });
  if (existeProducto) {
    return res.status(400).json({
      msg: `El producto ${existeProducto.nombre} ya existe.`,
    });
  }

  request.nombre = nombre;
  request.usuario = req.usuario._id;

  const producto = new Producto(request);
  await producto.save();

  res.status(201).json(producto);
};

const actualizarProducto = async (req, res = response) => {
  const id = req.params.id;

  const { _id, status, usuario, ...data } = req.body;

  const existeProducto = await Producto.findOne({
    nombre: data.nombre.toUpperCase(),
  });

  if (existeProducto && existeProducto.id !== id) {
    return res.status(401).json({
      error: true,
      msj: 'Ya existe un producto con ese nombre.',
    });
  }

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, {
    new: true,
  })
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

  res.status(200).json(producto);
};

const eliminarProducto = async (req, res = response) => {
  const id = req.params.id;
  const categoria = await Producto.findByIdAndUpdate(
    id,
    { estado: false, disponible: false },
    {
      new: true,
    }
  )
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

  res.status(200).json(categoria);
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
