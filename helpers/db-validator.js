const Role = require('../models/role');
const Usuario = require('../models/usuario');


const isValidRole = async (role = '') => {

    const existRole =  Role.exists({role});
    if (!existRole) {
      throw new Error(`el role ${role} no existe en la base de datos.`);
    }

  }

  const existEmail = async (correo = '') => {
    const existCorreo = await Usuario.exists({ correo });
    if (existCorreo) {
        throw new Error(`El mail ${correo} ya existe en la base de datos.`);
    }
  }

  const existeUsuarioPorId = async (id) => {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
        throw new Error(`No existe en la base de datos un usuario con id ${id}.`);
    }
  }


  module.exports = {
    isValidRole,
    existEmail,
    existeUsuarioPorId
  }