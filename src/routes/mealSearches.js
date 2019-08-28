'use strict';
const router = require('express').Router();
const meals = require('../controllers/mealSearches');

router.route('/newest').get(meals.getByNewest);
router.route('/oldest').get(meals.getByOldest);
router.route('/names-a-z').get(meals.getMealsAtoZ);
router.route('/names-z-a').get(meals.getMealsZtoA);
router.route('/name').get(meals.searchByName);
router.route('/byingredients-a-z').get(meals.getMealsByIngredientsAtoZ);
router.route('/byingredients-z-a').get(meals.getMealsByIngredientsZtoA);
router.route('/byuser').get(meals.getMealsCreatedByUser);
router.route('/available-names').get(meals.findAvailableMealName);

module.exports = router;