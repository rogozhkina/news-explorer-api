const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const auth = require('../middlewares/auth');
const ValidationError = require('../errors/validation-err');

const {
  getArticles, createArticle, deleteArticleById
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
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validatorURL),
  }),
}),
createArticle);

router.delete('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }),
}), deleteArticleById);

module.exports = router;
