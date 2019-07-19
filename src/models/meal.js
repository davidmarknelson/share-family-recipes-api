module.exports = (sequelize, type) => {
  return sequelize.define('meal', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false
    },
    tags: {
      type: type.ARRAY(type.STRING),
      allowNull: false
    },
    ingredients: {
      type: type.ARRAY(type.TEXT),
      allowNull: false
    },
    instructions: {
      type: type.ARRAY(type.STRING),
      allowNull: false
    },
    cookTime: {
      type: type.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    difficulty: {
      type: type.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    likes: type.INTEGER,
    createdAt: type.DATE,
    updatedAt: type.DATE
  });
}