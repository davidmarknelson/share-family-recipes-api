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
    if (req.body.name) req.body.name = req.body.name.trim();

    // Ingredients are still a string at this point because they have not been parsed from form data yet
    if (req.body.ingredients) {
      req.body.ingredients = req.body.ingredients.toLowerCase();
    }

    if (req.body.originalRecipeUrl) {
      if (!req.body.originalRecipeUrl.startsWith('http://') && !req.body.originalRecipeUrl.startsWith('https://')) {
        req.body.originalRecipeUrl = `http://${req.body.originalRecipeUrl}`;
      }
    }

    if (req.body.youtubeUrl) {
      // Youtube urls are 28 characters long and start with 'https://youtu.be/'
      if (req.body.youtubeUrl.length !== 28 || !req.body.youtubeUrl.startsWith('https://youtu.be/')) {
        return res.status(400).json({ message: 'There was an error with your YouTube link.' });
      }
      // This replaces the url with an iframe friendly url
      if (req.body.youtubeUrl.startsWith('https://youtu.be/')) {
        req.body.youtubeUrl = req.body.youtubeUrl.replace('https://youtu.be/', 'https://www.youtube-nocookie.com/embed/');
      }
    }

    next();
  },
  parseOffsetAndLimit: (req, res, next) => {
    if (req.query.offset < 0 || !req.query.offset) req.query.offset = 0;
    if (req.query.limit <= 0 || !req.query.limit) req.query.limit = 10;
    next();
  },
  checkPasswordValidity: (req, res, next) => {
    if (req.body.password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }
    next();
  }
}