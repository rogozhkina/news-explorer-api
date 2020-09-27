const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const auth = require('../middlewares/auth');
const ValidationError = require('../errors/validation-err');
const { minLengthMessage, requiredMessage } = require('../middlewares/messages');

const {
  getArticles, createArticle, deleteArticleById,
} = require('../controllers/articles');

const validatorURL = (link) => {
  if (!validator.isURL(link)) {
    throw new ValidationError('Невалидные данные');
  }
  return link;
};

router.get('/', auth, getArticles);

router.post('/', auth, celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2)
      .messages({
        'string.min': `keyword - ${minLengthMessage}`,
        'any.required': `keyword - ${requiredMessage}`,
      }),
    title: Joi.string().required()
      .messages({
        'any.required': `title - ${requiredMessage}`,
      }),
    text: Joi.string().required()
      .messages({
        'any.required': `text - ${requiredMessage}`,
      }),
    date: Joi.string().required()
      .messages({
        'any.required': `date - ${requiredMessage}`,
      }),
    source: Joi.string().required()
      .messages({
        'any.required': `source - ${requiredMessage}`,
      }),
    link: Joi.string().required().custom(validatorURL)
      .messages({
        'any.required': `link - ${requiredMessage}`,
      }),
    image: Joi.string().required().custom(validatorURL)
      .messages({
        'any.required': `image - ${requiredMessage}`,
      }),
  }),
}),
createArticle);

router.delete('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }),
}), deleteArticleById);

module.exports = router;
