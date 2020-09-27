const router = require('express').Router();
const articles = require('./articles');
const users = require('./users');
const { notFoundMessage } = require('../middlewares/messages');

router.use('/articles', articles);
router.use('/users', users);

router.use((req, res) => {
  res.status(404).send({ message: notFoundMessage });
});

module.exports = router;
