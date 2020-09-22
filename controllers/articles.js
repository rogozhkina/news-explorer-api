const Article = require('../models/article');
const OwnerError = require('../errors/owner-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .populate('user')
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, image, link } = req.body;
  const userId = req.user._id;
  Article.create({ keyword, title, text, date, source, image, link, owner: userId })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

module.exports.deleteArticleById = (req, res, next) => {
  console.log('ok');
  console.log(req.user._id);
  Article.findById(req.params.id).select('+owner')
    .populate('user')
    .then((article) => {
      console.log('ok2');
      console.log(article);
      if (article.owner._id == req.user._id) {
        console.log('ok3');
        article.remove();
        res.send({ data: article });
      } else if (article.owner._id != req.user._id) {
        console.log('ok4');
        throw new OwnerError('Нельзя удалять чужую статью');
      }
    })
    .catch((err) => {
      console.log('ok5');
      next(err);
    });
};
