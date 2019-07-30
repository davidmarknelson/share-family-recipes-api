const router = require('express').Router();
const users = require('./users');
const meals = require('./meals');
const savedMeals = require('./savedMeals');
const verifyEmails = require('./verifyEmails');

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

// Verify Email routes
router.use('/verify', verifyEmails);

// Future routes
// // Reset and update password routes
// router.use('/password', placeholder);

// // Liked Meal routes
// router.use('/like', placeholder);

module.exports = router;