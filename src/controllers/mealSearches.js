'use strict';
const Meal = require('../models/sequelize').meal;
const User = require('../models/sequelize').user;
const Like = require('../models/sequelize').like;
const Op = require('sequelize').Op;
const sequelize = require('../models/sequelize').sequelize;
const offsetLimit = require('../helpers/offsetLimit');

module.exports = {
  getByNewest: async (req, res) => {
    try {
      let offset = offsetLimit.checkOffset(req.query.offset);
      let limit = offsetLimit.checkOffset(req.query.limit);

      let meals = await Meal.findAll({
        offset: offset,
        limit: limit,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: "creator", attributes: ['username']},
          { model: Like, attributes: ['userId']}
        ]
      });

      if (meals.length === 0) {
        return res.status(404).json({ message: 'There are no meals.' });
      }

      res.status(200).json(meals);

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getByOldest: async (req, res) => {
    try {
      let offset = offsetLimit.checkOffset(req.query.offset);
      let limit = offsetLimit.checkOffset(req.query.limit);

      let meals = await Meal.findAll({
        offset: offset,
        limit: limit,
        order: ['createdAt'],
        include: [
          { model: User, as: "creator", attributes: ['username']}
        ]
      });

      if (meals.length === 0) {
        return res.status(404).json({ message: 'There are no meals.' });
      }

      res.status(200).json(meals);

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getMealsAtoZ: async (req, res) => {
    try {
      let offset = offsetLimit.checkOffset(req.query.offset);
      let limit = offsetLimit.checkLimit(req.query.limit);

      let meals = await Meal.findAll({
        offset: offset,
        limit: limit,
        order: [sequelize.fn('lower', sequelize.col('name'))],
        include: [
          { model: User, as: "creator", attributes: ['username']},
          { model: Like, attributes: ['userId']}
        ]
      });

      if (meals.length === 0) {
        return res.status(404).json({ message: 'There are no meals.' });
      }

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of meals." });
    }
  },

  getMealsZtoA: async (req, res) => {
    try {
      let offset = offsetLimit.checkOffset(req.query.offset);
      let limit = offsetLimit.checkLimit(req.query.limit);

      let meals = await Meal.findAll({
        offset: offset,
        limit: limit,
        order: [[sequelize.fn('lower', sequelize.col('name')), 'DESC']],
        include: [
          { model: User, as: "creator", attributes: ['username']}
        ]
      });

      if (meals.length === 0) return res.status(404).json({ message: 'There are no meals.' });

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of meals." });
    }
  },

  getMealsByIngredients: async (req, res) => {
    try {
      if (!req.query.ingredient) return res.status(400).json({ message: 'You must add ingredients to the search.' });

      let temp;
      if (!Array.isArray(req.query.ingredient)) {
        temp = [req.query.ingredient];
      } else {
        temp = req.query.ingredient;
      }
      let ingredients = temp.map(val => `'%${val.toLowerCase()}%'`);

      let meals = await sequelize.query(`
        SELECT meals.id, meals.name, meals.difficulty, users.username as "creator.username" FROM meals
        JOIN users ON "meals"."creatorId" = users.id 
        WHERE array_to_string(ingredients, ',') 
        like ALL(array[${ingredients}])
        ;`, {
          nest: true
        }
      );

      if (meals.length === 0) return res.status(404).json({ message: 'There are no meals with those ingredients.' });

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of meals." });
    }
  },

  getMealsCreatedByUser: async (req, res) => {
    try {
      let meals = await User.findOne({
        where: {          
          username: req.query.username
        },
        attributes: ['username'],
        include: ['meals']
      });

      if (!meals) return res.status(404).json({ message: 'This user has not created any meals.'});

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of meals." });
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
        res.status(200).json({ message: 'That name is available.' });
      } else {
        res.status(500).json({ message: 'That name is already taken.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  searchByName: async (req, res) => {
    try {
      let meals = await Meal.findAll({
        where: {
          name: {
            [Op.iLike]: `%${req.query.name}%`
          }
        },
        attributes: ['id', 'name']
      });

      if (meals.length === 0) return res.status(404).json({ message: 'There are no meals that match your search.' });

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}