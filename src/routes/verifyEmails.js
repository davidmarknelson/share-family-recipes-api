const router = require('express').Router();
const verify = require('../controllers/verifyEmails');
const trim = require('../middleware/trim');

router.route('/').post(verify.verifyEmail);
router.route('/resend').post(trim.trimBodyEmail, verify.resendVerificationEmail);

module.exports = router;