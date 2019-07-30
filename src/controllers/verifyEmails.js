const Verification = require('../models/sequelize').verification_token;
const User = require('../models/sequelize').user;

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

      let returnedEmail = userAndToken.user.email;
      if (req.body.email === returnedEmail) {
        let tokenDestroyed = await Verification.destroy({
          where: {
            token: req.body.token
          }
        });

        let verifiedUser = await User.update({
          isVerified: true
        }, {
          where: {
            email: req.body.email
          }
        });

        if (verifiedUser[0] === 0) throw Error('There was an error verifying your email.');

        return res.status(200).json({ message: "Your email is now verified." });
      } else {
        return res.status(403).json({ message: "There was an error verifying your email." });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}
