const router = require('express').Router();
const articles = require('./articles');
const users = require('./users');
const sign = require('./sign');
const { notFoundMessage } = require('../middlewares/messages');

router.use('/articles', articles);
router.use('/users', users);
router.use('/', sign);

router.use((req, res) => {
  res.status(404).send({ message: notFoundMessage });
});

module.exports = router;
