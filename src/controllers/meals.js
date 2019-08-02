'use strict';
const Meal = require('../models/sequelize').meal;
const User = require('../models/sequelize').user;
const offsetLimit = require('../helpers/offsetLimit');
const meals = {

  findByNewest: async (req, res) => {
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

  findByOldest: async (req, res) => {
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

  findAvailableMealName: async (req, res) => {
    try {
      let meal = await Meal.findOne({
        where: { name: req.query.name }
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
}

module.exports = meals;