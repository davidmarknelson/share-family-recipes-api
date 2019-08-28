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
        attributes: ['id', 'difficulty', 'mealPic', 'name', 'prepTime', 'cookTime', 'creatorId'],
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: "creator", attributes: ['username', 'profilePic'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false }
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
        attributes: ['id', 'difficulty', 'mealPic', 'name', 'prepTime', 'cookTime', 'creatorId'],
        order: ['createdAt'],
        include: [
          { model: User, as: "creator", attributes: ['username', 'profilePic'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false }
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
        attributes: ['id', 'difficulty', 'mealPic', 'name', 'prepTime', 'cookTime', 'creatorId'],
        include: [
          { model: User, as: "creator", attributes: ['username', 'profilePic'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false },
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
        attributes: ['id', 'difficulty', 'mealPic', 'name', 'prepTime', 'cookTime', 'creatorId'],
        order: [[sequelize.fn('lower', sequelize.col('name')), 'DESC']],
        include: [
          { model: User, as: "creator", attributes: ['username', 'profilePic'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false }
        ]
      });

      if (meals.length === 0) return res.status(404).json({ message: 'There are no meals.' });

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of meals." });
    }
  },

  getMealsByIngredientsAtoZ: async (req, res) => {
    try {
      if (!req.query.ingredient) return res.status(400).json({ message: 'You must add ingredients to the search.' });

      let offset = offsetLimit.checkOffset(req.query.offset);
      let limit = offsetLimit.checkLimit(req.query.limit);

      let temp;
      if (!Array.isArray(req.query.ingredient)) {
        temp = [req.query.ingredient];
      } else {
        temp = req.query.ingredient;
      }
      let ingredients = temp.map(val => `%${val.toLowerCase()}%`);

      let meals = await Meal.findAll({
        offset: offset,
        limit: limit,
        where: {
          ingredients: {
            [Op.like]: sequelize.fn('ALL', ingredients)
          }
        },
        order: [sequelize.fn('lower', sequelize.col('name'))],
        attributes: ['id', 'difficulty', 'mealPic', 'name', 'prepTime', 'cookTime', 'creatorId'],
        include: [
          { model: User, as: "creator", attributes: ['username', 'profilePic'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false }
        ]
      });

      if (meals.length === 0) return res.status(404).json({ message: 'There are no meals with those ingredients.' });

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of meals." });
    }
  },

  getMealsByIngredientsZtoA: async (req, res) => {
    try {
      if (!req.query.ingredient) return res.status(400).json({ message: 'You must add ingredients to the search.' });

      let offset = offsetLimit.checkOffset(req.query.offset);
      let limit = offsetLimit.checkLimit(req.query.limit);

      let temp;
      if (!Array.isArray(req.query.ingredient)) {
        temp = [req.query.ingredient];
      } else {
        temp = req.query.ingredient;
      }
      let ingredients = temp.map(val => `%${val.toLowerCase()}%`);

      let meals = await Meal.findAll({
        offset: offset,
        limit: limit,
        where: {
          ingredients: {
            [Op.like]: sequelize.fn('ALL', ingredients)
          }
        },
        order: [[sequelize.fn('lower', sequelize.col('name')), 'DESC']],
        attributes: ['id', 'difficulty', 'mealPic', 'name', 'prepTime', 'cookTime', 'creatorId'],
        include: [
          { model: User, as: "creator", attributes: ['username', 'profilePic'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false }
        ]
      });

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
        attributes: ['username', 'profilePic'],
        include: [
          { 
            model: Meal, as: 'meals', 
            attributes: ['id', 'difficulty', 'mealPic', 'name', 'prepTime', 'cookTime', 'creatorId'],
            include: [
              { model: User, as: "creator", attributes: ['username', 'profilePic'], duplicating: false },
              { model: Like, attributes: ['userId'], duplicating: false }
            ]
          },
        ]
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
        limit: 10,
        order: [sequelize.fn('lower', sequelize.col('name'))],
        attributes: ['id', 'name']
      });

      if (meals.length === 0) return res.status(404).json({ message: 'There are no meals that match your search.' });

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}