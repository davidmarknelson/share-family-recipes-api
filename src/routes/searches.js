'use strict';
const router = require('express').Router();
// Controller
const meals = require('../controllers/searches');
// Middleware
const parse = require('../middleware/parse');

router.route('/newest').get(parse.parseOffsetAndLimit, meals.getByNewest);
router.route('/oldest').get(parse.parseOffsetAndLimit, meals.getByOldest);
router.route('/names-a-z').get(parse.parseOffsetAndLimit, meals.getMealsAtoZ);
router.route('/names-z-a').get(parse.parseOffsetAndLimit, meals.getMealsZtoA);
router.route('/byingredients-a-z').get(parse.parseOffsetAndLimit, meals.getMealsByIngredientsAtoZ);
router.route('/byingredients-z-a').get(parse.parseOffsetAndLimit, meals.getMealsByIngredientsZtoA);
router.route('/byuser-a-z').get(parse.parseOffsetAndLimit, meals.getMealsCreatedByUserAtoZ);
router.route('/byuser-z-a').get(parse.parseOffsetAndLimit, meals.getMealsCreatedByUserZtoA);
router.route('/name').get(meals.searchByName);

module.exports = router;