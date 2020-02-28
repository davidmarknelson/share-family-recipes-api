'use strict';
// Models and database function helpers
const sequelize = require('../models/sequelize').sequelize;
const SavedMeal = require('../models/sequelize').saved_meal;
const Meal = require('../models/sequelize').meal;
const User = require('../models/sequelize').user;
const Like = require('../models/sequelize').like;
const MealPic = require('../models/sequelize').meal_pic;
const ProfilePic = require('../models/sequelize').profile_pic;
// Cloudinary
const cloudinary = require('cloudinary').v2;

function deleteCloudinaryImage(public_id) {
  return new Promise(function (resolve, reject) {
    cloudinary.uploader.destroy(public_id, {
      invalidate: true
    }, function (error, result) {
      if (error) reject(error);
      resolve(result);
    });
  });
};

module.exports = {

  getMealById: async (req, res) => {
    try {
      let meal = await Meal.findOne({
        where: {
          id: req.query.id
        },
        include: [
          {
            model: User,
            as: "creator",
            attributes: ['username'],
            include: [
              { model: ProfilePic, as: 'profilePic', attributes: ['profilePicName'], duplicating: false }
            ]
          },
          { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false },
          { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false }
        ],
        order: [
          [Like, 'userId', 'ASC'],
          [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
        ]
      });

      if (!meal) return res.status(404).json({ message: 'That recipe does not exist.' });

      res.status(200).json(meal);
    } catch (err) {
      res.status(500).json({ message: 'There was an error getting the recipe.' });
    }
  },

  getMealByName: async (req, res) => {
    try {
      let mealName = req.query.name.replace('%20', ' ');

      // findAll is being used instead of findOne because findOne adds LIMIT 1 to the end of the query.
      // This might be because of using sequelize.where or using findOne.
      let meal = await Meal.findAll({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('name')),
          sequelize.fn('lower', mealName)
        ),
        include: [
          {
            model: User,
            as: "creator",
            attributes: ['username'],
            include: [
              { model: ProfilePic, as: 'profilePic', attributes: ['profilePicName'], duplicating: false }
            ]
          },
          { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false },
          { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false }
        ],
        order: [
          [Like, 'userId', 'ASC'],
          [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
        ]
      });

      if (meal.length === 0) return res.status(404).json({ message: 'That recipe does not exist.' });

      res.status(200).json(meal[0]);
    } catch (err) {
      res.status(500).json({ message: 'There was an error getting the recipe.' });
    }
  },

  findAvailableMealName: async (req, res) => {
    try {
      let mealName = req.query.name.replace('%20', ' ');

      let meal = await Meal.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('name')),
          sequelize.fn('lower', mealName)
        )
      });

      if (!meal) {
        res.status(204).json();
      } else {
        res.status(400).json();
      }
    } catch (err) {
      res.status(500).json({ message: 'There was an error finding available recipe names.' });
    }
  },

  create: async (req, res) => {
    try {
      req.body.creatorId = req.decoded.id;

      // save these properties to variables
      let tempMealPicName = req.body.recipePicName;
      let tempPublicId = req.body.publicId;

      // delete properties from req.body because the meal model
      // does not have them
      delete req.body.recipePicName;
      delete req.body.publicId;

      let meal = await Meal.create(req.body);

      if (tempMealPicName && tempPublicId) {
        let mealPic = await MealPic.create({
          mealId: meal.dataValues.id,
          mealPicName: tempMealPicName,
          publicId: tempPublicId
        });
      }

      res.status(201).json({
        id: meal.id,
        name: meal.name,
        message: "Recipe successfully created."
      });
    } catch (err) {

      if (err.errors) {
        if (err.errors[0].message === 'name must be unique') {
          return res.status(400).json({ message: 'This recipe name is already taken.' });
        }
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: 'There was an error creating your recipe.' });
    }
  },

  update: async (req, res) => {
    try {
      let mealOwner = await Meal.findOne({
        where: {
          id: req.body.id,
          creatorId: req.decoded.id
        }
      });

      if (!mealOwner) throw Error('You do not have permission to edit this recipe.');

      let tempMealId = req.body.id;

      delete req.body.id;

      // save these properties to variables
      let tempMealPicName = req.body.recipePicName;
      let tempPublicId = req.body.publicId;

      // delete properties from req.body because the meal model
      // does not have them
      delete req.body.recipePicName;
      delete req.body.publicId;

      let meal = await Meal.update(req.body, {
        where: {
          id: tempMealId
        }
      });

      let mealPic;
      if (tempMealPicName && tempPublicId) {
        let previousMealPic = await MealPic.findOne({
          where: { mealId: tempMealId }
        });

        // This deletes the old meal pic from cloudinary
        // result returns { result: 'ok' } on success
        if (previousMealPic) {
          let cloudImg = await deleteCloudinaryImage(tempPublicId);
        }

        // If .upsert creates a new object, it returns true. If it updates
        // an old object, it returns false. Passing {returning: true} returns the 
        // updated object and make profilePic a truthy variable.
        mealPic = await MealPic.upsert({
          mealId: tempMealId,
          mealPicName: tempMealPicName,
          publicId: tempPublicId
        }, { returning: true });
      }

      // If the user only updates the mealPic, then the user object will return 0 because nothing
      // has updated. This if statement will allow a truthy result if the user only updated the mealPic
      // or the meal object.
      if (meal[0] === 1 || mealPic) {
        return res.status(201).json({
          id: tempMealId,
          message: 'Recipe successfully updated.'
        });
      } else {
        throw Error();
      }
    } catch (err) {
      if (err.message === 'You do not have permission to edit this recipe.') {
        return res.status(403).json({ message: err.message });
      }
      if (err.message === 'There was an error updating your recipe image.') {
        return res.status(500).json({ message: err.message });
      }

      if (err.errors) {
        if (err.errors[0].message === 'name must be unique') {
          return res.status(400).json({ message: 'This recipe name is already taken.' });
        }
      }
      res.status(500).json({ message: 'There was an error updating your recipe.' });
    }
  },

  delete: async (req, res) => {
    try {
      let meal = await Meal.findOne({
        where: {
          id: req.body.id,
          creatorId: req.decoded.id
        }
      });

      if (!meal) return res.status(403).json({ message: 'You do not have permission to delete this recipe.' });

      let mealPicToDelete = await MealPic.findOne({
        where: { mealId: req.body.id }
      });

      if (mealPicToDelete) {
        let cloudImg = await deleteCloudinaryImage(mealPicToDelete.publicId);
      }

      if (meal) {
        let deletedRelatedData = await Promise.all([
          SavedMeal.destroy({ where: { mealId: meal.dataValues.id } }),
          Like.destroy({ where: { mealId: meal.dataValues.id } }),
          MealPic.destroy({ where: { mealId: req.body.id } })
        ]);
      }

      let deleted = await Meal.destroy({
        where: {
          id: req.body.id,
          creatorId: req.decoded.id
        }
      });

      if (deleted) {
        return res.status(200).json({ message: 'Recipe successfully deleted.' });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: 'There was an error deleting your recipe.' });
    }
  },
}