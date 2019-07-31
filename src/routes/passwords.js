const router = require('express').Router();
const auth = require('../middleware/auth');
const passwords = require('../controllers/passwords');
const trim = require('../middleware/trim');

router.route('/change').put(auth.isAuthenticated, passwords.changePassword);
router.route('/send').post(trim.trimBodyEmail, passwords.sendResetEmail);
router.route('/reset').post(passwords.resetPassword);

module.exports = router;