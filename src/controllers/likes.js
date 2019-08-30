'use strict';
const Likes = require('../models/sequelize').like;

module.exports = {
  addLike: async (req, res) => {
    try {
      let previousLike = await Likes.findOne({
        where: {
          mealId: req.body.mealId,
          userId: req.decoded.id
        }
      });

      if (previousLike) return res.status(400).json({ message: 'You have already liked this meal.' });

      let likes = await Likes.create({
        mealId: req.body.mealId,
        userId: req.decoded.id
      });

      if (!likes) throw Error();

      res.status(201).json({ message: 'Meal successfully liked.' });
    } catch (err) {
      res.status(500).json({ message: 'There was an error liking the meal.' });
    }
  },

  removeLike: async (req, res) => {
    try {
      let likes = await Likes.destroy({
        where: {
          mealId: req.body.mealId,
          userId: req.decoded.id
        }
      });

      if (likes) {
        res.status(200).json({ message: "Meal successfully unliked." });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: "There was an error unliking the meal." });      
    }
  }
};