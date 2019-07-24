const router = require('express').Router();
const users = require('../controllers/users');
const auth = require('../middleware/auth');

// This route checks if a username is available
router.route('/username').get(users.findUsername);
router.route('/signup').post(users.signup);
router.route('/login').post(users.login);
router.route('/update').put(auth.isAuthenticated, users.update);
router.route('/delete').delete(auth.isAuthenticated, users.delete);

module.exports = router;