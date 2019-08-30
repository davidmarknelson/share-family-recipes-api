'use strict';
const router = require('express').Router();
// Controller
const savedMeals = require('../controllers/savedMeals');
// Middleware
const parse = require('../middleware/parse');
const auth = require('../middleware/auth');

router.route('/find').get(auth.isAuthenticated, parse.parseOffsetAndLimit, savedMeals.findAll);
router.route('/save').post(auth.isAuthenticated, savedMeals.saveMeal);
router.route('/unsave').delete(auth.isAuthenticated, savedMeals.unsaveMeal);

module.exports = router;