'use strict';
const router = require('express').Router();
// Controller
const tests = require('../controllers/tests');

router.route('/delete').delete(tests.destroy);
router.route('/seed').post(tests.seed);

module.exports = router;
