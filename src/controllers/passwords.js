const User = require('../models/sequelize').user;
const ResetPW = require('../models/sequelize').reset_password_token;
const helpers = require('../helpers/email');
const nodemailer = require('nodemailer');
const cryptoRandomString = require('crypto-random-string');

module.exports = {
  changePassword: async (req, res) => {
    try {
      let password = req.body.password;
      let passwordConfirmation = req.body.passwordConfirmation;
  
      if (password !== passwordConfirmation) {
        return res.status(400).json({ message: "Passwords do not match." });
      }
  
      let updatedUser = await User.update({
        password: password
      }, {
        where: {
          id: req.decoded.id,
          email: req.decoded.email
        }
      });
  
      if (updatedUser[0] === 0) throw Error('There was an error updating your password.');

      res.status(200).json({ message: "Your password was successfully updated." });
    } catch (err) {
      res.status(500).json({ message: err.message });
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

      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PW
        }
      });
        
      let message = helpers.resetPasswordEmail(
        process.env.URL, 
        tokenObj.token
      );

      const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `${req.body.email}`,
        subject: 'Verify email',
        html: message
      };

      let email = await transporter.sendMail(mailOptions);

      // This is used to get the preview url for tests
      if (process.env.NODE_ENV === "developement" || "test") {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(email));
      }

      if (email.accepted[0] === `${req.body.email}`) {
        return res.status(200).json({ message: `An email has been sent to ${req.body.email} with further instructions.` });
      } else {
        throw new Error();
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
        return res.status(404).json({ message: "Password reset token is invalid or has expired." });
      }

      let password = req.body.password;
      let passwordConfirmation = req.body.passwordConfirmation;
  
      if (password !== passwordConfirmation) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      let userObj = tokenAndUser.dataValues.user.dataValues;

      let updatedUser = await User.update({
        password: password
      }, {
        where: {
          id: userObj.id,
          email: userObj.email
        }
      });
  
      if (updatedUser[0] === 0) {
        return res.status(404).json({ message: 'There was an error updating your password.' });
      }

      res.status(200).json({ message: "Your password was successfully reset." });
    } catch (err) {
      res.status(500).json({ message: "There was an error resetting your password." });
    }
  }
}