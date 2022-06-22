const { Router } = require('express');
const { check } = require('express-validator');

const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validator');

const { ValidarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

//obtener todas las productos
router.get('/', [ValidarCampos], obtenerProductos);

// obtener productos por id
router.get(
  '/:id',
  [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    ValidarCampos,
  ],
  obtenerProducto
);

//crear productos privado - cualquier role - token
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'El id de categoria no es válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    ValidarCampos,
  ],
  crearProducto
);

//actualizar privado - cualquier role - token
router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('categoria', 'El id de categoria no es válido').isMongoId(),
    ValidarCampos,
  ],
  actualizarProducto
);

// borrar - privado - solo admin
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    ValidarCampos,
  ],
  eliminarProducto
);

module.exports = router;
