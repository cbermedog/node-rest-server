const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJwt } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // verificar si el usuario existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: 'usuario / password no válidos - correo',
      });
    }

    if (!usuario.status) {
      return res.status(400).json({
        msg: 'usuario / password no válidos - status: false',
      });
    }

    const validPassword = await bcryptjs.compareSync(
      password,
      usuario.password
    );
    if (!validPassword) {
      return res.status(400).json({
        msg: 'usuario / password no válidos - password',
      });
    }

    const token = await generarJwt(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Algo salio mal hable con el administrador de la plataforma',
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true,
        role: 'USER_ROLE'
      };
      usuario = new Usuario(data);
      await usuario.save();
    }

    if (!usuario.status) {
      res.status(401).json({
        ok: false,
        msg: 'Usuario bloqueado.',
      });
    }

    const token = await generarJwt(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar',
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
