const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET = 'secret' } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
  } else {
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      next(new UnauthorizedError('Необходима авторизация'));
    }
    req.user = payload;
    next();
  }
};
