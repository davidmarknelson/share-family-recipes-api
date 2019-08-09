'use strict';
const router = require('express').Router();
const likes = require('../controllers/likes');
const auth = require('../middleware/auth');

router.route('/add').post(auth.isAuthenticated, likes.addLike);
router.route('/remove').delete(auth.isAuthenticated, likes.removeLike);

module.exports = router;