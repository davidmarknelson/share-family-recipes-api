'use strict';
const router = require('express').Router();
const admin = require('../controllers/admin');
const auth = require('../middleware/auth');
const adminAccess = require('../middleware/admin');

router.route('/newusers').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersByNewest);
router.route('/oldusers').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersByOldest);
router.route('/username-a-to-z').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersAtoZ);
router.route('/username-z-to-a').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersZtoA);
router.route('/firstname-a-to-z').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersFirstNameAtoZ);
router.route('/firstname-z-to-a').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersFirstNameZtoA);
router.route('/lastname-a-to-z').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersLastNameAtoZ);
router.route('/lastname-z-to-a').get(auth.isAuthenticated, adminAccess.isAdmin, admin.getUsersLastNameZtoA);


module.exports = router;