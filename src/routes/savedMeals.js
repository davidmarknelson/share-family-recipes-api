const router = require('express').Router();
const savedMeals = require('../controllers/savedMeals');
const auth = require('../middleware/auth');

router.route('/find').get(auth.isAuthenticated, savedMeals.findAll);
router.route('/save').post(auth.isAuthenticated, savedMeals.saveMeal);
router.route('/unsave').delete(auth.isAuthenticated, savedMeals.unsaveMeal);

module.exports = router;