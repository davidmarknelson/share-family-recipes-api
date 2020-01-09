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
  },

  seedMeal: async (req, res) => {
    try {
      if (process.env.NODE_ENV === 'test') {
        let meal = await Meal.create({
          name: 'Chicken and fries',
          description: 'A yummy fried chicken dish with hot baked fries',
          ingredients: [
            '1 chicken breast',
            '2 potatoes',
            'salt',
            'pepper',
            '1 egg',
            'flour',
            'oil'
          ],
          instructions: [
            'Fry the chicken',
            'Bake the fries'
          ],
          creatorId: 1,
          cookTime: 20,
          difficulty: 2,
          originalRecipeUrl: 'http://www.originalrecipe.com',
          youtubeUrl: 'https://www.youtube-nocookie.com/embed/MV0F_XiR48Q'
        });

        if (meal) {
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
  },

  seedMeal2: async (req, res) => {
    try {
      if (process.env.NODE_ENV === 'test') {
        let meal = await Meal.create({
          name: 'Chicken and rice',
          description: 'A yummy fried chicken dish with rice',
          ingredients: [
            '1 chicken breast',
            'rice',
            'salt',
            'pepper',
            '1 egg',
            'flour',
            'oil'
          ],
          instructions: [
            'Fry the chicken',
            'Cook the rice'
          ],
          creatorId: 1,
          cookTime: 20,
          difficulty: 2
        });

        if (meal) {
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