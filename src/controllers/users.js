'use strict';
// Models
const Verification = require('../models/sequelize').verification_token;
const SavedMeals = require('../models/sequelize').saved_meal;
const Likes = require('../models/sequelize').like;
const User = require('../models/sequelize').user;
const Meal = require('../models/sequelize').meal;
// Sequelize operators
const Op = require('sequelize').Op;
// JWT
const cryptoRandomString = require('crypto-random-string');
const jwt = require('jsonwebtoken');
// Email
const helpers = require('../helpers/email');
const nodemailer = require('nodemailer');
// File system
const fs = require('fs');

function jwtSignUser(user) {
  const oneWeek = 60 * 60 * 24 * 7;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: oneWeek
  });
}

module.exports = {

  findUsername: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { 
          username: {
            [Op.iLike]: req.query.username 
          }
        }
      });

      if (!user) {
        return res.status(200).json({ message: 'This username is available.' });
      } else {
        return res.status(400).json({ message: 'This username is already in use.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  profile: async (req, res) => {
    try {
      let user = await User.findOne({
        where: {
          email: req.decoded.email,
          username: req.decoded.username
        },
        include: [
          'meals', 
          { model: SavedMeals, as: 'savedMeals', attributes: ['mealId'] }
        ]
      });

      res.status(200).json({
        user: user,
        jwt: jwtSignUser(user.dataValues)
      });
    } catch (err) {
      res.status(500).json({message: 'There was an error getting your profile.'});
    }
  },

  signup: async (req, res) => {
    try {
      if (req.body.adminCode === process.env.ADMIN_CODE) {
        req.body.isAdmin = true;
      } else {
        req.body.isAdmin = false;
      }

      if (req.file) {
        req.body.profilePic = req.file.path;
      }

      let user = await User.create(req.body);
      let token = cryptoRandomString({length: 10, type: 'url-safe'});
      let tokenObj = await Verification.create({
        token: token,
        userId: user.id
      });

      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PW
        }
      });
        
      let message = helpers.makeVerificationEmail(
        process.env.URL, 
        req.body.firstName, 
        req.body.lastName, 
        tokenObj.token
      );

      const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `${req.body.email}`,
        subject: 'Verify email',
        html: message
      };

      user.dataValues.emailAccepted = false;

      let email = await transporter.sendMail(mailOptions);
      if (email.accepted[0] === `${req.body.email}`) {
        user.dataValues.emailAccepted = true;
      }

      // This is used to get the token string and preview url for tests
      if (process.env.NODE_ENV === "developement" || "test") {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(email));
        user.dataValues.token = tokenObj.token
      }

      res.status(200).json({
        user: user,
        jwt: jwtSignUser(user.dataValues)
      });
    } catch (err) {
      if (err.errors) {
        if (err.errors[0].message === 'email must be unique') {
          return res.status(400).json({ message: 'This email account is already in use.' });
        }
        if (err.errors[0].message === 'username must be unique') {
          return res.status(400).json({ message: 'This username is already in use.' });
        }
      }
      res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { email: req.body.email },
        include: [
          'meals', 
          { model: SavedMeals, as: 'savedMeals', attributes: ['mealId'] }
        ]
      });

      if (!user) {
        return res.status(403).json({ message: 'The login information was incorrect.'});
      }

      let passwordsMatch = await User.comparePasswords(req.body.password, user.password);

      if (!passwordsMatch) {
        return res.status(403).json({ message: 'The login information was incorrect.'});
      }

      res.status(200).json({
        user: user,
        jwt: jwtSignUser(user.dataValues)
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      let user = await User.update(req.body, {
        where: { id: req.decoded.id }
      });

      if (user[0] === 1) {
        return res.status(200).json({ message: "User successfully updated." });
      } else if (user[0] === 0) {
        return res.status(500).json({ message: "There was an error updating your profile." });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message || "There was an error updating your profile."
      });
    }
  },

  delete: async (req, res) => {
    try {
      if (req.decoded.profilePic) {
        fs.stat(req.decoded.profilePic, (err, stats) => {
          if (stats) {
            fs.unlink(req.decoded.profilePic, (err) => {
              if (err) res.status(500).json({ message: 'There was an error deleting your profile picture.' });
            });
          }
        });
      }
     
      let deleted = await Promise.all([
        Meal.destroy({where: { creatorId: req.decoded.id }}),
        Likes.destroy({where: { userId: req.decoded.id }}),
        SavedMeals.destroy({where: { userId: req.decoded.id }})
      ]);
      // User is deleted separately from the others because the userId fields in meal, likes, and saved meal
      // tables will be set to null and then it will be difficult to delete. Sequelize has an open issue around 
      // this. There is a workaround, but I'd rather not deal with it for now. The issue can be found 
      // here https://github.com/sequelize/sequelize/issues/8444

      let user = await User.destroy({where: { id: req.decoded.id }});

      if (user) {
        return res.status(200).json({ message: "User successfully deleted." });
      } else {
        return res.status(500).json({ message: "There was an error deleting your profile." });
      }
    } catch (err) {
      res.status(500).json({ message: err.message || "There was an error deleting your profile." });
    }
  }
};