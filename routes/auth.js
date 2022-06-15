const { Router } = require('express');
const { check } = require('express-validator');

const { ValidarCampos } = require('../middlewares/validar-campos');
const { login } = require('../controllers/auth');

const router = Router();



router.post('/login',[
    check('correo', 'El correo no es válido').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    ValidarCampos,
], login);

module.exports = router;