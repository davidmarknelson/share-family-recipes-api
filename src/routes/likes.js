'use strict';
const router = require('express').Router();
// Controller
const likes = require('../controllers/likes');
// Middleware
const auth = require('../middleware/auth');

router.route('/add').post(auth.isAuthenticated, likes.addLike);
router.route('/remove').delete(auth.isAuthenticated, likes.removeLike);
router.route('/recipe-likes').get(likes.getRecipeLikes);

module.exports = router;