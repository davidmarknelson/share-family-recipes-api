'use strict';
module.exports = {
  // User controller test objects
  user: {
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    email: "test@email.com",
    password: "password",
    isAdmin: true
  },
  userNewUsername: {
    username: "johndoe2",
    firstName: "John",
    lastName: "Doe",
    email: "test@email.com",
    password: "password",
    isAdmin: true
  },
  user2: {
    username: "jsmith",
    firstName: "John",
    lastName: "Smith",
    email: "smith@email.com",
    password: "password",
    isAdmin: false
  },
  userWithShortUsername: {
    username: "jdoe",
    firstName: "John",
    lastName: "Doe",
    email: "test@email.com",
    password: "password",
    isAdmin: true
  },
  userWithCredentials: {
    email: "test@email.com",
    password: "password"
  },
  userWithWrongEmail: {
    email: "wrong@email.com",
    password: "password"
  },
  userWithWrongPassword: {
    email: "test@email.com",
    password: "wrongpassword"
  }
};