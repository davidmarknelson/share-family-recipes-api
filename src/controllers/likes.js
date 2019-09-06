'use strict';
// Model
const Like = require('../models/sequelize').like;

module.exports = {
  addLike: async (req, res) => {
    try {
      let previousLike = await Like.findOne({
        where: {
          mealId: req.body.mealId,
          userId: req.decoded.id
        }
      });

      if (previousLike) return res.status(400).json({ message: 'You have already liked this meal.' });

      let like = await Like.create({
        mealId: req.body.mealId,
        userId: req.decoded.id
      });

      if (!like) throw Error();

      res.status(201).json({ message: 'Meal successfully liked.' });
    } catch (err) {
      res.status(500).json({ message: 'There was an error liking this meal.' });
    }
  },

  removeLike: async (req, res) => {
    try {
      let like = await Like.destroy({
        where: {
          mealId: req.body.mealId,
          userId: req.decoded.id
        }
      });

      if (like) {
        res.status(200).json({ message: "Meal successfully unliked." });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: "There was an error unliking this meal." });      
    }
  }
};