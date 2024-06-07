var express = require('express');
var router = express.Router();
var passport = require('passport');

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

module.exports = router;
