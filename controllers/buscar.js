const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos'];

const buscarUsuario = async (termino = '', res = response) => {
  const isMongoId = ObjectId.isValid(termino);

  if (isMongoId) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  // expresion regular no key sensitive.
  const regex = new RegExp(termino, 'i');

  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios,
  });
};

const buscarCategoria = async (termino = '', res = response) => {
    const isMongoId = ObjectId.isValid(termino);
  
    if (isMongoId) {
      const categoria = await Categoria.findById(termino)
      .populate('usuario', 'nombre');
      return res.json({
        results: categoria ? [categoria] : [],
      });
    }
  
    // expresion regular no key sensitive.
    const regex = new RegExp(termino, 'i');
  
    const categorias = await Categoria
    .find({ nombre: regex , estado: true })
    .populate('usuario', 'nombre');

    res.json({
      results: categorias,
    });
  };

  const buscarProducto = async (termino = '', res = response) => {
    const isMongoId = ObjectId.isValid(termino);
  
    if (isMongoId) {
      const producto = await Producto.findById(termino)
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre');
      return res.json({
        results: producto ? [producto] : [],
      });
    }
  
    // expresion regular no key sensitive.
    const regex = new RegExp(termino, 'i');
  
    const productos = await Producto
    .find({ nombre: regex , estado: true })
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

    res.json({
      results: productos,
    });
  };


const buscar = async (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las coleciones permitidas son ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case 'usuarios':
      buscarUsuario(termino, res);
      break;

    case 'categorias':
        buscarCategoria(termino, res);
      break;
    case 'productos':
        buscarProducto(termino, res);
      break;

    default:
      return res.status(500).json({
        msg: `Se le olvido implementar esta coleccion`,
      });
  }
};

module.exports = {
  buscar,
};
