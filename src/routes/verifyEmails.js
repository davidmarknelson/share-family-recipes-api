const router = require('express').Router();
const verify = require('../controllers/verifyEmails');

router.route('/').post(verify.verifyEmail);
router.route('/resend').post(verify.resendVerificationEmail);

module.exports = router;