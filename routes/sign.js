const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const {
  minLengthMessage, maxLengthMessage, requiredMessage, passwordMessage, emailMessage,
} = require('../middlewares/messages');

const {
  login,
  createUser,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'any.required': `email - ${requiredMessage}`,
        'string.email': `email - ${emailMessage}`,
      }),
    password: Joi.string().required().min(2)
      .messages({
        'string.min': `password - ${passwordMessage}`,
        'any.required': `password - ${requiredMessage}`,
      }),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': `name - ${minLengthMessage}`,
        'string.max': `name - ${maxLengthMessage}`,
        'any.required': `name - ${requiredMessage}`,
      }),
    email: Joi.string().required().email()
      .messages({
        'any.required': `email - ${requiredMessage}`,
        'string.email': `email - ${emailMessage}`,
      }),
    password: Joi.string().required().min(2)
      .messages({
        'string.min': `password - ${passwordMessage}`,
        'any.required': `password - ${requiredMessage}`,
      }),
  }),
}), createUser);

module.exports = router;
