'use strict';
module.exports = (sequelize, type) => {
  const profilePic = sequelize.define('profile_pic', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    profilePicName: {
      type: type.STRING,
      allowNull: false,
      unique: true   
    },
    publicId: {
      type: type.STRING,
      allowNull: false
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId']
      }
    ]
  });

  profilePic.associate = (models) => {
    profilePic.belongsTo(models.user);
  };

  return profilePic;
};