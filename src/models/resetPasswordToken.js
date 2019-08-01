'use strict';
const Op = require('sequelize').Op;

module.exports = function(sequelize, type) {
  const resetToken = sequelize.define('reset_password_token', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: type.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    hooks: {
      beforeCreate: function deleteExpiredTokens() {
        return resetToken.destroy({
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
    
  resetToken.associate = (models) => {
    resetToken.belongsTo(models.user);
  };

  return resetToken;
};