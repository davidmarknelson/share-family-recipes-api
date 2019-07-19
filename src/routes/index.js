const router = require('express').Router();
const users = require('../controllers/users');
const meals = require('../controllers/meals');

router.route('/').get((req, res) => {
  res.send('Auth api works!');
});

// =========================================================
// User routes
// =========================================================
// This gets the full user profile by email
router.route('/user').get(users.findEmail);
// This route checks if a username is available
router.route('/user/username').get(users.findUsername);
router.route('/user/create').post(users.create);
router.route('/user/update').put(users.update);
router.route('/user/delete').delete(users.delete);

// =========================================================
// Meal routes
// =========================================================
router.route('/meals').get(meals.findAll);
router.route('/meals/create').post(meals.create);





module.exports = router;