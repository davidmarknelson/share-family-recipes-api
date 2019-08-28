'use strict';
const Meal = require('../models/sequelize').meal;
const User = require('../models/sequelize').user;
const fs = require('fs');

module.exports = {

  getMeal: async (req, res) => {
    try {
      let meal = await Meal.findOne({
        where: {
          name: req.query.name
        },
        include: [
          { model: User, as: "creator", attributes: ['username']}
        ]
      });

      if (!meal) return res.status(404).json({ message: 'There was an error getting the meal.' });

      meal.ingredients = JSON.parse(meal.ingredients);

      res.status(200).json(meal);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  create: async (req, res) => {
    try {
      if (req.file) {
        req.body.mealPic = req.file.path;
      }

      req.body.creatorId = req.decoded.id;

      let meal = await Meal.create(req.body);

      meal.ingredients = JSON.parse(meal.ingredients);

      res.status(200).json(meal);
    } catch (err) {
      if (err.errors) {
        if (err.errors[0].message === 'name must be unique') {
          return res.status(400).json({ message: 'This meal name is already in use.' });
        }
      }
      res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      if (req.file) {
        req.body.mealPic = req.file.path;
      }

      req.body.ingredients = JSON.stringify(req.body.ingredients);

      let meal = await  Meal.update(req.body, {
        where: { 
          id: req.body.id,
          creatorId: req.decoded.id
        }
      });

      if (meal[0] === 1) {
        return res.status(200).json({ message: 'Meal successfully updated.' });
      } else {
        return res.status(500).json({ message: 'There was an error updating your meal.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      let meal = await Meal.findOne({
        where: {
          name: req.body.name,
          creatorId: req.decoded.id
        }
      });

      if (meal && meal.dataValues.mealPic) {
        // Checks if the meal picture exists
        fs.stat(meal.dataValues.mealPic, (err, stats) => {
          if (stats) {
            // Deletes meal picture
            fs.unlink(meal.dataValues.mealPic, (err) => {
              if (err) res.status(500).json({ message: 'There was an error deleting your meal picture.' });
            });
          }
        });
      }

      let deleted = await Meal.destroy({
        where: { 
          name: req.body.name,
          creatorId: req.decoded.id
        }
      });

      if (deleted) {
        return res.status(200).json({ message: 'Meal successfully deleted.' });
      } else {
        return res.status(500).json({ message: 'There was an error deleting your meal.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
}