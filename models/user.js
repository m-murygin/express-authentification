'use strict';

const mongoose = require('mongoose');
const db = mongoose.connection;

let UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
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
  return newUser.save();
};

let User = mongoose.model('User', UserSchema);

module.exports = User;