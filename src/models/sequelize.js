'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const db = {};

// Database configuration
let DB;
(process.env.NODE_ENV === "test") ? DB = process.env.DB_TEST : DB = process.env.DB;
const sequelize = new Sequelize(DB, process.env.DB_USER, process.env.DB_PW, {
    host: process.env.HOST,
    dialect: 'postgres',
    logging: false
});

sequelize
  .authenticate()
  .then(() => {
    if ((process.env.NODE_ENV !== "test")) {
      console.log('Connection has been established successfully.');
    }
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

// For tests
db.sequelize = sequelize;

module.exports = db;