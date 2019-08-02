'use strict';
const router = require('express').Router();
const meals = require('../controllers/meals');
const auth = require('../middleware/auth');

router.route('/newest').get(meals.findByNewest);
router.route('/oldest').get(meals.findByOldest);
router.route('/available').get(meals.findAvailableMealName);
router.route('/create').post(auth.isAuthenticated, meals.create);
router.route('/update').put(auth.isAuthenticated, meals.update);

module.exports = router;