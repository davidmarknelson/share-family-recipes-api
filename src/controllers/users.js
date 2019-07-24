const User = require('../models/sequelize').user;
const jwt = require('jsonwebtoken');

function jwtSignUser(user) {
  const oneWeek = 60 * 60 * 24 * 7;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: oneWeek
  });
}

const users = {

  findUsername: (req, res) => {
    User.findOne({
      where: { username: req.query.username }
    })
    .then(user => {
      if (!user) {
        res.status(200).json({ message: 'This username is available.' });
      } else {
        res.status(400).json({ message: 'This username is already in use.' });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  signup: (req, res) => {
    User.create(req.body)
    .then(user => 
      res.status(200).json({
        user: user,
        jwt: jwtSignUser(user.dataValues)
      })
    )
    .catch(err => {
      if (err.errors[0].message === 'email must be unique') {
        return res.status(400).json({ message: 'This email account is already in use.' });
      }
      res.status(500).json({
        message: err.errors[0].message || err.message
      });
    });
  },

  login: (req, res) => {
    User.findOne({
      where: { email: req.body.email }
    })
    .then(user => {
      if (!user) {
        throw new Error('The login information was incorrect.');

      }
      return user;
    })
    .then(user => {
      return User.comparePasswords(req.body.password, user.password)
        .then(result => {
          if (!result) {
            throw new Error('The login information was incorrect.');
          } else {
            return user;
          }
        });
    })
    .then(user => 
      res.status(200).json({
        user: user,
        jwt: jwtSignUser(user.dataValues)
      })
    )
    .catch(err => {
      if (err.message === 'The login information was incorrect.') {
        return res.status(403).json({ message: err.message });
      }
      res.status(500).json({ message: err.message });
    });
  },

  update: (req, res) => {
    User.update(req.body, {
      where: { email: req.body.email }
    })
    .then((result) => {
      if (result[0] === 1) {
        res.status(200).json({ message: "User successfully updated." });
      } else {
        throw new Error("There was an error updating your profile." );
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.errors[0].message || err.message
      });
    });
  },

  delete: (req, res) => {
    User.destroy({
      where: { email: req.body.email }
    })
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "User successfully deleted." });
      } else {
        res.status(500).json({ message: "There was an error deleting your profile." });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },
}

module.exports = users;