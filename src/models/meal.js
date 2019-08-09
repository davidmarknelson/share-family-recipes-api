'use strict';
module.exports = (sequelize, type) => {
  const meal = sequelize.define('meal', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false,
      unique: true      
    },
    ingredients: {
      type: type.ARRAY(type.STRING),
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
    prepTime: {
      type: type.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "The prep time must be the number of minutes in number form."
        }
      }
    },
    cookTime: {
      type: type.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "The cook time must be the number of minutes in number form."
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
    createdAt: type.DATE,
    updatedAt: type.DATE
  });

  meal.associate = (models) => {
    meal.belongsTo(models.user, {as: "creator"});
    meal.hasMany(models.like);
  };

  return meal;
};