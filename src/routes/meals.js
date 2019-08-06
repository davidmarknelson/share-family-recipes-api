'use strict';
const router = require('express').Router();
const meals = require('../controllers/meals');
const auth = require('../middleware/auth');

router.route('/meal').get(meals.getMeal);
router.route('/create').post(auth.isAuthenticated, meals.create);
router.route('/update').put(auth.isAuthenticated, meals.update);
router.route('/delete').delete(auth.isAuthenticated, meals.delete);

module.exports = router;