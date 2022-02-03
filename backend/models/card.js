const mongoose = require('mongoose');
const { isURL } = require('validator');

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [2, 'Минимальная длина поля - 2 символа'],
        maxlength: [30, 'Максимальная длина поля - 30 символов'],
        required: true,
    },
    link: {
        type: String,
        required: [true, 'Поле должно быть заполнено'],
        validate: {
            validator(v) {
                return isURL(v);
            },
            message: 'Некорректная ссылка',
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('card', cardSchema);