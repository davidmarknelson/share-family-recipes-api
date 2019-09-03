'use strict';
// Models
const Verification = require('../models/sequelize').verification_token;
const User = require('../models/sequelize').user;
// For emails
const cryptoRandomString = require('crypto-random-string');
const helpers = require('../helpers/email');
const nodemailer = require('nodemailer');

module.exports = {
  verifyEmail: async (req, res) => {
    try {
      let userAndToken = await Verification.findOne({
        where: {
          token: req.body.token
        },
        include: [User]
      });

      if (!userAndToken) throw Error('There was an error verifying your email.');

      let tokenDestroyed = await Verification.destroy({
        where: {
          token: req.body.token
        }
      });

      let verifiedUser = await User.update({
        isVerified: true
      }, {
        where: {
          id: userAndToken.user.id
        }
      });

      if (verifiedUser[0] === 0) throw new Error();

      return res.status(200).json({ message: "Your email is now verified." });
    } catch (err) {
      res.status(500).json({ message: 'There was an error verifying your email.' });
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
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PW
        }
      });
        
      let message = helpers.makeVerificationEmail(
        process.env.URL, 
        user.firstName, 
        user.lastName, 
        tokenObj.token
      );

      const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `${user.email}`,
        subject: 'Verify email',
        html: message
      };

      let email = await transporter.sendMail(mailOptions);

      // This is used to get the preview url for tests
      if (process.env.NODE_ENV === "developement" || "test") {
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
