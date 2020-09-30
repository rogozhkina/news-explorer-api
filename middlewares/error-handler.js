const { notFoundMessage, validMessage, userMessage } = require('./messages');

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.name === 'ValidationError') {
    res.status('400').send({ message: validMessage });
  } else if ((err.name === 'CastError') || (err.name === 'TypeError')) {
    res.status('404').send({ message: notFoundMessage });
  } else if (err.name === 'MongoError') {
    res.status('409').send({ message: userMessage });
  } else { res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message }); }
  next();
};

module.exports = errorHandler;
