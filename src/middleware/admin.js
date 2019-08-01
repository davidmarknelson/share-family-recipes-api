'use strict';
module.exports = {
  isAdmin: (req, res, next) => {
    if (req.decoded.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "You do not have permission to access this service." });
    }
  }
}