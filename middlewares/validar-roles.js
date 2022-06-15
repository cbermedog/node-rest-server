const { request, response } = require('express');

const esAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: 'Se intenta validar role antes de validar token',
    });
  }

  const { role, nombre } = req.usuario;
  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `El usuario ${nombre} no es administrador del sistema.`,
    });
  }

  next();
};

const usuarioConRol = ( ...roles ) => {

  return (req = request, res = response, next) => {

    if (!req.usuario) {
      return res.status(500).json({
        msg: 'Se intenta validar role antes de validar token',
      });
    }

    if (!roles.includes(req.usuario.role)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de los siguientes roles ${roles}`,
      });
    }

    next();
  }

}

module.exports = {
  esAdminRole,
  usuarioConRol
};
