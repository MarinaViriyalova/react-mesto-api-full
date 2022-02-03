const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail, isURL } = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [2, 'Минимальная длина поля - 2 символа'],
        maxlength: [30, 'Максимальная длина поля - 30 символов'],
        default: 'Жак-Ив Кусто',
    },
    about: {
        type: String,
        minlength: [2, 'Минимальная длина поля - 2 символа'],
        maxlength: [30, 'Максимальная длина поля - 30 символов'],
        default: 'Исследователь',
    },
    avatar: {
        type: String,
        validate: {
            validator(v) {
                return isURL(v);
            },
            message: 'Некорректная ссылка',
        },
        default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Поле должно быть заполнено'],
        validate: {
            validator(v) {
                return isEmail(v);
            },
            message: 'Некорректный email',
        },
    },
    password: {
        type: String,
        minlength: 8,
        required: [true, 'Поле должно быть заполнено'],
        select: false,
    },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
    email,
    password,
) {
    return this.findOne({ email })
        .select('+password')
        .then((user) => {
            if (!user) {
                return Promise.reject(new Error('Неправильные почта или пароль'));
            }
            return bcrypt.compare(password, user.password).then((matched) => {
                if (!matched) {
                    return Promise.reject(new Error('Неправильные почта или пароль'));
                }
                return user;
            });
        });
};
module.exports = mongoose.model('user', userSchema);