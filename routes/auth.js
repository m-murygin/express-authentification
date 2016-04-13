'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Log In'
  });
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password'
  }),
  function(req, res) {
    req.flash('success', 'You are logged in');
    res.redirect('/');
  }
);

router.get('/logout', function (req, res) {
  console.log(req.user);
  req.logout();
  req.flash('success', 'You have logged out');

  console.log('log out success');

  res.redirect('/login');
});

module.exports = router;
