const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const {
  getCard,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
} = require('../controllers/cards');

const checkURL = (value) => {
  if (!isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

router.get('/', getCard);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(checkURL),
    }),
  }),
  createCard,
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }),
  }),
  deleteCard,
);
router.put(
  '/likes/:cardId',
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }),
  }),
  setLike,
);
router.delete(
  '/likes/:cardId',
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().required().alphanum() }),
  }),
  deleteLike,
);

module.exports = router;
