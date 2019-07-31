module.exports = (sequelize, type) => {
  const savedMeal = sequelize.define('saved_meal', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });

  savedMeal.associate = (models) => {
    savedMeal.belongsTo(models.user);
    savedMeal.belongsTo(models.meal);
  };

  return savedMeal;
};