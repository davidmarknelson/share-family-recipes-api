'use strict';
const router = require('express').Router();
const auth = require('../middleware/auth');
const passwords = require('../controllers/passwords');
const parse = require('../middleware/parse');

router.route('/change').put(auth.isAuthenticated, parse.checkPasswordValidity, passwords.updatePassword);
router.route('/sendemail').post(parse.trimBodyEmail, passwords.sendResetEmail);
router.route('/reset').put(passwords.resetPassword);

module.exports = router;