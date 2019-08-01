'use strict';
const router = require('express').Router();
const meals = require('../controllers/meals');
const auth = require('../middleware/auth');

router.route('').get(meals.findAll);
router.route('/:name').get(meals.findMealName);
router.route('/create').post(auth.isAuthenticated, meals.create);
router.route('/update').put(auth.isAuthenticated, meals.update);

module.exports = router;