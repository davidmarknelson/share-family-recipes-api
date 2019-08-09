'use strict';
const SavedMeal = require('../models/sequelize').saved_meal;

module.exports = {
  findAll: async (req, res) => {
    try {
      let savedMeals = await SavedMeal.findAll({
        where: { userId: req.decoded.id },
        attributes: ['mealId'],
        include: ['meal']
      });

      if (savedMeals.length === 0) return res.status(404).json({ message: 'You have not saved any meals.' });

      res.status(200).json(savedMeals);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  saveMeal: async (req, res) => {
    try {
      let savedMeal = await SavedMeal.create({
        mealId: req.body.mealId,
        userId: req.decoded.id
      });

      if (savedMeal) {
        res.status(200).json({ message: 'Meal successfully saved.' });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).send({ message: 'There was an error saving this meal.' });
    }
  },

  unsaveMeal: async (req, res) => {
    try {
      let unsavedMeal = await SavedMeal.destroy({
        where: {
          mealId: req.body.mealId,
          userId: req.decoded.id
        }
      });

      if (unsavedMeal) {
        res.status(200).json({ message: "Meal successfully unsaved." });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: "There was an error unsaving this meal." });
    }
  }
};