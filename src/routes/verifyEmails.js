'use strict';
const router = require('express').Router();
// Controller
const verify = require('../controllers/verifyEmails');
// Middleware
const parse = require('../middleware/parse');

router.route('/').post(verify.verifyEmail);
router.route('/send').post(parse.trimBodyEmail, verify.sendVerificationEmail);

module.exports = router;