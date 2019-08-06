'use strict';
const router = require('express').Router();
const users = require('../controllers/users');
const auth = require('../middleware/auth');
const trim = require('../middleware/trim');
// This route checks if a username is available
router.route('/available-username').get(users.findUsername);
router.route('/signup').post(trim.trimBodyEmail, users.signup);
router.route('/login').post(trim.trimBodyEmail, users.login);
// This route gets the profile for users who have a valid jwt
router.route('/profile').get(auth.isAuthenticated, users.profile);
router.route('/update').put(trim.trimBodyEmail, auth.isAuthenticated, users.update);
router.route('/delete').delete(auth.isAuthenticated, users.delete);

module.exports = router;