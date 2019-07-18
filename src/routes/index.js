const router = require('express').Router();

router.route('/').get((req, res) => {
  res.send('Auth api works!');
});

module.exports = router