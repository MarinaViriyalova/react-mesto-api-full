const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
const regExp = /^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cookieParser());
app.use(cors);

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
}, (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных', err);
    }
});

app.get('/crash-test', () => {
    setTimeout(() => {
        throw new Error('Сервер сейчас упадёт');
    }, 0);
});

app.post(
    '/signin',
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
        }),
    }),
    login,
);

app.post(
    '/signup',
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            name: Joi.string().min(2).max(30),
            about: Joi.string().min(2).max(30),
            avatar: Joi.string().pattern(regExp),
        }),
    }),
    createUser,
);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res, next) => {
    next(new NotFoundError('Страница не найдена'));
});
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500);
    res.send({ message: err.message || 'Неизвестная ошибка' });
    next();
});
app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
});