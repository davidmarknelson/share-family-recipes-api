const sequelize = require('../models/sequelize').sequelize;
const Meal = require('../models/sequelize').meal;
const User = require('../models/sequelize').user;

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
        let admin = await User.create({
          username: "johndoe",
          originalUsername: "johndoe",
          firstName: "John",
          lastName: "Doe",
          email: "test@email.com",
          password: "password",
          isAdmin: true,
          isVerified: true
        });

        let adminMeal = await Meal.create({
          name: 'Sandwich',
          originalName: 'Sandwich',
          description: 'An easy sandwich for those busy days!',
          ingredients: ['bread', 'cheese', 'meat'],
          instructions: [
            'Put the bread on the counter.', 
            'Put the meat between 2 slices of bread.', 
            'Put the cheese on the meat.'
          ],
          cookTime: 5,
          difficulty: 1
        });

        res.status(200).json({message: 'The database was successfully seeded.' });
      } else {
        res.status(404).json({ message: 'This route only exists during tests.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}