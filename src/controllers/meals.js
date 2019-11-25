'use strict';
// Models and database function helpers
const sequelize = require('../models/sequelize').sequelize;
const SavedMeal = require('../models/sequelize').saved_meal;
const Meal = require('../models/sequelize').meal;
const User = require('../models/sequelize').user;
const Like = require('../models/sequelize').like;
// File system
const fs = require('fs');

module.exports = {

  getMeal: async (req, res) => {
    try {
      let meal = await Meal.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('name')), 
          sequelize.fn('lower', req.query.name)
        ),
        include: [
          { model: User, as: "creator", attributes: ['username']}
        ]
      });

      if (!meal) return res.status(404).json({ message: 'That meal does not exist.' });

      meal.ingredients = JSON.parse(meal.ingredients);

      res.status(200).json(meal);
    } catch (err) {
      res.status(500).json({ message: 'There was an error getting the meal.' });
    }
  },

  findAvailableMealName: async (req, res) => {
    try {
      let meal = await Meal.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('name')), 
          sequelize.fn('lower', req.query.name)
        )
      });

      if (!meal) {
        res.status(204).json();
      } else {
        res.status(400).json();
      }
    } catch (err) {
      res.status(500).json({ message: 'There was an error finding available meal names.' });
    }
  },

  create: async (req, res) => {
    try {
      if (req.file) {
        req.body.mealPic = req.file.path;
      }

      req.body.creatorId = req.decoded.id;
      
      if (req.body.name.includes(' ')) {
        req.body.originalName = req.body.name.replace(/\s+/g, '-');
      } else {
        req.body.originalName = req.body.name;
      }

      let meal = await Meal.create(req.body);

      res.status(201).json({
        id: meal.id,
        message: "Meal successfully created."
      });
    } catch (err) {
      if (err.errors) {
        if (err.errors[0].message === 'name must be unique') {
          return res.status(400).json({ message: 'This recipe name is already taken.' });
        }
      }
      res.status(500).json({ message: 'There was an error creating your recipe.' });
    }
  },

  update: async (req, res) => {
    try {
      if (req.file) {
        req.body.mealPic = req.file.path;
      }

      let meal = await  Meal.update(req.body, {
        where: { 
          id: Number(req.body.id),
          creatorId: req.decoded.id
        }
      });

      if (meal[0] === 1) {
        return res.status(201).json({ 
          id: Number(req.body.id),
          message: 'Meal successfully updated.' 
        });
      } else {
        return res.status(500).json({ message: 'There was an error updating your meal.' });
      }
    } catch (err) {
      if (err.errors) {
        if (err.errors[0].message === 'name must be unique') {
          return res.status(400).json({ message: 'This meal name is already taken.' });
        }
      }
      res.status(500).json({ message: 'There was an error updating your meal.' });
    }
  },

  delete: async (req, res) => {
    try {
      let meal = await Meal.findOne({
        where: {
          id: req.body.id,
          creatorId: req.decoded.id
        }
      });

      if (meal && meal.dataValues.mealPic) {
        // Checks if the meal picture exists
        fs.stat(meal.dataValues.mealPic, (err, stats) => {
          if (stats) {
            // Deletes meal picture
            fs.unlink(meal.dataValues.mealPic, (err) => {
              if (err) return res.status(500).json({ message: 'There was an error deleting your meal picture.' });
            });
          }
        });
      }

      if (meal) {
        let deletedRelatedData = await Promise.all([
          SavedMeal.destroy({where: { mealId: meal.dataValues.id }}),
          Like.destroy({where: { mealId: meal.dataValues.id }})
        ]);
      }

      let deleted = await Meal.destroy({
        where: { 
          id: req.body.id,
          creatorId: req.decoded.id
        }
      });

      if (deleted) {
        return res.status(200).json({ message: 'Meal successfully deleted.' });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: 'There was an error deleting your meal.' });
    }
  },
}