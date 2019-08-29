'use strict';
module.exports = (sequelize, type) => {
  const meal = sequelize.define('meal', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    mealPic: {
      type: type.STRING,
      allowNull: true
    },
    name: {
      type: type.STRING,
      allowNull: false,
      unique: true      
    },
    description: {
      type: type.STRING,
      allowNull: false
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
      type: type.ARRAY(type.STRING),
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
        if (Array.isArray(meal.ingredients)) {
          meal.ingredients = JSON.stringify(meal.ingredients);
        }
      },
      beforeBulkUpdate: function parseUpdatedIngredients(meal) {
        if (Array.isArray(meal.attributes.ingredients)) {
          meal.attributes.ingredients = JSON.stringify(meal.attributes.ingredients);
        }
      }
    }
  });

  meal.associate = (models) => {
    meal.belongsTo(models.user, {as: "creator"});
    meal.hasMany(models.like);
  };

  return meal;
};