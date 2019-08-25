'use strict';
module.exports = (sequelize, type) => {
  const like = sequelize.define('like', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
  });

  like.associate = (models) => {
    like.belongsTo(models.user);
    like.belongsTo(models.meal);
  };

  return like;
};