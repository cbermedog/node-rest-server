const { Categoria, Role, Usuario, Producto } = require('../models');

const isValidRole = async (role = '') => {
  const existRole = Role.exists({ role });
  if (!existRole) {
    throw new Error(`el role ${role} no existe en la base de datos.`);
  }
};

const existEmail = async (correo = '') => {
  const existCorreo = await Usuario.exists({ correo });
  if (existCorreo) {
    throw new Error(`El mail ${correo} ya existe en la base de datos.`);
  }
};

const existeUsuarioPorId = async (id) => {
  const usuario = await Usuario.findById(id);
  if (!usuario) {
    throw new Error(`No existe en la base de datos un usuario con id ${id}.`);
  }
};

const existeCategoriaPorId = async (id) => {
  const categoria = await Categoria.findById(id);
  if (!categoria) {
    throw new Error(
      `No existe en la base de datos una categoria con id ${id}.`
    );
  }
};

const existeProductoPorId = async (id) => {
  const producto = await Producto.findById(id);
  if (!producto) {
    throw new Error(
      `No existe en la base de datos un producto con id ${id}.`
    );
  }
};

module.exports = {
  isValidRole,
  existEmail,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
};
