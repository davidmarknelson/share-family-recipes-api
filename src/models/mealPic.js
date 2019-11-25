'use strict';
module.exports = (sequelize, type) => {
  const mealPic = sequelize.define('meal_pic', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    mealPicName: {
      type: type.STRING,
      allowNull: false,
      unique: true   
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['mealId']
      }
    ]
  });

  mealPic.associate = (models) => {
    mealPic.belongsTo(models.meal);
  };

  return mealPic;
};