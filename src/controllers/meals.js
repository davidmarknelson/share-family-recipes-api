const Meal = require('../sequalize').meal;

const meals = {

  findAll: (req, res) => {
    Meal.findAll()
    .then(meals => {
      if (meals.length === 0) {
        res.status(200).json({ message: 'There are no meals.' });
      }
      res.status(200).json(meals);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  create: (req, res) => {
    Meal.create(req.body)
    .then(meal => res.status(200).json(meal))
    .catch(err => {
      res.status(500).json({
        message: err.errors[0].message || err.message
      });
    });
  }
}

module.exports = meals;