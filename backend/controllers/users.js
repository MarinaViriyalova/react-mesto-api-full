const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const InternalError = require('../errors/InternalError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.info(req.method, req.headers.host);
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
        .status(200)
        .send({ token });
    })
    .catch((err) => {
      console.info(err);
      next(new UnauthorizedError('Неверный логин или пароль'));
    });
};

module.exports.getUserById = (req, res, next) => {
  console.info(req.method, req.headers.host);
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы неверные данные'));
      } else {
        next(new InternalError(err));
      }
    });
};

module.exports.getUser = (req, res, next) => {
  console.info(req.method, req.headers.host);
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => next(new InternalError()));
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  console.info(req.method, req.headers.host);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => next(new InternalError(err)));
};
module.exports.createUser = (req, res, next) => {
  console.info(req.method, req.headers.host);
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(200).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(
          new ConflictError('Пользователь с данным email уже зарегестрирован'),
        );
      } else {
        next(new InternalError(err));
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  console.info(req.method, req.headers.host);
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы неверные данные'));
      } else {
        next(new InternalError(err));
      }
    });
};
module.exports.updateAvatar = (req, res, next) => {
  console.info(req.method, req.headers.host);
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new InternalError(err));
      }
    });
};
