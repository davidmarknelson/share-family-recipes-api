const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const models = {};

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


fs
  .readdirSync(__dirname)
  .filter((file) =>
    file !== 'sequelize.js'
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    models[model.name] = model
  });

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})


// For development
if (process.env.NODE_ENV === "development") {
  sequelize.sync({ force: true })
    .then(() => {
      console.log(`Database & tables created!`)
    });
}

// For production
if (process.env.NODE_ENV === "production") {
  sequelize.sync()
    .then(() => {
      console.log(`Database & tables created!`)
    });
}

module.exports = models;