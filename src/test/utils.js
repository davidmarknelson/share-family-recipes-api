'use strict';
const server = require("../../app");

module.exports = {
  user: {
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    email: "test@email.com",
    password: "password",
    passwordConfirmation: "password",
    isAdmin: true
  },
  userNewUsername: {
    username: "johndoe2",
    firstName: "John",
    lastName: "Doe",
    email: "test@email.com",
    password: "password",
    passwordConfirmation: "password"
  },
  userWithShortUsername: {
    username: "jdoe",
    firstName: "John",
    lastName: "Doe",
    email: "test@email.com",
    password: "password",
    passwordConfirmation: "password",
    isAdmin: true
  },
  loginCredentials: {
    email: "test@email.com",
    password: "password"
  },
  wrongEmailCredentials: {
    email: "wrong@email.com",
    password: "password"
  },
  wrongPasswordCredentials: {
    email: "test@email.com",
    password: "wrongpassword"
  },
  user2: {
    username: "jsmith",
    firstName: "Jack",
    lastName: "Smith",
    email: "smith@email.com",
    password: "password",
    passwordConfirmation: "password",
    isAdmin: false,
    adminCode: "notValid"
  },
  mealNoPic: {
    name: 'Meat and Cheese Sandwich',
    description: 'An easy sandwich for those busy days!',
    ingredients: JSON.stringify(['bread', 'cheese', 'meat']),
    instructions: JSON.stringify([
      'Put the bread on the counter.', 
      'Put the meat between 2 slices of bread.', 
      'Put the cheese on the meat.'
    ]),
    cookTime: 5,
    difficulty: 1,
    originalRecipeUrl: 'www.testrecipe.com',
    youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
    mealPicName: null,
    publicId: null
  },
  mealWithPic: {
    name: 'Meat and Tomato Sandwich',
    description: 'An easy sandwich for those busy days!',
    ingredients: JSON.stringify(['bread', 'TOMATO', 'meat']),
    instructions: JSON.stringify([
      'Put the bread on the counter.', 
      'Put the meat between 2 slices of bread.', 
      'Put the tomato on the meat.'
    ]),
    cookTime: 5,
    difficulty: 1,
    originalRecipeUrl: 'www.testrecipe.com',
    youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
    mealPicName: 'https://mealpicurl',
    publicId: 'folder/mealpicname'
  },
  createAdmin: () => {
    return chai.request(server)
      .post('/user/signup')
      .send({
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        email: "test@email.com",
        password: "password",
        passwordConfirmation: "password",
        adminCode: '123456789'
      });
  },
  createUser: () => {
    return chai.request(server)
      .post('/user/signup')
      .send({
        username: "jsmith",
        firstName: "Jack",
        lastName: "Smith",
        email: "smith@email.com",
        password: "password",
        passwordConfirmation: "password"
      });
  },
  createMeal1: (token) => {
    return chai.request(server)
      .post('/meals/create')
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: 'Sandwich',
        description: 'An easy sandwich for those busy days!',
        ingredients: JSON.stringify(['bread', 'tomato', 'meat']),
        instructions: JSON.stringify([
          'Put the bread on the counter.', 
          'Put the meat between 2 slices of bread.', 
          'Put the tomato on the meat.'
        ]),
        cookTime: 5,
        difficulty: 1,
        originalRecipeUrl: 'www.testrecipe.com',
        youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
        mealPicName: 'https://mealpicurl',
        publicId: 'folder/mealpicname'
      });
  },
  createMeal2: (token) => {
    return chai.request(server)
      .post('/meals/create')
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: 'Soup',
        description: 'A tasty soup for a cold day!',
        ingredients: JSON.stringify(['water', 'vegetables', 'meat']),
        instructions: JSON.stringify([
          'Cut the veggies.', 
          'Boil the water.', 
          'Put veggies and meat in the water until it is cooked.'
        ]),
        cookTime: 20,
        difficulty: 3,
        mealPicName: null,
        publicId: null
      });
  }
};