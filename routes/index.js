const router = require('express').Router();
const articles = require('./articles');
const users = require('./users');

router.use('/articles', articles);
router.use('/users', users);

router.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
