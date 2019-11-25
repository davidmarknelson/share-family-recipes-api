'use strict';
module.exports = (sequelize, type) => {
  const meal = sequelize.define('meal', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: type.STRING,
      allowNull: false,
      unique: true   
    },
    description: {
      type: type.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [0, 150],
          msg: 'The description has a max of 150 characters.'
        }
      }
    },
    ingredients: {
      type: type.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter ingredients.'
        }
      }
    },
    instructions: {
      type: type.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter instructions.'
        }
      }
    },
    cookTime: {
      type: type.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "The time to make the meal must be the number of minutes in number form."
        }
      }
    },
    difficulty: {
      type: type.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "The level of difficulty must be between 1 and 5."
        },
        max: {
          args: [5],
          msg: "The level of difficulty must be between 1 and 5."
        }
      }
    },
    originalRecipeUrl: {
      type: type.STRING,
      allowNull: true,
    },
    youtubeUrl: {
      type: type.STRING,
      allowNull: true,
    },
    createdAt: type.DATE,
    updatedAt: type.DATE
  }, {
    indexes: [
      { fields: ['ingredients'] }
    ],
    hooks: {
      beforeValidate: function parseIngredients(meal) {
        if (typeof meal.difficulty === 'string') {
          meal.difficulty = Number(meal.difficulty);
        }
        if (typeof meal.cookTime === 'string') {
          meal.cookTime = Number(meal.cookTime);
        }
        if (Array.isArray(meal.ingredients)) {
          meal.ingredients = JSON.stringify(meal.ingredients);
        }
        if (Array.isArray(meal.instructions)) {
          meal.instructions = JSON.stringify(meal.instructions);
        }
      },
      beforeBulkUpdate: function parseIngredients(meal) {
        if (typeof meal.difficulty === 'string') {
          meal.difficulty = Number(meal.difficulty);
        }
        if (typeof meal.cookTime === 'string') {
          meal.cookTime = Number(meal.cookTime);
        }
        if (Array.isArray(meal.ingredients)) {
          meal.ingredients = JSON.stringify(meal.ingredients);
        }
        if (Array.isArray(meal.instructions)) {
          meal.instructions = JSON.stringify(meal.instructions);
        }
      }
    }
  });

  meal.associate = (models) => {
    meal.belongsTo(models.user, {as: "creator"});
    meal.hasMany(models.like);
    meal.hasOne(models.meal_pic, {foreignKey: 'mealId', as: 'mealPic'});
  };

  return meal;
};