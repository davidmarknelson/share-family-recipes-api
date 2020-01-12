'use strict';
// Models
const ResetPW = require('../models/sequelize').reset_password_token;
const User = require('../models/sequelize').user;
// For emails
const cryptoRandomString = require('crypto-random-string');
const helpers = require('../helpers/email');
const nodemailer = require('nodemailer');
// Config
const config = require('../../config');

module.exports = {
  updatePassword: async (req, res) => {
    try {
      if (req.body.password !== req.body.passwordConfirmation) {
        return res.status(400).json({ message: "Passwords do not match." });
      }
  
      let updatedUser = await User.update({
        password: req.body.password
      }, {
        where: {
          id: req.decoded.id
        }
      });
  
      if (updatedUser[0] === 0) throw Error();

      res.status(201).json({ message: "Your password was successfully updated." });
    } catch (err) {
      res.status(500).json({ message: 'There was an error updating your password.' });
    }
  },

  sendResetEmail: async (req, res) => {
    try {
      let user = await User.findOne({
        where: {
          email: req.body.email
        }
      });

      if (!user) return res.status(404).json({ message: "No account with that email address exists." });

      let tokenDestroyed = await ResetPW.destroy({
        where: {
          userId: user.id
        }
      });

      let token = cryptoRandomString({length: 10, type: 'url-safe'});
      let tokenObj = await ResetPW.create({
        token: token,
        userId: user.id
      });

      let transporter;
      if (process.env.NODE_ENV === 'production') {
        transporter = nodemailer.createTransport({
          host: config.EMAIL_HOST,
          port: config.EMAIL_PORT,
          secure: true,
          auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PW
          }
        });
      } else {
        transporter = nodemailer.createTransport({
          host: config.EMAIL_HOST,
          port: config.EMAIL_PORT,
          auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PW
          }
        });
      }
        
      let message = helpers.resetPasswordEmail(
        config.URL, 
        tokenObj.token
      );

      const mailOptions = {
        from: `${config.EMAIL}`,
        to: `${req.body.email}`,
        subject: 'Verify email',
        html: message
      };

      let email = await transporter.sendMail(mailOptions);

      // This is used to get the preview url for tests
      if (config.NODE_ENV === "developement" || "test") {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(email));
      }

      if (email.accepted[0] === `${req.body.email}`) {
        return res.status(200).json({ message: `An email has been sent to ${req.body.email} with further instructions.` });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: "There was an error sending your password reset email." });
    }
  },

  resetPassword: async (req, res) => {
    try {
      let tokenAndUser = await ResetPW.findOne({
        where: {
          token: req.body.token
        },
        include: [User]
      });

      if (!tokenAndUser) {
        return res.status(404).json({ message: "Password reset token is invalid or has expired. Resend reset email." });
      }

      if (req.body.password !== req.body.passwordConfirmation) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      let userObj = tokenAndUser.dataValues.user.dataValues;

      let updatedUser = await User.update({
        password: req.body.password
      }, {
        where: {
          id: userObj.id
        }
      });
  
      if (updatedUser[0] === 0) {
        throw Error();
      }

      res.status(201).json({ message: "Your password was successfully reset. Please log in with your new password." });
    } catch (err) {
      res.status(500).json({ message: "There was an error resetting your password." });
    }
  }
}