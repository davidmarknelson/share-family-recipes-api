'use strict';
const router = require('express').Router();
// Controller
const users = require('../controllers/users');
// Middleware
const images = require('../middleware/images');
const parse = require('../middleware/parse');
const auth = require('../middleware/auth');

// This route checks if a username is available
router.route('/available-username').get(users.findUsername);
router.route('/signup').post(images.uploadProfilePic, images.resizeImage, parse.checkPasswordValidity, parse.trimBodyEmail, users.signup);
router.route('/login').post(parse.trimBodyEmail, users.login);
// This route gets the profile for users who have a valid jwt
router.route('/renew').get(auth.isAuthenticated, users.renewJwt);
router.route('/profile').get(auth.isAuthenticated, users.profile);
router.route('/update').put(auth.isAuthenticated, images.uploadProfilePic, images.resizeImage, parse.trimBodyEmail, users.update);
router.route('/delete').delete(auth.isAuthenticated, users.delete);

module.exports = router;