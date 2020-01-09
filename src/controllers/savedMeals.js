'use strict';
// Models and database function helpers
const sequelize = require('../models/sequelize').sequelize;
const SavedMeal = require('../models/sequelize').saved_meal;
const User = require('../models/sequelize').user;
const Meal = require('../models/sequelize').meal;
const Like = require('../models/sequelize').like;
const MealPic = require('../models/sequelize').meal_pic;
const ProfilePic = require('../models/sequelize').profile_pic;

module.exports = {
  findAllAtoZ: async (req, res) => {
    try {
      let savedMeals = await SavedMeal.findAndCountAll({
        where: { userId: req.decoded.id },
        offset: req.query.offset,
        limit: req.query.limit,
        order: [[sequelize.fn('lower', sequelize.col('name'))]],
        attributes: [],
        include: [
          { 
            model: Meal, 
            attributes: [
              'id', 'difficulty', 'name', 'cookTime', 'creatorId', 'description', 'createdAt', 'updatedAt'
            ], 
            duplicating: false, 
            include: [
              { model: User, as: "creator", attributes: ['username'], duplicating: false },
              { model: Like, attributes: ['userId'], duplicating: false },
              { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
            ]
          }
        ]
      });

      let meals = savedMeals.rows.reduce((mealArray, object) => {
        mealArray.push(object.dataValues.meal.dataValues);
        return mealArray;
      }, []);

      let profilePic = await ProfilePic.findOne({
        where: {
          userId: req.decoded.id
        },
        attributes: ['profilePicName'],
      });

      res.status(200).json({
        id: req.decoded.id,
        username: req.decoded.username,
        // If there is a profilePic, it will return the object with profilePicName.
        // If there is no profilePic, it will return null
        profilePic: (profilePic) ? profilePic.dataValues : profilePic,
        count: savedMeals.count,
        rows: meals
      });
    } catch (err) {
      res.status(500).json({ message: 'There was an error getting your list of saved recipes.' });
    }
  },

  findAllZtoA: async (req, res) => {
    try {
      let savedMeals = await SavedMeal.findAndCountAll({
        where: { userId: req.decoded.id },
        offset: req.query.offset,
        limit: req.query.limit,
        order: [[sequelize.fn('lower', sequelize.col('name')), 'DESC']],
        attributes: [],
        include: [
          { 
            model: Meal, 
            attributes: [
              'id', 'difficulty', 'name', 'cookTime', 'creatorId', 'description', 'createdAt', 'updatedAt'
            ], 
            duplicating: false, 
            include: [
              { model: User, as: "creator", attributes: ['username'], duplicating: false },
              { model: Like, attributes: ['userId'], duplicating: false },
              { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
            ]
          }
        ]
      });

      let meals = savedMeals.rows.reduce((mealArray, object) => {
        mealArray.push(object.dataValues.meal.dataValues);
        return mealArray;
      }, []);

      let profilePic = await ProfilePic.findOne({
        where: {
          userId: req.decoded.id
        },
        attributes: ['profilePicName'],
      });

      res.status(200).json({
        id: req.decoded.id,
        username: req.decoded.username,
        // If there is a profilePic, it will return the object with profilePicName.
        // If there is no profilePic, it will return null
        profilePic: (profilePic) ? profilePic.dataValues : profilePic,
        count: savedMeals.count,
        rows: meals
      });
    } catch (err) {
      res.status(500).json({ message: 'There was an error getting your list of saved recipes.' });
    }
  },

  saveMeal: async (req, res) => {
    try {
      let savedMeal = await SavedMeal.create({
        mealId: req.body.recipeId,
        userId: req.decoded.id
      });

      if (savedMeal) {
        res.status(204).json();
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).send({ message: 'There was an error saving this recipe.' });
    }
  },

  unsaveMeal: async (req, res) => {
    try {
      let unsavedMeal = await SavedMeal.destroy({
        where: {
          mealId: req.body.recipeId,
          userId: req.decoded.id
        }
      });

      if (unsavedMeal) {
        res.status(204).json();
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: "There was an error unsaving this recipe." });
    }
  }
};