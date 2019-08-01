'use strict';
module.exports = (sequelize, type) => {
  return sequelize.define('meal', {
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
      type: type.ARRAY(type.TEXT),
      allowNull: false
    },
    instructions: {
      type: type.ARRAY(type.STRING),
      allowNull: false
    },
    prepTime: {
      type: type.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    cookTime: {
      type: type.INTEGER,
      defaultValue: 0,
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
    creatorUsername: {
      type: type.STRING,
      allowNull: false
    },
    likes: {
      type: type.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    createdAt: type.DATE,
    updatedAt: type.DATE
  });
};