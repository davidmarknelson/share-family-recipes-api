const Sequelize = require('sequelize');

// Database configuration
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PW, {
  host: process.env.HOST,
  dialect: 'postgres'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Models
const User = require('./models/user')(sequelize, Sequelize);
const Meal = require('./models/meal')(sequelize, Sequelize);

Meal.belongsTo(User, { foreignKey: { name: 'creatorId', unique: true }});
// Meal.hasOne(Picture, { foreignKey: { name: 'picture' }});
User.hasMany(Meal, { as: 'createdMeals', foreignKey: 'creatorId' });
// User.hasMany(Meal, { as: 'likedMeals' });
// User.hasMany(Meal, { as: 'savedMeals' });
// User.hasOne(Picture, { foreignKey: { name: 'profilePicture' }});


// For development
if (process.env.NODE_ENV !== "production") {
  sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
  });
}

module.exports = {
  user: User,
  meal: Meal
};