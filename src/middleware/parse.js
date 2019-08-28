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
  },
  parseOffsetAndLimit: (req, res, next) => {
    if (req.query.offset < 0 || !req.query.offset) {
      req.query.offset = 0;
    }
    if (req.query.limit <= 0 || !req.query.limit) {
      req.query.limit = 5;
    }
    next();
  }
}