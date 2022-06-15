const jwt = require('jsonwebtoken');

const generarJwt = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRETJWTKEYSIGN,
      {
        expiresIn: '4h',
      },
      (err, token) => {
        if (err) {
          console.log();
          reject('Error, no se pudo generar el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generarJwt,
};
