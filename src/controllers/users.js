const User = require('../sequalize').user;

const users = {

  findEmail: (req, res) => {
    User.findOne({
      where: { email: req.query.email }
    })
    .then(user => {
      if (!user) res.status(500).json({ message: 'That email does not exist.' });
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  findUsername: (req, res) => {
    User.findOne({
      where: { username: req.query.username }
    })
    .then(user => {
      if (!user) {
        res.status(200).json({ message: 'That username is available.' });
      } else {
        res.status(500).json({ message: 'That username is already taken.' });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  create: (req, res) => {
    User.create(req.body)
    .then(user => res.status(200).json(user))
    .catch(err => {
      res.status(500).json({
        message: err.errors[0].message || err.message
      });
    });
  },

  update: (req, res) => {
    User.update({ 
      firstName: req.body.firstName, 
      lastName: req.body.lastName,
      email: req.body.email
    }, {
      where: { email: req.body.email }
    })
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "User successfully updated." });
      } else {
        res.status(500).json({ message: "There was an error updating your profile." });
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
  }
}

module.exports = users;