'use strict';
const router = require('express').Router();
const admin = require('../controllers/admin');
const auth = require('../middleware/auth');
const adminAccess = require('../middleware/admin');

router.route('/newusers').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getAllUsersByNewest);
router.route('/oldusers').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getAllUsersByOldest);
router.route('/username').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getAllUsersAtoZ);
router.route('/usernamereverse').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getAllUsersZtoA);



module.exports = router;