const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.name === 'ValidationError') {
    res.status('400').send({ message: 'Невалидные данные' });
  } else if ((err.name === 'CastError') || (err.name === 'TypeError')) {
    res.status('404').send({ message: 'Запрашиваемый ресурс не найден' });
  } else if (err.name === 'MongoError') {
    res.status('409').send({ message: 'Такой пользователь уже существует' });
  } else { res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message }); }
};

module.exports = errorHandler;
