'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const db = {};
// Config
const config = require('../../config');

// Database configuration
const sequelize = new Sequelize(config.DB, config.DB_USER, config.DB_PW, {
  host: config.HOST,
  dialect: 'postgres',
  logging: true
});

sequelize
  .authenticate()
  .then(() => {
    if (process.env.UNIT_TEST !== "true") {
      console.log('Connection has been established successfully.');
    }
    console.log('did it work?')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


fs.readdirSync(__dirname)
  .filter(file => file !== 'sequelize.js')
  .forEach(file => {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
});

// For testing
if (process.env.NODE_ENV === "test" && process.env.UNIT_TEST !== "true") {
  sequelize.sync({ force: true })
    .then(() => {
      console.log(`Database & tables created!`)
    });
}

// For production and development
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync()
    .then(() => {
      console.log(`Database & tables created!`)
    });
}

// For tests
db.sequelize = sequelize;

module.exports = db;