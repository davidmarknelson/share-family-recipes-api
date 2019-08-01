'use strict';
const jwt = require('jsonwebtoken');

module.exports = {
  isAuthenticated: (req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { 
          return res.status(403).json({ message: err.message }); 
        }
        if (decoded) {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).json({ message: 'No token provided!' });
    }
  }
};