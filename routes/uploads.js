const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarExisteArchivo } = require('../middlewares');

const { ValidarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', [validarExisteArchivo], cargarArchivo);
router.put(
  '/:coleccion/:id',
  [
    validarExisteArchivo,
    check('id', 'No es un id mongo válido').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionesPermitidas(c, ['usuarios', 'productos'])
    ),
    ValidarCampos,
  ],
  actualizarImagen
);

router.get('/:coleccion/:id', [
  check('id', 'No es un id mongo válido').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionesPermitidas(c, ['usuarios', 'productos'])
    ),
    ValidarCampos,
], 
mostrarImagen
)

module.exports = router;
