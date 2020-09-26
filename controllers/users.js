const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const { JWT_SECRET = 'secret-key' } = require('../config');

module.exports.getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user != null) {
        res.send({ data: { name: user.name, email: user.email} });
      } else if (user === null) {
        throw new NotFoundError('Запрашиваемый ресурс не найден');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if ((password === undefined) || (password.trim().length < 8)) {
    console.log(Error.message);
    throw new ValidationError('Некорректные данные');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.status(201).send({ data: { name, email } }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  //const { JWT_SECRET = 'JWT_SECRET' } = process.env;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(next);
};
