'use strict';
const Meal = require('../models/sequelize').meal;
const User = require('../models/sequelize').user;

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

      res.status(200).json(meal);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  create: async (req, res) => {
    try {
      let payload = req.body;
      payload.ingredients = payload.ingredients.map(val => val.toLowerCase());
      payload.creatorId = req.decoded.id;
      let meal = await Meal.create(payload);

      res.status(200).json(meal);
    } catch (err) {
      if (err.errors) {
        console.log(err.errors)
        return res.status(500).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      let payload = req.body;
      payload.ingredients = payload.ingredients.map(val => val.toLowerCase());
      
      let meal = await  Meal.update(payload, {
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