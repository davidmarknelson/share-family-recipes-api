'use strict';
// Models and database function helpers
const sequelize = require('../models/sequelize').sequelize;
const SavedMeal = require('../models/sequelize').saved_meal;
const Meal = require('../models/sequelize').meal;
const User = require('../models/sequelize').user;
const Like = require('../models/sequelize').like;
const MealPic = require('../models/sequelize').meal_pic;
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
          { model: User, as: "creator", attributes: ['username']},
          { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false },
        ]
      });

      if (!meal) return res.status(404).json({ message: 'That meal does not exist.' });

      meal.instructions = JSON.parse(meal.instructions);
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
      req.body.creatorId = req.decoded.id;
      
      let meal = await Meal.create(req.body);

      if (req.file) {
        let mealPic = await MealPic.create({
          mealId: meal.dataValues.id,
          mealPicName: req.file.filename
        });
      }

      res.status(201).json({
        id: meal.id,
        message: "Meal successfully created."
      });
    } catch (err) {
      // This deletes any meal picture a user uploaded during an attempt that had
      // an error. This is deleted so if they change the meal name on any following 
      // attempts, there won't be an unused picture.
      if (req.file) {
        // Checks if the meal picture exists
        fs.stat(`public/images/mealPics/${req.file.filename}`, (err, stats) => {
          if (stats) {
            // Deletes profile picture
            fs.unlink(`public/images/mealPics/${req.file.filename}`, (err) => {
              if (err) return res.status(500).json({ message: 'There was an error.' });
            });
          }
        });
      }

      if (err.errors) {
        if (err.errors[0].message === 'name must be unique') {
          return res.status(400).json({ message: 'This recipe name is already taken.' });
        }
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: 'There was an error creating your recipe.' });
    }
  },

  update: async (req, res) => {
    try {
      if (req.file) {
        let previousMealPic = await MealPic.findOne({
          where: { mealId: req.body.id }
        });

        // This deletes the old meal pic and creates the new one
        if (previousMealPic) {
          // Checks if the meal picture exists
          fs.stat(`public/images/mealPics/${previousMealPic.dataValues.mealPicName}`, (err, stats) => {
            if (stats) {
              // Deletes meal picture
              fs.unlink(`public/images/mealPics/${previousMealPic.dataValues.mealPicName}`, (err) => {
                if (err) return res.status(500).json({ message: 'There was an error.' });
              });
            }
          });
        }

        let mealPicToDelete = MealPic.destroy({
          where: { mealId: req.body.id }
        })

        let mealPic = await MealPic.create({
          mealId: req.body.id,
          mealPicName: req.file.filename
        });
      }

      let meal = await Meal.update(req.body, {
        where: { 
          id: req.body.id,
          creatorId: req.decoded.id
        }
      });

      if (meal[0] === 1) {
        return res.status(201).json({ 
          id: req.body.id,
          message: 'Meal successfully updated.' 
        });
      } else {
        throw Error();
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

      let mealPicToDelete = await MealPic.findOne({
        where: { mealId: req.body.id }
      });
      
      if (mealPicToDelete) {
        // Checks if the meal picture exists
        fs.stat(`public/images/mealPics/${mealPicToDelete.dataValues.mealPicName}`, (err, stats) => {
          if (stats) {
            // Deletes meal picture
            fs.unlink(`public/images/mealPics/${mealPicToDelete.dataValues.mealPicName}`, (err) => {
              if (err) return res.status(500).json({ message: 'There was an error.' });
            });
          }
        });

        let deletePic = await MealPic.destroy({
          where: { mealId: req.body.id }
        })
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