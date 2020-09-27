const { JWT_SECRET = 'secret-key' } = process.env;
const { MONGO_URL = 'mongodb://localhost:27017/news-api' } = process.env;

module.exports = {
  JWT_SECRET,
  MONGO_URL,
};
