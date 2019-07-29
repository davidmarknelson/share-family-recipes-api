const SavedMeal = require('../models/sequelize').saved_meal;
const Meal = require('../models/sequelize').meal;

const savedMeals = {
  findAll: (req, res) => {
    SavedMeal.findAll({
      where: { userId: req.query.userId }
    })
    .then(savedMeals => res.status(200).json(savedMeals))
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  saveMeal: (req, res) => {
    SavedMeal.create({
      mealId: req.body.mealId,
      userId: req.body.userId
    })
    .then(savedMeal => res.status(200).json(savedMeal))
    .catch(err => {
      res.status(500).send({
        message: 'There was an error saving this meal.'
      });
    });
  },

  unsaveMeal: (req, res) => {
    SavedMeal.destroy({
      where: {
        mealId: req.body.mealId,
        userId: req.body.userId
      }
    })
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "User successfully deleted." });
      } else {
        res.status(500).json({ message: "There was an error deleting your profile." });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  }
}

module.exports = savedMeals;