'use strict';
// Model and database funtion helpers
const sequelize = require('../models/sequelize').sequelize;
const User = require('../models/sequelize').user;
const Meal = require('../models/sequelize').meal;

const attributesArray = [
  'id', 'username', 'firstName', 'lastName', 
  'email', 'isVerified', 'isAdmin', 'createdAt'
];

const errorMessage = 'There was an error getting the list of users.';

module.exports = {
  getUsersByNewest: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        order: [['createdAt', 'DESC']],
        distinct: true,
        include: [
          { model: Meal, as: 'meals', attributes: ['id'], duplicating: false  }
        ]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getUsersByOldest: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        order: ['createdAt'],
        distinct: true,
        include: [
          { model: Meal, as: 'meals', attributes: ['id'], duplicating: false  }
        ]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getUsersAtoZ: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        order: [sequelize.fn('lower', sequelize.col('username'))],
        distinct: true,
        include: [
          { model: Meal, as: 'meals', attributes: ['id'], duplicating: false  }
        ]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getUsersZtoA: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray, 
        order: [[sequelize.fn('lower', sequelize.col('username')), 'DESC']],
        distinct: true,
        include: [
          { model: Meal, as: 'meals', attributes: ['id'], duplicating: false  }
        ]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getUsersFirstNameAtoZ: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        order: [sequelize.fn('lower', sequelize.col('firstName'))],
        distinct: true,
        include: [
          { model: Meal, as: 'meals', attributes: ['id'], duplicating: false  }
        ]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getUsersFirstNameZtoA: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray, 
        order: [[sequelize.fn('lower', sequelize.col('firstName')), 'DESC']],
        distinct: true,
        include: [
          { model: Meal, as: 'meals', attributes: ['id'], duplicating: false  }
        ]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getUsersLastNameAtoZ: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        order: [sequelize.fn('lower', sequelize.col('lastName'))],
        distinct: true,
        include: [
          { model: Meal, as: 'meals', attributes: ['id'], duplicating: false  }
        ]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getUsersLastNameZtoA: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray, 
        order: [[sequelize.fn('lower', sequelize.col('lastName')), 'DESC']],
        distinct: true,
        include: [
          { model: Meal, as: 'meals', attributes: ['id'], duplicating: false  }
        ]
      });
      
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  }
}