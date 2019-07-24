module.exports = (sequelize, types) => {
  const savedMeal = sequelize.define('savedMeal', {});

  savedMeal.associate = (models) => {
    savedMeal.belongsTo(models.user);
    savedMeal.belongsTo(models.meal);
  };

  return savedMeal;
}