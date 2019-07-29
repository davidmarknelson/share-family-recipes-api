const Verification = require('../models/sequelize').verification_token;
const cryptoRandomString = require('crypto-random-string');

module.exports = {
  verifyEmail: (req, res) => {
    Verification.findOne({
      where: {
        userId: req.body.userId,
        token: req.body.token
      }
    })
    .then(user => {
      // change isVerified to true, delete token
    })
    .then(() => {
      res.status(200).json({message: "Your email is now verified."});
    })
  }
}

