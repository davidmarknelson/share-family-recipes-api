'use strict';
const router = require('express').Router();
const meals = require('../controllers/mealSearches');
const parse = require('../middleware/parse');

router.route('/newest').get(parse.parseOffsetAndLimit, meals.getByNewest);
router.route('/oldest').get(parse.parseOffsetAndLimit, meals.getByOldest);
router.route('/names-a-z').get(parse.parseOffsetAndLimit, meals.getMealsAtoZ);
router.route('/names-z-a').get(parse.parseOffsetAndLimit, meals.getMealsZtoA);
router.route('/byingredients-a-z').get(parse.parseOffsetAndLimit, meals.getMealsByIngredientsAtoZ);
router.route('/byingredients-z-a').get(parse.parseOffsetAndLimit, meals.getMealsByIngredientsZtoA);
router.route('/byuser').get(parse.parseOffsetAndLimit, meals.getMealsCreatedByUser);
router.route('/available-names').get(meals.findAvailableMealName);
router.route('/name').get(meals.searchByName);

module.exports = router;