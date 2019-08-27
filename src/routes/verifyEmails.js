'use strict';
const router = require('express').Router();
const verify = require('../controllers/verifyEmails');
const parse = require('../middleware/parse');

router.route('/').post(verify.verifyEmail);
router.route('/send').post(parse.trimBodyEmail, verify.sendVerificationEmail);

module.exports = router;