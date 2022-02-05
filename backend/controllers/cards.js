const Card = require('../models/card');
const InternalError = require('../errors/InternalError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCard = (req, res, next) => {
    console.info(req.method, req.headers.host);
    Card.find({ owner: req.user._id })
        .then((cards) => res.status(200).send(cards))
        .catch((err) => next(new InternalError(err)));
};

module.exports.createCard = (req, res, next) => {
    console.info(req.method, req.headers.host);
    const { name, link } = req.body;
    Card.create({ name, link, owner: req.user._id })
        .then((card) => res.status(200).send(card))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError('Переднаны некорректные данные'));
            } else {
                next(new InternalError(err));
            }
        });
};

module.exports.deleteCard = (req, res, next) => {
    Card.findById(req.params.cardId)
        .then((card) => {
            if (!card) {
                return next(new NotFoundError('Не найдена карточка по переданному id'));
            }
            if (!card.owner.equals(req.user._id)) {
                return next(new ForbiddenError('Это не ваша карточка'));
            }
            return card.remove()
                .then((result) => res.send(result));
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                next(new BadRequestError('Переданы некорректные данные'));
            } else {
                next(new InternalError(err));
            }
        });
};

module.exports.setLike = (req, res, next) => {
    console.info(req.method, req.headers.host);
    Card.findByIdAndUpdate(
            req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true },
        )
        .then((like) => {
            if (!like) {
                next(new NotFoundError('Не найден id'));
            }
            return res.status(200).send(like);
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                next(new BadRequestError('Переднан некорректный id'));
            } else {
                next(new InternalError(err));
            }
        });
};
module.exports.deleteLike = (req, res, next) => {
    console.info(req.method, req.headers.host);
    Card.findByIdAndUpdate(
            req.params.cardId, { $pull: { likes: req.user._id } }, { new: true },
        )
        .then((like) => {
            if (!like) {
                next(new NotFoundError('Не найден id'));
            }
            return res.status(200).send(like);
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                next(new BadRequestError('Переднан некорректный id'));
            } else {
                next(new InternalError(err));
            }
        });
};