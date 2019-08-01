'use strict';
const Meal = require('../models/sequelize').meal;

const meals = {

  findAll: (req, res) => {
    
    Meal.findAll()
    .then(meals => {
      if (meals.length === 0) {
        return res.status(200).json({ message: 'There are no meals.' });
      }
      res.status(200).json(meals);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  findMealName: (req, res) => {
    Meal.findOne({
      where: { name: req.query.name }
    })
    .then(meal => {
      if (!meal) {
        res.status(200).json({ message: 'That name is available.' });
      } else {
        res.status(500).json({ message: 'That name is already taken.' });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  create: (req, res) => {
    Meal.create(req.body)
    .then(meal => res.status(200).json(meal))
    .catch(err => {
      res.status(500).json({
        message: err.errors[0].message || err.message
      });
    });
  },

  update: (req, res) => {
    Meal.update(req.body, {
      where: { 
        id: req.body.id
      }
    })
    .then(meal => {
      if (meal[0] === 1) {
        return res.status(200).json({ message: 'Meal successfully updated.' });
      } else {
        return res.status(500).json({ message: 'There was an error updating your meal.' });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },
}

module.exports = meals;