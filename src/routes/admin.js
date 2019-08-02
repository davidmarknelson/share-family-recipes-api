'use strict';
const router = require('express').Router();
const admin = require('../controllers/admin');
const auth = require('../middleware/auth');
const adminAccess = require('../middleware/admin');

router.route('/newusers').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersByNewest);
router.route('/oldusers').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersByOldest);
router.route('/username').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersAtoZ);
router.route('/usernamereverse').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersZtoA);
router.route('/firstname').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersFirstNameAtoZ);
router.route('/firstnamereverse').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersFirstNameZtoA);
router.route('/lastname').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersLastNameAtoZ);
router.route('/lastnamereverse').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersLastNameZtoA);


module.exports = router;