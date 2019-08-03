'use strict';
const router = require('express').Router();
const meals = require('../controllers/meals');
const auth = require('../middleware/auth');

router.route('/newest').get(meals.getByNewest);
router.route('/oldest').get(meals.getByOldest);
router.route('/names').get(meals.getMealsAtoZ);
router.route('/namesreverse').get(meals.getMealsZtoA);
router.route('/available').get(meals.findAvailableMealName);
router.route('/search').get(meals.search);
router.route('/byingredients').get(meals.getMealsContainingIngredients);
router.route('/meal').get(meals.getMeal);
router.route('/create').post(auth.isAuthenticated, meals.create);
router.route('/update').put(auth.isAuthenticated, meals.update);
router.route('/delete').delete(auth.isAuthenticated, meals.delete);

module.exports = router;