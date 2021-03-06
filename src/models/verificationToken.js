'use strict';
const Op = require('sequelize').Op;

module.exports = function(sequelize, type) {
  const verificationToken = sequelize.define('verification_token', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    token: {
      type: type.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    hooks: {
      beforeCreate: function deleteExpiredTokens() {
        return verificationToken.destroy({
          where: {
            createdAt: {
              [Op.lt]: new Date(Date.now() - 7200 * 1000)
            }
          }
        })
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['userId']
      }
    ]
  });
    
  verificationToken.associate = (models) => {
      verificationToken.belongsTo(models.user);
  };

  return verificationToken;
};