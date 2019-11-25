const sequelize = require('../models/sequelize').sequelize;
const Meal = require('../models/sequelize').meal;
const User = require('../models/sequelize').user;
const Verification = require('../models/sequelize').verification_token;
const ResetPW = require('../models/sequelize').reset_password_token;

module.exports = {
  destroy: async (req, res) => {
    try {
      if (process.env.NODE_ENV === 'test') {
        sequelize.sync({ force: true })
          .then(() => {
            res.status(200).json({ message: 'Database has successfully been cleared.' });
          });
      } else {
        res.status(404).json({ message: 'This route only exists during tests.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  seed: async (req, res) => {
    try {
      if (process.env.NODE_ENV === 'test') {
        let verified = await User.create({
          username: "verifiedUser",
          originalUsername: "verifiedUser",
          firstName: "John",
          lastName: "Doe",
          email: "verified@email.com",
          password: "password",
          isAdmin: true,
          isVerified: true
        });

        res.status(200).json({message: 'The database was successfully seeded.' });
      } else {
        res.status(404).json({ message: 'This route only exists during tests.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  seedUnverified: async (req, res) => {
    try {
      if (process.env.NODE_ENV === 'test') {
        let unverified = await User.create({
          username: "unverifiedUser",
          originalUsername: "unverifiedUser",
          firstName: "John",
          lastName: "Doe",
          email: "unverified@email.com",
          password: "password",
          isAdmin: false,
          isVerified: false
        });

        res.status(200).json({message: 'The database was successfully seeded.' });
      } else {
        res.status(404).json({ message: 'This route only exists during tests.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  seedEmailTokenAndUser: async (req, res) => {
    try {
      if (process.env.NODE_ENV === 'test') {
        let unverified = await User.create({
          username: "unverifiedUser",
          originalUsername: "unverifiedUser",
          firstName: "John",
          lastName: "Doe",
          email: "unverified@email.com",
          password: "password",
          isAdmin: false,
          isVerified: false
        });

        let tokenObj = await Verification.create({
          token: '1234567890',
          userId: unverified.dataValues.id
        });

        res.status(200).json({message: 'The database was successfully seeded.' });
      } else {
        res.status(404).json({ message: 'This route only exists during tests.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  seedPasswordTokenAndUser: async (req, res) => {
    try {
      if (process.env.NODE_ENV === 'test') {
        let unverified = await User.create({
          username: "verifiedUser",
          originalUsername: "verifiedUser",
          firstName: "John",
          lastName: "Doe",
          email: "verified@email.com",
          password: "password",
          isAdmin: true,
          isVerified: true
        });

        let tokenObj = await ResetPW.create({
          token: '1234567890',
          userId: unverified.dataValues.id
        });

        res.status(200).json({message: 'The database was successfully seeded.' });
      } else {
        res.status(404).json({ message: 'This route only exists during tests.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  seedMultipleUsers: async (req, res) => {
    try {
      if (process.env.NODE_ENV === 'test') {

        let usersArray = [];
        for (let i = 0; i < 25; i++) {
          usersArray.push({
            username: `${i}user`,
            originalUsername: `${i}user`,
            firstName: `${i}user`,
            lastName: `${i}user`,
            email: `${i}user@email.com`,
            password: `${i}password`,
            isAdmin: true,
            isVerified: true
          });
        }

        let users = await User.bulkCreate(usersArray);

        if (users) {
          res.status(200).json({message: 'The database was successfully seeded.' });
        } else {
          throw Error();
        }
      } else {
        res.status(404).json({ message: 'This route only exists during tests.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}