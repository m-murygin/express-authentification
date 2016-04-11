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

module.exports = {
  hash: hash
};