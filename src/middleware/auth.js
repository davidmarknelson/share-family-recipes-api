'use strict';
const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
  isAuthenticated: (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ message: 'No token provided!' });
    let token = req.headers.authorization.split(' ')[1];
    if (token) {
      jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) { 
          return res.status(403).json({ message: err.message }); 
        }
        if (decoded) {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(401).json({ message: 'No token provided!' });
    }
  }
};