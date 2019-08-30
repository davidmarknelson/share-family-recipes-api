'use strict';
const router = require('express').Router();
const savedMeals = require('../controllers/savedMeals');
const auth = require('../middleware/auth');
const parse = require('../middleware/parse');

router.route('/find').get(auth.isAuthenticated, parse.parseOffsetAndLimit, savedMeals.findAll);
router.route('/save').post(auth.isAuthenticated, savedMeals.saveMeal);
router.route('/unsave').delete(auth.isAuthenticated, savedMeals.unsaveMeal);

module.exports = router;