const router = require('express').Router();
const verify = require('../controllers/verifyEmails');

router.route('/').post(verify.verifyEmail);

module.exports = router;