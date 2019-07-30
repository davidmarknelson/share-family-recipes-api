const User = require('../models/sequelize').user;

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

  resetPassword: async (req, res) => {
    try {

    } catch (err) {
      
    }
  }
}