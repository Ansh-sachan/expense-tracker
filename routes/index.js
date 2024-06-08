var express = require('express');
var router = express.Router();
var passport = require('passport');
var Income = require('../model/income');
var Expense = require('../model/expense');
var User = require('../model/user');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.user);
  res.render('home');
});

router.get('/failure', (req, res, next) => {
  res.render('failure');
});

router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/failure' }),
  (req, res) => {
    res.redirect('/');
  }
);
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/failure' }),
  (req, res) => {
    return res.redirect('/');
  }
);

router.get('/onboarding', (req, res, next) => {
  var id = req.user._id;
  Income.find({ userId: id })
    .then((incomes) => {
      Expense.find({ userId: id })
        .then((expenses) => {
          User.findById(id)
            .then((user) => {
              return res.render('onboarding', { user, incomes, expenses });
            })
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

module.exports = router;
