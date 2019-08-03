'use strict';
const Meal = require('../models/sequelize').meal;
const User = require('../models/sequelize').user;
const Op = require('sequelize').Op;
const sequelize = require('../models/sequelize').sequelize;
const offsetLimit = require('../helpers/offsetLimit');

const meals = {

  getByNewest: async (req, res) => {
    try {
      let offset = offsetLimit.checkOffset(req.query.offset);
      let limit = offsetLimit.checkOffset(req.query.limit);

      let meals = await Meal.findAll({
        offset: offset,
        limit: limit,
        order: [['createdAt', 'DESC']],
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
          { model: User, as: "creator", attributes: ['username']}
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

  getMealsContainingIngredients: async (req, res) => {
    try {
      let temp;
      if (!Array.isArray(req.query.ingredient)) {
        temp = [req.query.ingredient];
      } else {
        temp = req.query.ingredient;
      }
      let ingredients = temp.map(val => val.toLowerCase());

      let meals = await Meal.findAll({
        where: {
          ingredients: {
            [Op.contains]: ingredients
          }
        },
        include: [
          { model: User, as: "creator", attributes: ['username']}
        ]
      });

      if (meals.length === 0) return res.status(404).json({ message: 'There are no meals with those ingredients.' });

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

  search: async (req, res) => {
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
  },

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

      res.status(200).json(meal);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  create: async (req, res) => {
    try {
      let payload = req.body;
      payload.creatorId = req.decoded.id;
      let meal = await Meal.create(payload);

      res.status(200).json(meal);
    } catch (err) {
      res.status(500).json({ message: err.errors[0].message || err.message });
    }
  },

  update: async (req, res) => {
    try {
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
      let meal = await Meal.destroy({
        where: { 
          name: req.body.name,
          creatorId: req.decoded.id
        }
      });

      if (meal) {
        return res.status(200).json({ message: 'Meal successfully deleted.' });
      } else {
        return res.status(500).json({ message: 'There was an error deleting your meal.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
}

module.exports = meals;