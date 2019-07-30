const router = require('express').Router();
const auth = require('../middleware/auth');
const passwords = require('../controllers/passwords');

router.route('/change').post(auth.isAuthenticated, passwords.changePassword);
router.route('/reset').post(passwords.resetPassword);

module.exports = router;