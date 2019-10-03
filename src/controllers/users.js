'use strict';
// Models and operators
const SavedMeal = require('../models/sequelize').saved_meal;
const Like = require('../models/sequelize').like;
const User = require('../models/sequelize').user;
const Meal = require('../models/sequelize').meal;
const Op = require('sequelize').Op;
// JWT and file system
const jwt = require('jsonwebtoken');
const fs = require('fs');
// Config
const config = require('../../config');

function jwtSignUser(user) {
  return jwt.sign(user, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRATION_TIME
  });
}

module.exports = {

  findUsername: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { 
          username: {
            [Op.iLike]: req.query.username 
          }
        }
      });

      if (!user) {
        return res.status(204).json();
      } else {
        return res.status(400).json();
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  profile: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { id: req.decoded.id }
      });

      delete user.dataValues.password;

      res.status(200).json({
        jwt: jwtSignUser(user.dataValues)
      });
    } catch (err) {
      res.status(500).json({message: 'There was an error getting your profile.'});
    }
  },

  signup: async (req, res) => {
    try {
      if (req.body.password !== req.body.passwordConfirmation) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      if (req.body.adminCode === config.ADMIN_CODE) {
        req.body.isAdmin = true;
      } else {
        req.body.isAdmin = false;
      }

      if (req.file) {
        req.body.profilePic = req.file.path;
      }

      req.body.originalUsername = req.body.username;

      delete req.body.passwordConfirmation;

      let user = await User.create(req.body);

      delete user.dataValues.password;
      
      res.status(201).json({
        jwt: jwtSignUser(user.dataValues)
      });
    } catch (err) {
       // This deletes any profile picture a user uploaded during an attempt that had
       // an error. This is deleted so if they change their username on any following 
       // attempts, there won't be an unused picture.
       if (req.body.profilePic) {
        // Checks if the profile picture exists
        fs.stat(req.body.profilePic, (err, stats) => {
          if (stats) {
            // Deletes profile picture
            fs.unlink(req.body.profilePic, (err) => {
              if (err) return res.status(500).json({ message: 'There was an error.' });
            });
          }
        });
      }

      if (err.errors) {
        if (err.errors[0].message === 'email must be unique') {
          return res.status(400).json({ message: 'This email account is already in use.' });
        }
        if (err.errors[0].message === 'Username must be 5 to 15 characters.') {
          return res.status(400).json({ message: 'Username must be 5 to 15 characters.' });
        }
        if (err.errors[0].message === 'username must be unique') {
          return res.status(400).json({ message: 'This username is already taken.' });
        }
        if (err.errors[0].message === 'Username must not contain a space.') {
          return res.status(400).json({ message: 'Username must not contain a space.' });
        }
      }
      
      res.status(500).json({ message: err.message || 'There was an error signing up. Please try again.' });
    }
  },

  login: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { email: req.body.email }
      });

      if (!user) {
        return res.status(400).json({ message: 'The login information was incorrect.'});
      }

      let passwordsMatch = await User.comparePasswords(req.body.password, user.password);

      if (!passwordsMatch) {
        return res.status(400).json({ message: 'The login information was incorrect.'});
      }

      delete user.dataValues.password;

      res.status(200).json({
        jwt: jwtSignUser(user.dataValues)
      });
    } catch (err) {
      res.status(500).json({ message: 'There was an error logging in.' });
    }
  },

  update: async (req, res) => {
    try {
      if (req.body.password) delete req.body.password;

      if (req.file) {
        req.body.profilePic = req.file.path;
      }

      let user = await User.update(req.body, {
        where: { id: req.decoded.id }
      });

      if (user[0] === 1) {
        return res.status(201).json({ message: "User successfully updated." });
      } else if (user[0] === 0) {
        throw Error();
      }
    } catch (err) {
      if (err.errors) {
        if (err.errors[0].message === 'email must be unique') {
          return res.status(400).json({ message: 'This email account is already in use.' });
        }
        if (err.errors[0].message === 'Username must be 5 to 15 characters.') {
          return res.status(400).json({ message: 'Username must be 5 to 15 characters.' });
        }
        if (err.errors[0].message === 'username must be unique') {
          return res.status(400).json({ message: 'This username is already taken.' });
        }
      }
      res.status(500).json({ message: err.message || "There was an error updating your profile." });
    }
  },

  delete: async (req, res) => {
    try {
      // Checks if there is a profile picture associated with the user
      if (req.decoded.profilePic) {
        // Checks if the profile picture exists
        fs.stat(req.decoded.profilePic, (err, stats) => {
          if (stats) {
            // Deletes profile picture
            fs.unlink(req.decoded.profilePic, (err) => {
              if (err) return res.status(500).json({ message: 'There was an error deleting your profile picture.' });
            });
          }
        });
      }

      let meals = await Meal.findAll({
        where: {
          creatorId: req.decoded.id
        }
      });

      let mealPics;
      if (meals) {
        mealPics = meals.reduce((pictures, meal) => {
          if (meal.dataValues.mealPic) {
            pictures.push(meal.dataValues.mealPic);
          }
          return pictures;
        }, []);
      }

      for (let mealPic of mealPics) {
        fs.stat(mealPic, (err, stats) => {
          if (stats) {
            fs.unlink(mealPic, (err) => {
              if (err) return res.status(500).json({ message: 'There was an error deleting a meal picture.' });
            });
          }
        });
      }
      
      // User is deleted separately from the others because the userId fields in meal, likes, and saved meal
      // tables will be set to null and then it will be difficult to delete. Sequelize has an open issue around 
      // this. The issue can be found here https://github.com/sequelize/sequelize/issues/8444
      let deleted = await Promise.all([
        Meal.destroy({where: { creatorId: req.decoded.id }}),
        Like.destroy({where: { userId: req.decoded.id }}),
        SavedMeal.destroy({where: { userId: req.decoded.id }})
      ]);

      let deletedRelatedData = await Promise.all([
        Like.destroy({where: { mealId: null }}),
        SavedMeal.destroy({where: { mealId: null }})
      ]);

      let deleteduser = await User.destroy({where: { id: req.decoded.id }});

      if (deleteduser) {
        return res.status(200).json({ message: "User successfully deleted." });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: err.message || "There was an error deleting your profile." });
    }
  }
};