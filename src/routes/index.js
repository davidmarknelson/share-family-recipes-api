'use strict';
const router = require('express').Router();
const users = require('./users');
const meals = require('./meals');
const savedMeals = require('./savedMeals');
const verifyEmails = require('./verifyEmails');
const passwords = require('./passwords');
const admin = require('./admin');
const mealSearches = require('./mealSearches');

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
router.use('/saved', savedMeals);

// Verify Email routes
router.use('/verify', verifyEmails);

// Reset and update password routes
router.use('/password', passwords);

// Future routes
// // Liked Meal routes
// router.use('/like', placeholder);

module.exports = router;