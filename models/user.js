'use strict';

const mongoose = require('mongoose');
const bcrypt = require('../modules/bcrypt');

let UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String, 
    bcrypt: true,
    required: true
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  profileImage: {
    type: String
  }
});

UserSchema.statics.createUser = function (newUser) {

  return bcrypt
    .hash(newUser.password)
    .then(hash => {
      newUser.password = hash;

      return newUser.save();
    });
};

let User = mongoose.model('User', UserSchema);

module.exports = User;