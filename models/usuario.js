const { Schema, model } = require('mongoose');

const SchemaUsuario = new Schema({
  nombre: {
    type: String,
    required: [true, 'El Nombre es obligatorio.'],
  },
  correo: {
    type: String,
    required: [true, 'El Correo es obligatorio.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria.'],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

SchemaUsuario.methods.toJSON = function () {
  const { __v, password, _id, imagen, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

module.exports = model('Usuario', SchemaUsuario);
