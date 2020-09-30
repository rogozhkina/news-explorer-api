const Article = require('../models/article');
const OwnerError = require('../errors/owner-err');
const { ownerMessage } = require('../middlewares/messages');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .populate('user')
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, image, link,
  } = req.body;
  const userId = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner: userId,
  })
    .then((article) => {
      // скрыть article.owner через delete не получилось
      res.send({
        data: {
          _id: article._id,
          keyword: article.keyword,
          title: article.title,
          text: article.text,
          date: article.date,
          source: article.source,
          link: article.link,
          image: article.image,
        },
      });
    })
    .catch(next);
};

module.exports.deleteArticleById = (req, res, next) => {
  Article.findById(req.params.id).select('+owner')
    .populate('user')
    .then((article) => {
      if (article.owner._id == req.user._id) {
        article.remove();
        res.send({
          data: {
            _id: article._id,
            keyword: article.keyword,
            title: article.title,
            text: article.text,
            date: article.date,
            source: article.source,
            link: article.link,
            image: article.image,
          },
        });
      } else if (article.owner._id != req.user._id) {
        throw new OwnerError(ownerMessage);
      }
    })
    .catch((err) => {
      next(err);
    });
};
