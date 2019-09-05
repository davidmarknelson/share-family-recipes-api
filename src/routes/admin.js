'use strict';
const router = require('express').Router();
// Controller
const admin = require('../controllers/admin');
// Middleware
const adminAccess = require('../middleware/admin');
const parse = require('../middleware/parse');
const auth = require('../middleware/auth');

router.route('/newusers').get(auth.isAuthenticated, adminAccess.isAdmin, parse.parseOffsetAndLimit, admin.getUsersByNewest);
router.route('/oldusers').get(auth.isAuthenticated, adminAccess.isAdmin, parse.parseOffsetAndLimit, admin.getUsersByOldest);
router.route('/username-a-z').get(auth.isAuthenticated, adminAccess.isAdmin, parse.parseOffsetAndLimit, admin.getUsersAtoZ);
router.route('/username-z-a').get(auth.isAuthenticated, adminAccess.isAdmin, parse.parseOffsetAndLimit, admin.getUsersZtoA);
router.route('/firstname-a-z').get(auth.isAuthenticated, adminAccess.isAdmin, parse.parseOffsetAndLimit, admin.getUsersFirstNameAtoZ);
router.route('/firstname-z-a').get(auth.isAuthenticated, adminAccess.isAdmin, parse.parseOffsetAndLimit, admin.getUsersFirstNameZtoA);
router.route('/lastname-a-z').get(auth.isAuthenticated, adminAccess.isAdmin, parse.parseOffsetAndLimit, admin.getUsersLastNameAtoZ);
router.route('/lastname-z-a').get(auth.isAuthenticated, adminAccess.isAdmin, parse.parseOffsetAndLimit, admin.getUsersLastNameZtoA);

module.exports = router;