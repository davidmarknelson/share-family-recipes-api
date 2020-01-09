'use strict';
const router = require('express').Router();
// Controller
const meals = require('../controllers/meals');
// Middleware
const parse = require('../middleware/parse');
const auth = require('../middleware/auth');

router.route('/meal-by-id').get(meals.getMealById);
router.route('/meal-by-name').get(meals.getMealByName);
router.route('/available-names').get(meals.findAvailableMealName);
router.route('/create').post(auth.isAuthenticated, parse.parseMealFields, meals.create);
router.route('/update').put(auth.isAuthenticated, parse.parseMealFields, meals.update);
router.route('/delete').delete(auth.isAuthenticated, meals.delete);

module.exports = router;