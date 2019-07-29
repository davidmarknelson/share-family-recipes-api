const User = require('../models/sequelize').user;
const jwt = require('jsonwebtoken');
const Verification = require('../models/sequelize').verification_token;
const cryptoRandomString = require('crypto-random-string');
const helpers = require('../helpers/email');
const nodemailer = require('nodemailer');

function jwtSignUser(user) {
  const oneWeek = 60 * 60 * 24 * 7;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: oneWeek
  });
}

const users = {

  findUsername: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { username: req.query.username }
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
        }
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
        req.body.email, 
        req.body.firstName, 
        req.body.lastName, 
        tokenObj.token
      )

      const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `${req.body.email}`,
        subject: 'Verify email',
        html: message
      };

      let email = await transporter.sendMail(mailOptions);

      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(email));

      res.status(200).json({
        user: user,
        jwt: jwtSignUser(user.dataValues)
      });
    } catch (err) {
      if (err.errors[0].message === 'email must be unique') {
        return res.status(400).json({ message: 'This email account is already in use.' });
      }
      if (err.errors[0].message === 'username must be unique') {
        return res.status(400).json({ message: 'This username is already in use.' });
      }
      res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { email: req.body.email }
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
        where: { email: req.body.email }
      });
      console.log(user)

      if (user[0] === 1) {
        return res.status(200).json({ message: "User successfully updated." });
      } else if (user[0] === 0) {
        return res.status(500).json({ message: "There was an error updating your profile." });
      }
    } catch (err) {
      res.status(500).json({
        message: "There was an error updating your profile."
      });
    }
  },

  delete: async (req, res) => {
    try {
      let user = await User.destroy({
        where: { email: req.body.email }
      });
      console.log(user)

      if (user) {
        return res.status(200).json({ message: "User successfully deleted." });
      } else {
        return res.status(500).json({ message: "There was an error deleting your profile." });
      }
    } catch (err) {
      res.status(500).json({ message: "There was an error deleting your profile." });
    }
  }
}

module.exports = users;