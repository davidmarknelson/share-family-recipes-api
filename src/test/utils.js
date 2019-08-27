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
        isAdmin: true,
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
      .field('name', 'Sandwich')
      .field('ingredients', JSON.stringify(['bread', 'cheese', 'meat']))
      .field('instructions', JSON.stringify([
        'Put the bread on the counter.', 
        'Put the meat between 2 slices of bread.', 
        'Put the cheese on the meat.'
      ]))
      .field('prepTime', 5)
      .field('cookTime', 0)
      .field('difficulty', 1)
  },
  createMeal2: (token) => {
    return chai.request(server)
      .post('/meals/create')
      .set("Authorization", `Bearer ${token}`)
      .field('name', 'Soup')
      .field('ingredients', JSON.stringify(['water', 'vegetables', 'meat']))
      .field('instructions', JSON.stringify([
        'Cut the veggies.', 
        'Boil the water.', 
        'Put veggies and meat in the water until it is cooked.'
      ]))
      .field('prepTime', 10)
      .field('cookTime', 20)
      .field('difficulty', 3)
  }
};