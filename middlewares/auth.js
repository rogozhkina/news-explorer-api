const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/validation-err');
const { JWT_SECRET } = require('../config');
const { authMessage } = require('./messages');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError(authMessage);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: authMessage });
  }
  req.user = payload;
  next();
};
