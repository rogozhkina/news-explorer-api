const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const auth = require('../middlewares/auth');
const ValidationError = require('../errors/validation-err');

const {
  getUsersMe,
  login,
  createUser,
} = require('../controllers/users');

const validatorURL = (link) => {
  if (!validator.isURL(link)) {
    throw new ValidationError('Невалидные данные');
  }
  return link;
};

router.get('/', auth, getUsersMe);

router.post('/signin', login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = router;
