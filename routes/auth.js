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
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password'
  }),
  function(req, res) {
    console.log('------Success login');

    req.flash('success', 'You are logged in');
    res.redirect('/');
  }
);

module.exports = router;
