const router = require('express').Router();
const users = require('../controllers/users');
const meals = require('../controllers/meals');

router.route('/').get((req, res) => {
  res.send('Auth api works!');
});

// =========================================================
// User routes
// =========================================================
// This route checks if a username is available
router.route('/user/username').get(users.findUsername);
router.route('/user/signup').post(users.signup);
router.route('/user/login').post(users.login);
router.route('/user/update').put(users.update);
router.route('/user/delete').delete(users.delete);

// =========================================================
// Meal routes
// =========================================================
router.route('/meals').get(meals.findAll);
router.route('/meals/name').get(meals.findMealName);
router.route('/meals/create').post(meals.create);
router.route('/meals/update').put(meals.update);
// Likes routes
router.route('/meals/addlike').put();
router.route('/meals/removelike').put();







module.exports = router;