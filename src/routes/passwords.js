'use strict';
const router = require('express').Router();
const auth = require('../middleware/auth');
const passwords = require('../controllers/passwords');
const trim = require('../middleware/trim');

router.route('/change').put(auth.isAuthenticated, passwords.updatePassword);
router.route('/sendemail').post(trim.trimBodyEmail, passwords.sendResetEmail);
router.route('/reset').put(passwords.resetPassword);

module.exports = router;