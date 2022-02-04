const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { isURL } = require('validator');
const {
    getUser,
    getCurrentUserInfo,
    getUserById,
    updateUser,
    updateAvatar,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/me', getCurrentUserInfo);
router.get(
    '/:userId',
    celebrate({
        params: Joi.object().keys({ userId: Joi.string().length(24).hex() }),
    }),
    getUserById,
);

router.patch(
    '/me',
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required().min(2).max(30),
            about: Joi.string().required().min(2).max(30),
        }),
    }),
    updateUser,
);
router.patch(
    '/me/avatar',
    celebrate({
        body: Joi.object().keys({
            avatar: Joi.string()
                .required()
                .custom((value) => {
                    if (!isURL(value, { require_protocol: true })) {
                        throw new Error('Неправильный формат ссылки');
                    }
                    return value;
                }),
        }),
    }),
    updateAvatar,
);

module.exports = router;