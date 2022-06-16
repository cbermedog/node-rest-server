const { Router } = require('express');
const { check } = require('express-validator');

const { ValidarCampos } = require('../middlewares/validar-campos');
const { login, googleSignIn } = require('../controllers/auth');

const router = Router();



router.post('/login',[
    check('correo', 'El correo no es válido').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    ValidarCampos,
], login);

router.post('/google',[
    check('id_token', 'id_token es requerido').not().isEmpty(),
    ValidarCampos,
], googleSignIn);

module.exports = router;