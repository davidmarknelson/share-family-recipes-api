const Op = require('sequelize').Op;

module.exports = function(sequelize, type) {
  const verificationToken = sequelize.define('verification_token', {
    token: {
      type: type.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: function deleteExpiredTokens() {
        return verificationToken.destroy({
          where: {
            createdAt: {
              [Op.lt]: new Date(Date.now() - 60 * 1000)
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