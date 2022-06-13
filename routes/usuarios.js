const { Router } = require('express');
const { check } = require('express-validator');
const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
} = require('../controllers/usuarios');
const {
  isValidRole,
  existEmail,
  existeUsuarioPorId,
} = require('../helpers/db-validator');
const { ValidarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', usuariosGet);

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe contener mas de 6 caracteres').isLength(
      { min: 6 }
    ),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(existEmail),
    check('role').custom(isValidRole),
    ValidarCampos,
  ],
  usuariosPost
);

router.put(
  '/:id',
  [
    // notese que estoy validando el id que se supone se envía en la ruta
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('role').custom(isValidRole),
    ValidarCampos,
  ],
  usuariosPut
);

router.patch('/', usuariosPatch);

router.delete('/:id', [
  check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    ValidarCampos,
], usuariosDelete);

module.exports = router;
