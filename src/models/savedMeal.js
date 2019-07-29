module.exports = (sequelize, types) => {
  const savedMeal = sequelize.define('saved_meal', {});

  savedMeal.associate = (models) => {
    savedMeal.belongsTo(models.user);
    savedMeal.belongsTo(models.meal);
  };

  return savedMeal;
}