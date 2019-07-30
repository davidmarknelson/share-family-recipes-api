module.exports = {
  // User controller test objects
  user: {
    username: "jdoe",
    firstName: "John",
    lastName: "Doe",
    email: "test@email.com",
    password: "password",
    isAdmin: true
  },
  userNewUsername: {
    username: "johndoe",
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
}