var express = require('express');
var router = express.Router();
var Income = require('../model/income');
var auth = require('../middlewares/auth');

router.use(auth.isUserLogged);
// cretae income source

router.get('/new', (req, res, next) => {
  res.render('createIncome');
});

router.post('/create', (req, res, next) => {
  Income.create(req.body)
    .then((income) => {
      Income.findByIdAndUpdate(
        income.id,
        { $push: { userId: req.user._id } },
        { new: true }
      )
        .then((i) => {
          res.redirect('/onboarding');
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.get('/:id/edit', (req, res, next) => {
  var incomeId = req.params.id;
  Income.findById(incomeId)
    .then((i) => res.render('editIncome', { i }))
    .catch((err) => next(err));
});
router.post('/:id/edit', (req, res, next) => {
  var incomeId = req.params.id;
  Income.findByIdAndUpdate(incomeId, req.body, { new: true })
    .then((i) => res.redirect('/onboarding'))
    .catch((err) => next(err));
});

router.get('/:id/delete', (req, res, next) => {
  var incomeId = req.params.id;
  Income.findByIdAndDelete(incomeId)
    .then((i) => res.redirect('/onboarding'))
    .catch((err) => next(err));
});

module.exports = router;
