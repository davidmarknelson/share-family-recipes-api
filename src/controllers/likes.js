'use strict';
// Model
const Like = require('../models/sequelize').like;
const Meal = require('../models/sequelize').meal;

module.exports = {
  addLike: async (req, res) => {
    try {
      let previousLike = await Like.findOne({
        where: {
          mealId: req.body.recipeId,
          userId: req.decoded.id
        }
      });

      if (previousLike) return res.status(400).json({ message: 'You have already liked this recipe.' });

      let like = await Like.create({
        mealId: req.body.recipeId,
        userId: req.decoded.id
      });

      if (!like) throw Error();

      let likes = await Like.findAll({
        where: {
          mealId: req.body.recipeId
        },
        attributes: ['userId'],
        order: [
          ['userId', 'ASC']
        ]
      });

      res.status(200).json(likes);
    } catch (err) {
      res.status(500).json({ message: 'There was an error liking this recipe.' });
    }
  },

  removeLike: async (req, res) => {
    try {
      let like = await Like.destroy({
        where: {
          mealId: req.body.recipeId,
          userId: req.decoded.id
        }
      });

      if (like) {
        res.status(204).json();
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: "There was an error unliking this recipe." });      
    }
  }
};