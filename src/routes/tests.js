'use strict';
const router = require('express').Router();
// Controller
const tests = require('../controllers/tests');

router.route('/delete').delete(tests.destroy);
router.route('/seed').post(tests.seed);
router.route('/seedunverified').post(tests.seedUnverified);
router.route('/seedemailtoken').post(tests.seedEmailTokenAndUser);
router.route('/seedpasswordtoken').post(tests.seedPasswordTokenAndUser);
router.route('/seedmultipleusers').post(tests.seedMultipleUsers);
router.route('/seedmeal').post(tests.seedMeal);
router.route('/seedmeal2').post(tests.seedMeal2);

module.exports = router;
