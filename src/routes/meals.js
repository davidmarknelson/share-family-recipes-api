'use strict';
const router = require('express').Router();
const meals = require('../controllers/meals');
const auth = require('../middleware/auth');
const images = require('../middleware/images');
const parse = require('../middleware/parse');

router.route('/meal').get(meals.getMeal);
router.route('/create').post(auth.isAuthenticated, images.uploadMealPic, images.resizeImage, parse.parseMealFields, meals.create);
router.route('/update').put(auth.isAuthenticated, images.uploadMealPic, images.resizeImage, parse.parseMealFields, meals.update);
router.route('/delete').delete(auth.isAuthenticated, meals.delete);

module.exports = router;