'use strict';
const fs = require('fs');

module.exports = {
  trimBodyEmail: (req, res, next) => {
    if (req.body.email) {
      req.body.email = req.body.email.trim().toLowerCase();
    }
    next();
  },
  parseMealFields: (req, res, next) => {
    if (req.body.name) {
      req.body.name = req.body.name.trim();
    }
    req.body.ingredients = JSON.parse(req.body.ingredients.toLowerCase());
    req.body.instructions = JSON.parse(req.body.instructions);
    next();
  },
  parseOffsetAndLimit: (req, res, next) => {
    if (req.query.offset < 0 || !req.query.offset) {
      req.query.offset = 0;
    }
    if (req.query.limit <= 0 || !req.query.limit) {
      req.query.limit = 5;
    }
    next();
  },
  checkPasswordValidity: (req, res, next) => {
    if (req.body.password.length < 8) {
      fs.stat(`public/images/profilePics/${req.body.username}.jpeg`, (err, stats) => {
        if (stats) {
          fs.unlink(`public/images/profilePics/${req.body.username}.jpeg`, (err) => {
            if (err) return res.status(500).json({ message: 'There was an error deleting your profile picture.' });
          });
        }
      });
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }
    next();
  }
}