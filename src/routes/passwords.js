'use strict';
const router = require('express').Router();
// Controller
const passwords = require('../controllers/passwords');
// Middleware
const parse = require('../middleware/parse');
const auth = require('../middleware/auth');

router.route('/update').put(auth.isAuthenticated, parse.checkPasswordValidity, passwords.updatePassword);
router.route('/send').post(parse.trimBodyEmail, passwords.sendResetEmail);
router.route('/reset').put(passwords.resetPassword);

module.exports = router;