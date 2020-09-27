const { JWT_SECRET = 'JWT_SECRET' } = process.env;
const urlAdres = 'mongodb://localhost:27017/news-api';

module.exports = {
  JWT_SECRET,
  urlAdres,
};
