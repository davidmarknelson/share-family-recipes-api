'use strict';
const User = require('../models/sequelize').user;


module.exports = {
  getAllUsersDisplayInfo: async (req, res) => {
    try {
      let users = await User.findAll();
      res.status(200).json(users);
    } catch (err) {

    }
  }
}