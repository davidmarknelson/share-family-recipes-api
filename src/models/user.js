const bcrypt = require('bcryptjs');

function hashPasswordOnCreate(user) {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
}

function hashPasswordOnUpdate(user) {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(user.attributes.password, salt);
  user.attributes.password = hash;
}

module.exports = (sequelize, type) => {
  const user = sequelize.define('user', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: type.STRING,
      allowNull: false,
      unique: true
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
      type: type.TEXT,
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
      beforeCreate: hashPasswordOnCreate,
      beforeBulkUpdate: hashPasswordOnUpdate
    }
  });

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