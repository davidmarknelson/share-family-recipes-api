'use strict';
// Models, operators, and database function helpers
const sequelize = require('../models/sequelize').sequelize;
const Meal = require('../models/sequelize').meal;
const User = require('../models/sequelize').user;
const Like = require('../models/sequelize').like;
const SavedMeal = require('../models/sequelize').saved_meal;
const ProfilePic = require('../models/sequelize').profile_pic;
const MealPic = require('../models/sequelize').meal_pic;
const Op = require('sequelize').Op;

const attributesArray = [
  'id', 'difficulty', 'name', 'cookTime', 'creatorId', 'description', 'createdAt', 'updatedAt'
];

const errorMessage = 'There was an error getting the list of meals.';

module.exports = {
  getByNewest: async (req, res) => {
    try {
      let meals = await Meal.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        distinct: true,
        order: [
          ['createdAt', 'DESC'],
          [Like, 'userId', 'ASC'],
          [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
        ],
        include: [
          { model: User, as: "creator", attributes: ['username'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false },
          { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false },
          { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
        ]
      });

      if (meals.rows.length === 0) return res.status(404).json({ message: 'There are no recipes.' });

      res.status(200).json(meals);

    } catch (err) {
      console.log('newest err', err)
      res.status(500).json({ message: errorMessage});
    }
  },

  getByOldest: async (req, res) => {
    try {
      let meals = await Meal.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        attributes: attributesArray,
        distinct: true,
        order: [
          'createdAt',
          [Like, 'userId', 'ASC'],
          [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
        ],
        include: [
          { model: User, as: "creator", attributes: ['username'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false },
          { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false },
          { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
        ]
      });

      if (meals.rows.length === 0) return res.status(404).json({ message: 'There are no recipes.' });

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getMealsAtoZ: async (req, res) => {
    try {
      let meals = await Meal.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        distinct: true,
        attributes: attributesArray,
        order: [
          sequelize.fn('lower', sequelize.col('name')),
          [Like, 'userId', 'ASC'],
          [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
        ],
        include: [
          { model: User, as: "creator", attributes: ['username'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false },
          { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false },
          { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
        ]
      });

      if (meals.rows.length === 0) return res.status(404).json({ message: 'There are no recipes.' });

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getMealsZtoA: async (req, res) => {
    try {
      let meals = await Meal.findAndCountAll({
        offset: req.query.offset,
        limit: req.query.limit,
        distinct: true,
        attributes: attributesArray,
        order: [
          [sequelize.fn('lower', sequelize.col('name')), 'DESC'],
          [Like, 'userId', 'ASC'],
          [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
        ],
        include: [
          { model: User, as: "creator", attributes: ['username'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false },
          { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false },
          { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
        ]
      });

      if (meals.rows.length === 0) return res.status(404).json({ message: 'There are no recipes.' });

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getMealsByIngredientsAtoZ: async (req, res) => {
    try {
      if (!req.query.ingredient) return res.status(400).json({ message: 'You must add ingredients to the search.' });

      let temp;
      if (!Array.isArray(req.query.ingredient)) {
        temp = [req.query.ingredient];
      } else {
        temp = req.query.ingredient;
      }
      let ingredients = temp.map(val => `\'%${val.toLowerCase()}%\'`);

      let meals = await Meal.findAll({
        offset: req.query.offset,
        limit: req.query.limit,
        where: sequelize.literal(`array_to_string(ingredients, \',\') LIKE ALL(ARRAY[${ingredients}])`),
        order: [
          sequelize.fn('lower', sequelize.col('name')),
          [Like, 'userId', 'ASC'],
          [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
        ],
        attributes: attributesArray,
        include: [
          { model: User, as: "creator", attributes: ['username'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false },
          { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false },
          { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
        ]
      });

      if (meals.length === 0) return res.status(404).json({ message: 'There are no recipes with those ingredients.' });

      res.status(200).json({
        count: meals.length,
        rows: meals
      });
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getMealsByIngredientsZtoA: async (req, res) => {
    try {
      if (!req.query.ingredient) return res.status(400).json({ message: 'You must add ingredients to the search.' });

      let temp;
      if (!Array.isArray(req.query.ingredient)) {
        temp = [req.query.ingredient];
      } else {
        temp = req.query.ingredient;
      }
      let ingredients = temp.map(val => `\'%${val.toLowerCase()}%\'`);

      let meals = await Meal.findAll({
        offset: req.query.offset,
        limit: req.query.limit,
        where: sequelize.literal(`array_to_string(ingredients, \',\') LIKE ALL(ARRAY[${ingredients}])`),
        order: [
          [sequelize.fn('lower', sequelize.col('name')), 'DESC'],
          [Like, 'userId', 'ASC'],
          [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
        ],
        attributes: attributesArray,
        include: [
          { model: User, as: "creator", attributes: ['username'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false },
          { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false },
          { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
        ]
      });

      if (meals.length === 0) return res.status(404).json({ message: 'There are no recipes with those ingredients.' });

      res.status(200).json({
        count: meals.length,
        rows: meals
      });
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getMealsByIngredientsNewest: async (req, res) => {
    try {
      if (!req.query.ingredient) return res.status(400).json({ message: 'You must add ingredients to the search.' });

      let temp;
      if (!Array.isArray(req.query.ingredient)) {
        temp = [req.query.ingredient];
      } else {
        temp = req.query.ingredient;
      }
      let ingredients = temp.map(val => `\'%${val.toLowerCase()}%\'`);

      let meals = await Meal.findAll({
        offset: req.query.offset,
        limit: req.query.limit,
        where: sequelize.literal(`array_to_string(ingredients, \',\') LIKE ALL(ARRAY[${ingredients}])`),
        order: [
          ['createdAt', 'DESC'],
          [Like, 'userId', 'ASC'],
          [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
        ],
        attributes: attributesArray,
        include: [
          { model: User, as: "creator", attributes: ['username'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false },
          { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false },
          { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
        ]
      });

      if (meals.length === 0) return res.status(404).json({ message: 'There are no recipes with those ingredients.' });

      res.status(200).json({
        count: meals.length,
        rows: meals
      });
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getMealsByIngredientsOldest: async (req, res) => {
    try {
      if (!req.query.ingredient) return res.status(400).json({ message: 'You must add ingredients to the search.' });

      let temp;
      if (!Array.isArray(req.query.ingredient)) {
        temp = [req.query.ingredient];
      } else {
        temp = req.query.ingredient;
      }
      let ingredients = temp.map(val => `\'%${val.toLowerCase()}%\'`);

      let meals = await Meal.findAll({
        offset: req.query.offset,
        limit: req.query.limit,
        where: sequelize.literal(`array_to_string(ingredients, \',\') LIKE ALL(ARRAY[${ingredients}])`),
        order: [
          'createdAt',
          [Like, 'userId', 'ASC'],
          [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
        ],
        attributes: attributesArray,
        include: [
          { model: User, as: "creator", attributes: ['username'], duplicating: false },
          { model: Like, attributes: ['userId'], duplicating: false },
          { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false },
          { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
        ]
      });

      if (meals.length === 0) return res.status(404).json({ message: 'There are no recipes with those ingredients.' });

      res.status(200).json({
        count: meals.length,
        rows: meals
      });
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getMealsCreatedByUserAtoZ: async (req, res) => {
    try {
      let user = await User.findOne({
        where: {
          username: req.query.username
        },
        attributes: ['username'],
        include: [
          {
            model: Meal, as: 'meals',
            attributes: attributesArray,
            offset: req.query.offset,
            limit: req.query.limit,
            order: [
              [sequelize.fn('lower', sequelize.col('name'))],
              [Like, 'userId', 'ASC'],
              [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
            ],
            include: [
              { model: User, as: "creator", attributes: ['username'], duplicating: false },
              { model: Like, attributes: ['userId'], duplicating: false },
              { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false },
              { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
            ]
          },
          { model: ProfilePic, as: 'profilePic', attributes: ['profilePicName'], duplicating: false }
        ]
      });

      if (!user) return res.status(404).json({ message: 'This user does not exist.' });

      let userMeals = {
        id: user.id,
        username: user.username,
        profilePic: user.profilePic,
        count: user.meals.length,
        rows: user.meals
      }

      res.status(200).json(userMeals);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  getMealsCreatedByUserZtoA: async (req, res) => {
    try {
      let user = await User.findOne({
        where: {
          username: req.query.username
        },
        attributes: ['username'],
        include: [
          {
            model: Meal, as: 'meals',
            attributes: attributesArray,
            offset: req.query.offset,
            limit: req.query.limit,
            order: [
              [sequelize.fn('lower', sequelize.col('name')), 'DESC'],
              [Like, 'userId', 'ASC'],
              [{ model: SavedMeal, as: 'savedRecipes' }, 'userId', 'ASC']
            ],
            include: [
              { model: User, as: "creator", attributes: ['username'], duplicating: false },
              { model: Like, attributes: ['userId'], duplicating: false },
              { model: SavedMeal, as: 'savedRecipes', attributes: ['userId'], duplicating: false },
              { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false }
            ]
          },
          { model: ProfilePic, as: 'profilePic', attributes: ['profilePicName'], duplicating: false }
        ]
      });

      if (!user) return res.status(404).json({ message: 'This user does not exist.' });

      let userMeals = {
        id: user.id,
        username: user.username,
        profilePic: user.profilePic,
        count: user.meals.length,
        rows: user.meals
      }
      res.status(200).json(userMeals);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  },

  searchByName: async (req, res) => {
    try {
      let meals = await Meal.findAll({
        where: {
          name: {
            [Op.iLike]: `%${req.query.name}%`
          }
        },
        limit: req.query.limit,
        order: [sequelize.fn('lower', sequelize.col('name'))],
        attributes: ['id', 'name']
      });

      if (meals.length === 0) return res.status(404).json();

      res.status(200).json(meals);
    } catch (err) {
      res.status(500).json({ message: errorMessage });
    }
  }
}