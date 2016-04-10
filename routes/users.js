'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res) {
  res.render('register', {
    title: 'Register'
  });
});

router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Log In'
  });
});

router.post('/register', function (req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let passwordConfirm = req.body.passwordConfirm;


  let profileImageName;
  if (req.files.profileImage) {
     console.log('Uploading file....');

     let profileImageOriginName = req.files.profileImage.originalName;
     profileImageName = req.files.profileImage.name;
     let profileImageMime = req.files.profileImage.mimetype;
     let profileImagePath = req.files.profileImage.path;
     let profileImageExt = req.files.profileImage.extension;
     let profileImageSize = req.files.profileImage.size;
  } else {
     profileImageName = 'noimage.png';
  }

  // Form Validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email should be in correct format').isEmail();
  req.checkBody('username', 'User Name field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('passwordConfirm', 'Passwords do not match').equals(
    req.body.passwordConfirm);

  let errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      passwordConfirm: passwordConfirm
    });
    return;
  }

  let newUser = new User({
    name: name,
    email: email,
    username: username,
    password: password,
    passwordConfirm: passwordConfirm,
    profileImage: profileImageName
  });

  User
    .createUser(newUser)
    .then(() => {
      req.flash('success', 'You are now registered and may log in');
      res.location('/');
      res.redirect('/');
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
});


module.exports = router;
