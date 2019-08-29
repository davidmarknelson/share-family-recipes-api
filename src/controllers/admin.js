'use strict';
const User = require('../models/sequelize').user;
const sequelize = require('../models/sequelize').sequelize;

let attributesArray = [
  'id', 'username', 'firstName', 'lastName', 
  'email', 'isVerified', 'isAdmin', 'createdAt'
];

module.exports = {
  getUsersByNewest: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of users." });
    }
  },

  getUsersByOldest: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        order: ['createdAt']
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of users." });
    }
  },

  getUsersAtoZ: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        order: [sequelize.fn('lower', sequelize.col('username'))]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of users." });
    }
  },

  getUsersZtoA: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray, 
        order: [[sequelize.fn('lower', sequelize.col('username')), 'DESC']]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of users." });
    }
  },

  getUsersFirstNameAtoZ: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        order: [sequelize.fn('lower', sequelize.col('firstName'))]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of users." });
    }
  },

  getUsersFirstNameZtoA: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray, 
        order: [[sequelize.fn('lower', sequelize.col('firstName')), 'DESC']]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of users." });
    }
  },

  getUsersLastNameAtoZ: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        order: [sequelize.fn('lower', sequelize.col('lastName'))]
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of users." });
    }
  },

  getUsersLastNameZtoA: async (req, res) => {
    try {
      let users = await User.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray, 
        order: [[sequelize.fn('lower', sequelize.col('lastName')), 'DESC']]
      });
      
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "There was an error getting the list of users." });
    }
  }
}