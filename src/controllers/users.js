'use strict';
// Models and operators
const SavedMeal = require('../models/sequelize').saved_meal;
const Like = require('../models/sequelize').like;
const User = require('../models/sequelize').user;
const Meal = require('../models/sequelize').meal;
const ProfilePic = require('../models/sequelize').profile_pic;
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

  renewJwt: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { id: req.decoded.id }
      });

      let userToken = {
        id: user.dataValues.id,
        isAdmin: user.dataValues.isAdmin,
        username: user.dataValues.username
      };

      res.status(200).json({
        jwt: jwtSignUser(userToken)
      });
    } catch (err) {
      res.status(500).json({message: 'There was an error getting your authentication token.'});
    }
  },

  profile: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { 
          id: req.decoded.id
        },
        include: [
          { model: ProfilePic, as: 'profilePic', attributes: ['profilePicName'], duplicating: false }
        ]
      });

      delete user.dataValues.password;

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({message: 'There was an error getting your profile.'});
    }
  },

  signup: async (req, res) => {
    try {
      
      if (req.body.password !== req.body.passwordConfirmation) {
        throw new Error('Passwords do not match.')
      }
      
      if (req.body.adminCode === config.ADMIN_CODE) {
        req.body.isAdmin = true;
      } else {
        req.body.isAdmin = false;
      }
      
      delete req.body.passwordConfirmation;
      
      let user = await User.create(req.body);
      
      if (req.file) {
        let profilePic = await ProfilePic.create({
          userId: user.dataValues.id,
          profilePicName: req.file.filename
        });
      }
      
      let userToken = {
        id: user.dataValues.id,
        isAdmin: user.dataValues.isAdmin,
        username: user.dataValues.username,
      };
      
      res.status(201).json({
        jwt: jwtSignUser(userToken)
      });
    } catch (err) {
      // This deletes any profile picture a user uploaded during an attempt that had
      // an error. This is deleted so if they change their username on any following 
      // attempts, there won't be an unused picture.
      if (req.file) {
        // Checks if the profile picture exists
        fs.stat(`public/images/profilePics/${req.file.filename}`, (err, stats) => {
          if (stats) {
            // Deletes profile picture
            fs.unlink(`public/images/profilePics/${req.file.filename}`, (err) => {
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

      if (err.message === 'Passwords do not match.') {
        return res.status(400).json({ message: "Passwords do not match." });
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

      let userToken = {
        id: user.dataValues.id,
        isAdmin: user.dataValues.isAdmin,
        username: user.dataValues.username
      };

      res.status(200).json({
        jwt: jwtSignUser(userToken)
      });
    } catch (err) {
      res.status(500).json({ message: 'There was an error logging in.' });
    }
  },

  update: async (req, res) => {
    try {
      if (req.body.password) delete req.body.password;

      if (req.body.email) req.body.isVerified = false;

      let user = await User.update(req.body, {
        where: { id: req.decoded.id }
      });

      let profilePic;

      // This deletes the old profile pic and creates the new one
      if (req.file) {
        let deletePic = await ProfilePic.findOne({
          where: { userId: req.decoded.id }
        });

        if (deletePic) {
          // Checks if the profile picture exists
          fs.stat(`public/images/profilePics/${deletePic.dataValues.profilePicName}`, (err, stats) => {
            if (stats) {
              // Deletes profile picture
              fs.unlink(`public/images/profilePics/${deletePic.dataValues.profilePicName}`, (err) => {
                if (err) return res.status(500).json({ message: 'There was an error.' });
              });
            }
          });
        }

        let deleted = ProfilePic.destroy({where: { userId: req.decoded.id }});

        profilePic = await ProfilePic.create({
          userId: req.decoded.id,
          profilePicName: req.file.filename
        });
      }

      if (user[0] === 1 || profilePic) {
        return res.status(201).json({ message: "Profile successfully updated." });
      } else if (user[0] === 0) {
        throw Error();
      }
    } catch (err) {
      if (req.file) {
        // Checks if the profile picture exists
        fs.stat(`public/images/profilePics/${req.file.filename}`, (err, stats) => {
          if (stats) {
            // Deletes profile picture
            fs.unlink(`public/images/profilePics/${req.file.filename}`, (err) => {
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
      res.status(500).json({ message: err.message || "There was an error updating your profile." });
    }
  },

  delete: async (req, res) => {
    try {
      let user = await User.findOne({ 
        where: { id: req.decoded.id }
      });

      let deletePic = await ProfilePic.findOne({
        where: { userId: req.decoded.id }
      });

      if (deletePic) {
        // Checks if the profile picture exists
        fs.stat(`public/images/profilePics/${deletePic.dataValues.profilePicName}`, (err, stats) => {
          if (stats) {
            // Deletes profile picture
            fs.unlink(`public/images/profilePics/${deletePic.dataValues.profilePicName}`, (err) => {
              if (err) return res.status(500).json({ message: 'There was an error.' });
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
        return res.status(200).json({ message: "Profile successfully deleted." });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: err.message || "There was an error deleting your profile." });
    }
  }
};