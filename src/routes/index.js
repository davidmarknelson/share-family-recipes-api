const router = require('express').Router();
const auth = require('../middleware/auth');
const users = require('./users');
const meals = require('./meals');
const savedMeals = require('./savedMeals');

// Base route
router.route('/').get((req, res) => {
  res.status(200).json('Auth api works!');
});

// User routes
router.use('/user', users);

// Meal routes
router.use('/meals', meals);

// Saved Meal routes
router.use('/saved', savedMeals);

module.exports = router;