'use strict';
const router = require('express').Router();
// Controllers
const mealSearches = require('./mealSearches');
const verifyEmails = require('./verifyEmails');
const savedMeals = require('./savedMeals');
const passwords = require('./passwords');
const users = require('./users');
const meals = require('./meals');
const admin = require('./admin');
const likes = require('./likes');

// Base route
router.route('/').get((req, res) => {
  res.status(200).json('Auth api works!');
});

// User routes
router.use('/user', users);

// Admin routes
router.use('/admin', admin);

// Meal routes
router.use('/meals', meals);

// Search meal routes
router.use('/meals/search', mealSearches);

// Saved Meal routes
router.use('/savedmeals', savedMeals);

// Verify Email routes
router.use('/verify', verifyEmails);

// Reset and update password routes
router.use('/password', passwords);

// Liked Meal routes
router.use('/likes', likes);

// Error handler for 404 pages
router.use((req, res, next) => {
  const error = new Error("Looks like what you are searching for does not exist!");
  error.status = 404;
  next(error);
});

// Error handler to pass along error messages
router.use((err, req, res, next) => {
  if (err) {
    if (err.message === 'Please upload a JPEG image.') err.status = 415;
    if (err.message === 'Username must not include a space.') err.status = 400;
    if (err.message === 'Username must be between 5 and 15 characters.') err.status = 400;
    res.status(err.status || 500).json({ message: err.message || 'Oops! There was an error'});
  }
});

module.exports = router;