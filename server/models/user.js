const mongoose = require ('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true, // убирает пробелы впереди
            required: true,
            max: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        salt: String,
        role: {
            type: String,
            default: 'subscriber'
        },
                resetPasswordLink: {
            data: String,
            default: ''
        }
    },
    { timestamps: true }
);

userSchema.virtual('password')
    .set(function(password) {
        // create a temporarity variable called _password
        this._password = password;
        // generate salt
        this.salt = this.makeSalt(); // генерирует соль методом ниже
        // encryptPassword
        this.hashed_password = this.encryptPassword(password); // получает хэш, опять же - метод ниже
    })
    .get(function() {
        return this._password;
    });
 
userSchema.methods = {
    authenticate: function(plainText) { // а вот это как раз то место, где происходит проверка 
        return this.encryptPassword(plainText) === this.hashed_password;
    },
 
    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto // само crypto берэтся из поставки NodeJS - по нему есть мануал
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) { //ловим ошибки, если они тут есть
            return '';
        }
    },
 
    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};
 
module.exports = mongoose.model('User', userSchema); //это надо для экспорта модели