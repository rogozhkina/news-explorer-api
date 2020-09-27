const Article = require('../models/article');
const OwnerError = require('../errors/owner-err');
const { ownerMessage } = require('../middlewares/messages');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
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
    keyword, title, text, date, source, image, link, owner: userId,
  })
    .then((article) => {
      // скрыть article.owner через delete не получилось
      res.send({
        data: {
          _id: article._id,
          keyword: article.keyword,
          title: article.title,
          text: article.text,
          date: article.data,
          source: article.source,
          image: article.image,
          link: article.link,
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
            date: article.data,
            source: article.source,
            image: article.image,
            link: article.link,
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
