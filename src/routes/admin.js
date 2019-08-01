'use strict';
const router = require('express').Router();
const admin = require('../controllers/admin');
const auth = require('../middleware/auth');
const adminAccess = require('../middleware/admin');

router.route('/').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getAllUsersDisplayInfo);

module.exports = router;