'use strict';
// Models
const Verification = require('../models/sequelize').verification_token;
const User = require('../models/sequelize').user;
// For emails
const cryptoRandomString = require('crypto-random-string');
const helpers = require('../helpers/email');
const nodemailer = require('nodemailer');
// config
const config = require('../../config');

module.exports = {
  verifyEmail: async (req, res) => {
    try {
      let userAndToken = await Verification.findOne({
        where: {
          token: req.body.token
        },
        include: [User]
      });

      if (!userAndToken) return res.status(404).json({ message: 'The token has expired. Please send another verification email.' });

      let verifiedUser = await User.update({
        isVerified: true
      }, {
        where: {
          id: userAndToken.user.id
        }
      });

      if (verifiedUser[0] === 0) throw new Error();

      let tokenDestroyed = await Verification.destroy({
        where: {
          token: req.body.token
        }
      });

      return res.status(200).json({ message: "Your email is now verified." });
    } catch (err) {
      res.status(500).json({ message: err.message || 'There was an error verifying your email.' });
    }
  },

  sendVerificationEmail: async (req, res) => {
    try {
      let user = await User.findOne({
        where: {
          email: req.body.email
        }
      });

      let tokenDestroyed = await Verification.destroy({
        where: {
          userId: user.id
        }
      });

      let token = cryptoRandomString({length: 10, type: 'url-safe'});
      let tokenObj = await Verification.create({
        token: token,
        userId: user.id
      });

      let transporter = nodemailer.createTransport({
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        auth: {
          user: config.EMAIL_USER,
          pass: config.EMAIL_PW
        }
      });
        
      let message = helpers.makeVerificationEmail(
        config.URL, 
        user.firstName, 
        user.lastName, 
        tokenObj.token
      );

      const mailOptions = {
        from: `${config.EMAIL}`,
        to: `${user.email}`,
        subject: 'Verify email',
        html: message
      };

      let email = await transporter.sendMail(mailOptions);

      // This is used to get the preview url for tests
      if (config.NODE_ENV === "developement" || "test") {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(email));
      }

      if (email.accepted[0] === `${user.email}`) {
        return res.status(200).json({ message: "Email has successfully been sent." });
      } else {
        throw Error();
      }
    } catch (err) {
      res.status(500).json({ message: "There was an error sending the email." });
    }
  }
};
