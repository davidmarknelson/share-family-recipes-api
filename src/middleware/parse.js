'use strict';
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
  }
}