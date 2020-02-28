'use strict';
const router = require('express').Router();
// Controller
const savedMeals = require('../controllers/savedMeals');
// Middleware
const parse = require('../middleware/parse');
const auth = require('../middleware/auth');

router.route('/a-z').get(auth.isAuthenticated, parse.parseOffsetAndLimit, savedMeals.findAllAtoZ);
router.route('/z-a').get(auth.isAuthenticated, parse.parseOffsetAndLimit, savedMeals.findAllZtoA);
router.route('/recipe-saved-recipes').get(savedMeals.getRecipeSavedRecipes);
router.route('/save').post(auth.isAuthenticated, savedMeals.saveMeal);
router.route('/unsave').delete(auth.isAuthenticated, savedMeals.unsaveMeal);

module.exports = router;