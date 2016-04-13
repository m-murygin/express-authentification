'use strict';

var express = require('express');
var router = express.Router();

router.get('/', ensureAuthentication,
  function(req, res) {
    res.render('index', { title: 'Members' });
});

function ensureAuthentication(req, res, next) {
  console.log('Start Ensuring Authentification');
  if (req.isAuthenticated()) {
    console.log('Is Authenticated = TRUE');
    return next();
  }

  console.log('Is Authenticated = FALSE');
  res.redirect('/login');
}

module.exports = router;
