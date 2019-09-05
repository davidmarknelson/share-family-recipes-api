'use strict';
const bcrypt = require('bcryptjs');

function hashPasswordAndTrimOnCreate(user) {
  user.username = user.username.trim();
  user.firstName = user.firstName.trim();
  user.lastName = user.lastName.trim();
  user.password = user.password.trim();
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
}

function hashPasswordAndTrimOnUpdate(user) {
  if (user.attributes.username) user.attributes.username = user.attributes.username.trim();
  if (user.attributes.firstName) user.attributes.firstName = user.attributes.firstName.trim();
  if (user.attributes.lastName) user.attributes.lastName = user.attributes.lastName.trim();
  if (user.attributes.password) {
    user.attributes.password = user.attributes.password.trim();
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(user.attributes.password, salt);
    user.attributes.password = hash;
  }
}

module.exports = (sequelize, type) => {
  const user = sequelize.define('user', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    profilePic: {
      type: type.STRING,
      allowNull: true
    },
    username: {
      type: type.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [5, 15],
          msg: "Username must be 5 to 15 characters."
        },
        notContains: {
          args: ' ',
          msg: "Username must not contain a space."
        }
      }
    },
    originalUsername: {
      type: type.STRING,
      allowNull: false
    },
    firstName: {
      type: type.STRING,
      allowNull: false
    },
    lastName: {
      type: type.STRING,
      allowNull: false
    },
    email: {
      type: type.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    isVerified: {
      type: type.BOOLEAN, 
      allowNull: false,
      defaultValue: false
    },
    password: {
      type: type.STRING,
      allowNull: false,
      unique: true
    },
    isAdmin: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: type.DATE,
    updatedAt: type.DATE
  }, {
    hooks: {
      beforeCreate: hashPasswordAndTrimOnCreate,
      beforeBulkUpdate: hashPasswordAndTrimOnUpdate
    }
  });

  user.associate = (models) => {
    user.hasMany(models.meal, {foreignKey: 'creatorId', as: "meals"});
    user.hasMany(models.saved_meal, {as: "savedMeals"});
    user.hasMany(models.like, {as: "likes"});
  };

  user.comparePasswords = (reqPassword, dbPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(reqPassword, dbPassword, (err, res) => {
        if (err) { return reject(err); }
        return resolve(res);
      });
    });
  }

  return user;
};