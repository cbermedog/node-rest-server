const { response } = require('express');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req, res = response) => {
  try {
    // const nombre = await subirArchivo(req.files, ['txt', 'pdf'], 'documents');
    const nombre = await subirArchivo(req.files, undefined, 'imgs');
    res.status(200).json({ nombre });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

// deprecated
const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: `Nada implementado para la coleccion ${coleccion}`,
      });
  }

  //validar solo una imagen
  if (modelo.img) {
    const pathimg = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathimg)) {
      fs.unlinkSync(pathimg);
    }
  }

  const nombre = await subirArchivo(req.files.archivo, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.status(200).json(modelo);
};


const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: `Nada implementado para la coleccion ${coleccion}`,
      });
  }

  // validar solo una imagen cloudinary
  if (modelo.img) {
    const nombresArr = modelo.img.split('/');
    const nombreImg = nombresArr[nombresArr.length -1];
    const [cloudinaryId] = nombreImg.split('.');
    cloudinary.uploader.destroy(cloudinaryId);
  }

  const {tempFilePath} = req.files.archivo
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
  modelo.img = secure_url;

  await modelo.save();

  res.status(200).json(modelo);
};

// Permite servir imagenes locales. 
// (con cloudinary implementado ya no es necesario o podria implementar otro metodo quizas.)
const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: `Nada implementado para la coleccion ${coleccion}`,
      });
  }

  //validar solo una imagen
  if (modelo.img) {
    const pathimg = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathimg)) {
      return res.sendFile(pathimg);
    }
  }

  const notFoundImg = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(notFoundImg);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
};
