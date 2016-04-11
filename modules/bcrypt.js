'use strict';

const bcrypt = require('bcrypt');

function hash(valueToHash) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(valueToHash, 10, function (err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

function compare(first, second) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(first, second, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports = {
  hash: hash,
  compare: compare
};