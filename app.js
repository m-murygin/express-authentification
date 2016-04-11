'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const multer = require('multer');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const expressMessages = require('express-messages');

const User = require('./models/user');
const bcrypt = require('./modules/bcrypt');

const routes = require('./routes/index');
const auth = require('./routes/auth');
const users = require('./routes/users');

var app = express();

mongoose.connect('mongodb://localhost/nodeauth');

// view engine setup
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'jade');

// Handle File Uploads
app.use(multer({ dest: './uploads/'}). any() );

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle Express Sessions
app.use(session({
  secret: 'lsdfjasdf_%dfss',
  saveUninitialized: true,
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('Start localStrategy');
    return User
      .findOne({ username: username }).exec()
      .then(user => {
        console.log('Start Checking');

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        return bcrypt
          .compare(password, user.password)
          .then(res => {
            console.log('login result', res);
            if (res) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Incorrect password.' });
            }
          });
      })
      .catch(done);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.');
    var root    = namespace.shift();
    var formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});

app.use('/', routes);
app.use('/', auth);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
