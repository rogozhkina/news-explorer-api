require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
const articles = require('./routes/articles');
const users = require('./routes/users');
const limiter = require('./middlewares/limiter');
const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/news-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(limiter);
app.use(cookieParser());
app.use(helmet());

app.use(requestLogger);

// app.use('/articles', articles);
// app.use('/users', users);

app.use(routes);

app.use(errorLogger);
app.use(errors());

app.all('/*', (req, res) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.name === 'ValidationError') {
    res.status('400').send({ message: 'Невалидные данные' });
  } else if ((err.name === 'CastError') || (err.name === 'TypeError')) {
    res.status('404').send({ message: 'Запрашиваемый ресурс не найден' });
  } else if (err.name === 'MongoError') {
    res.status('409').send({ message: 'Такой пользователь уже существует' });
  } else { res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message }); }
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
