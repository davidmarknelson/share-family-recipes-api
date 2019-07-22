const bcrypt = require('bcryptjs');

function hashPassword (user, options) {
  if (!user.changed('password')) {
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(user.password, salt);
  user.setDataValue('password', hash);
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
    password: {
      type: type.TEXT,
      allowNull: false,
      unique: true
    },
    isAdmin: type.BOOLEAN,
    createdAt: type.DATE,
    updatedAt: type.DATE
  }, {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
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