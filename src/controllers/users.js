'use strict';
// Models and operators
const SavedMeal = require('../models/sequelize').saved_meal;
const Like = require('../models/sequelize').like;
const User = require('../models/sequelize').user;
const Meal = require('../models/sequelize').meal;
const ProfilePic = require('../models/sequelize').profile_pic;
const MealPic = require('../models/sequelize').meal_pic;
const Op = require('sequelize').Op;
// JWT and file system
const jwt = require('jsonwebtoken');
// Config
const config = require('../../config');
// Cloudinary
const cloudinary = require('cloudinary').v2;

function jwtSignUser(user) {
  return jwt.sign(user, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRATION_TIME
  });
}

function deleteCloudinaryImage(public_id) {
  return new Promise(function (resolve, reject) {
    cloudinary.uploader.destroy(public_id, {
      invalidate: true
    }, function(error,result) {
      if (error) reject(error);
      resolve(result);
    });
  });
};

function deleteMultipleCloudinaryImage(publicIds) {
  return new Promise(function (resolve, reject) {
    cloudinary.api.delete_resources(
      publicIds, {invalidate: true},
      function(error, result) {
        if (error) reject(error);
        resolve(result);
      }
    );
  });
};

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
        where: { id: req.decoded.id },
        include: [
          { model: SavedMeal, as: 'savedMeals', attributes: ['mealId'], duplicating: false  }
        ]
      });

      let userToken = {
        id: user.dataValues.id,
        isAdmin: user.dataValues.isAdmin,
        username: user.dataValues.username,
        savedRecipes: user.dataValues.savedMeals
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
          { model: ProfilePic, as: 'profilePic', attributes: ['profilePicName'], duplicating: false },
          { model: SavedMeal, as: 'savedMeals', attributes: ['mealId'], duplicating: false  }
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
      
      // passwordConfirmation is not part of the sql model
      delete req.body.passwordConfirmation;

      // save these properties to variables
      let tempProfilePicName = req.body.profilePicName;
      let tempPublicId = req.body.publicId;

      // delete properties from req.body because the user model
      // does not have them
      delete req.body.profilePicName;
      delete req.body.publicId;
      
      let user = await User.create(req.body);

      if (tempProfilePicName && tempPublicId) {
        let profilePic = await ProfilePic.create({
          userId: user.dataValues.id,
          profilePicName: tempProfilePicName,
          publicId: tempPublicId
        });
      }
      
      let userToken = {
        id: user.dataValues.id,
        isAdmin: user.dataValues.isAdmin,
        username: user.dataValues.username,
        savedRecipes: []
      };
      
      res.status(201).json({
        jwt: jwtSignUser(userToken)
      });
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
        if (err.errors[0].message === 'Username must not contain a space.') {
          return res.status(400).json({ message: 'Username must not contain a space.' });
        }
      }

      if (err.message === 'Passwords do not match.') {
        err.status = 400;
      }

      res.status(err.status || 500).json({ message: err.message || 'There was an error signing up. Please try again.' });
    }
  },

  login: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { email: req.body.email },
        include: [
          { model: SavedMeal, as: 'savedMeals', attributes: ['mealId'], duplicating: false  }
        ]
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
        username: user.dataValues.username,
        savedRecipes: user.dataValues.savedMeals
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
      // Keep password from updating. Updating the password
      // is in a different route.
      if (req.body.password) delete req.body.password;

      // Change isVerified to false if the user is updating their email.
      if (req.body.email) req.body.isVerified = false;

      // save these properties to variables
      let tempProfilePicName = req.body.profilePicName;
      let tempPublicId = req.body.publicId;

      // delete properties from req.body because the user model
      // does not have them
      delete req.body.profilePicName;
      delete req.body.publicId;

      let user = await User.update(req.body, {
        where: { id: req.decoded.id }
      });

      let profilePic;
      // This deletes the old profile pic and creates the new one
      if (tempProfilePicName && tempPublicId) {
        let deletePic = await ProfilePic.findOne({
          where: { userId: req.decoded.id }
        });

        if (deletePic) {
          // This deletes the old profile pic from cloudinary
          // result returns { result: 'ok' } on success
          let deleteCloudImg = await deleteCloudinaryImage(deletePic.publicId);
        }

        // If .upsert creates a new object, it returns true. If it updates
        // an old object, it returns false. Passing {returning: true} returns the 
        // updated object and make profilePic a truthy variable.
        profilePic = await ProfilePic.upsert({
          userId: req.decoded.id,
          profilePicName: tempProfilePicName,
          publicId: tempPublicId
        }, { returning: true });
      }

      // If the user only updates the profilePic, then the user object will return 0 because nothing
      // has updated. This if statement will allow a truthy result if the user only updated the profilePic
      // or the user object.
      if (user[0] === 1 || profilePic) {
        return res.status(201).json({ message: "Profile successfully updated." });
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

      let deleteProfilePic = await ProfilePic.findOne({
        where: { userId: req.decoded.id }
      });

      if (deleteProfilePic) {
        // This deletes the old profile pic from cloudinary
        // result returns { result: 'ok' } on success
        let deleteCloudImg = await deleteCloudinaryImage(deleteProfilePic.publicId);
      }

      // Get all meals created by user
      let meals = await Meal.findAll({
        where: {
          creatorId: req.decoded.id
        }
      });

      if (meals.length > 0) {
        // Put mealIds in array
        let mealIds = meals.reduce((pictures, meal) => {
          pictures.push({id: meal.dataValues.id});
          return pictures;
        }, []);

        // find meals that have pictures
        let mealPics = await MealPic.findAll({
          where: { [Op.or]: mealIds },
          attributes: ['publicId']
        });

        // put public_ids into an array
        let publicIds = mealPics.reduce((public_ids, pics) => {
          public_ids.push(pics.dataValues.publicId);
          return public_ids;
        }, []);

        // delete pictures from cloudinary
        let cloudMealPics = await deleteMultipleCloudinaryImage(publicIds);
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