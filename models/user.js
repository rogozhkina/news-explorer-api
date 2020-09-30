const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ValidationError = require('../errors/validation-err');
const { validationMessage } = require('../middlewares/messages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new ValidationError(validationMessage);
    }
    return bcrypt
      .compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new ValidationError(validationMessage);
        }
        return user;
      });
  });
};

module.exports = mongoose.model('user', userSchema);
