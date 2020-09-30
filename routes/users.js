const router = require('express').Router();
const auth = require('../middlewares/auth');

const { getUsersMe } = require('../controllers/users');

router.get('/me', auth, getUsersMe);

module.exports = router;
