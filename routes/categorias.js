const { Router } = require('express');
const { check } = require('express-validator');

const {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategorias,
  eliminarCategorias,
} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validator');

const { ValidarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

//obtener todas las categorias
router.get('/', [ValidarCampos], obtenerCategorias);

// obtener categorias por id
router.get(
  '/:id',
  [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    ValidarCampos,
  ],
  obtenerCategoria
);

//crear categorias privado - cualquier role - token
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    ValidarCampos,
  ],
  crearCategoria
);

//actualizar privado - cualquier role - token
router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    ValidarCampos,
  ],
  actualizarCategorias
);

// borrar - privado - solo admin
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    ValidarCampos,
  ],
  eliminarCategorias
);

module.exports = router;
