require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const errorHandler = require('./middlewares/error-handler');
const routes = require('./routes');
const { MONGO_URL } = require('./config');

const corsOptions = {
  origin: [
    'https://tashunina.ru',
    'http://localhost:8080',
    'https://localhost:8080',
    'https://rogozhkina.github.io',
    'https://newsapi.org',
    'https://newsapi.org/v2/',
    'https://nomoreparties.co/news/v2/everything',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Content-Type',
    'origin',
    'x-access-token',
    'Access-Control-Allow-Headers',
    'Authorization',
    'Bearer',
  ],
  credentials: true,
}

const { PORT = 3000 } = process.env;
const app = express();

app.use('*', cors(corsOptions));

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});



app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(limiter);
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
