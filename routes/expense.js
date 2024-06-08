var express = require('express');
var router = express.Router();
var Expense = require('../model/expense');
var auth = require('../middlewares/auth');

router.use(auth.isUserLogged);
// cretae income source

router.get('/new', (req, res, next) => {
  res.render('createExpense');
});

router.post('/create', (req, res, next) => {
  Expense.create(req.body)
    .then((expense) => {
      Expense.findByIdAndUpdate(
        expense.id,
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
  var expenseId = req.params.id;
  Expense.findById(expenseId)
    .then((i) => res.render('editExpense', { i }))
    .catch((err) => next(err));
});
router.post('/:id/edit', (req, res, next) => {
  var expenseId = req.params.id;
  Expense.findByIdAndUpdate(expenseId, req.body, { new: true })
    .then((i) => res.redirect('/onboarding'))
    .catch((err) => next(err));
});

router.get('/:id/delete', (req, res, next) => {
  var expenseId = req.params.id;
  Expense.findByIdAndDelete(expenseId)
    .then((i) => res.redirect('/onboarding'))
    .catch((err) => next(err));
});

module.exports = router;
