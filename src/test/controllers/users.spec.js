'use strict';
const db = require('../../models/sequelize').sequelize;
const server = require("../../../app");
const utils = require("../utils");
// Models to check database for data
const SavedMeal = require('../../models/sequelize').saved_meal;
const User = require('../../models/sequelize').user;
const Meal = require('../../models/sequelize').meal;
const Like = require('../../models/sequelize').like;
const ProfilePic = require('../../models/sequelize').profile_pic;
const MealPic = require('../../models/sequelize').meal_pic;


describe('Users', () => {
  let user;
  let user2;

  before(() => {
    return db.sync({force: true});
  });

  describe('POST /user/signup', () => {
    it('should return an error if the username is too short', (done) => {
      chai.request(server)
      .post('/user/signup')
      .field('username', 'john')
      .field('firstName', 'John')
      .field('lastName', 'Doe')
      .field('email', 'test@email.com')
      .field('password', 'password')
      .field('passwordConfirmation', 'password')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.message.should.equal("Username must be 5 to 15 characters.");
        if(err) done(err);
        done();
      });
    });

    it('should return an error if the username is too long', (done) => {
      chai.request(server)
      .post('/user/signup')
      .field('username', '1234567890123456')
      .field('firstName', 'John')
      .field('lastName', 'Doe')
      .field('email', 'test@email.com')
      .field('password', 'password')
      .field('passwordConfirmation', 'password')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.message.should.equal("Username must be 5 to 15 characters.");
        if(err) done(err);
        done();
      });
    });

    it('should return an error when the image uploaded is not JPEG', (done) => {
      chai.request(server)
        .post('/user/signup')
        .field('username', 'johndoe')
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .field('email', 'test@email.com')
        .field('password', 'password')
        .field('passwordConfirmation', 'password')
        .field('isAdmin', 'true')
        .field('adminCode', '123456789')
        .attach('profilePic', 'src/test/testImages/testImagePng.png')
        .end((err, res) => {
          res.should.have.status(415);
          res.body.message.should.equal('Please upload a JPEG image.');
          if(err) done(err);
          done();
        });
    });

    it('should return an error when the passwords do not match', (done) => {
      chai.request(server)
        .post('/user/signup')
        .field('username', 'johndoe')
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .field('email', 'test@email.com')
        .field('password', 'password')
        .field('passwordConfirmation', 'wrongpassword')
        .field('isAdmin', 'true')
        .field('adminCode', '123456789')
        .attach('profilePic', 'src/test/testImages/testImageJpeg.jpg')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('Passwords do not match.');
          if(err) done(err);
          done();
        });
    });

    it('should return an error if the username contains a space', (done) => {
      chai.request(server)
        .post('/user/signup')
        .field('username', 'john doe')
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .field('email', 'test@email.com')
        .field('password', 'password')
        .field('passwordConfirmation', 'password')
        .field('isAdmin', 'true')
        .field('adminCode', '123456789')
        .attach('profilePic', 'src/test/testImages/testImageJpeg.jpg')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('Username must not contain a space.');
          if(err) done(err);
          done();
        });
    });

    it('should return an admin user object when a new user is created with a profile pic', (done) => {
      chai.request(server)
        .post('/user/signup')
        .field('username', 'johndoe')
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .field('email', 'test@email.com')
        .field('password', 'password')
        .field('passwordConfirmation', 'password')
        .field('isAdmin', 'true')
        .field('adminCode', '123456789')
        .attach('profilePic', 'src/test/testImages/testImageJpeg.jpg')
        .end((err, res) => {
          user = res.body;

          res.should.have.status(201);
          res.body.should.have.property('jwt');
          if(err) done(err);
          done();
        });
    });

    it('should return a user object that is not an admin when a new user is created', (done) => {
      chai.request(server)
        .post('/user/signup')
        .field('username', 'johnsmith')
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .field('email', 'smith@email.com')
        .field('password', 'password')
        .field('passwordConfirmation', 'password')
        .end((err, res) => {
          user2 = res.body;

          res.should.have.status(201);
          res.body.should.have.property('jwt');
          if(err) done(err);
          done();
        });
    });

    it('should send a message when a username is already being used', (done) => {
      chai.request(server)
        .post('/user/signup')
        .send(utils.user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('This username is already taken.');
          if(err) done(err);
          done();
        });
    });

    it('should send a message when an email is already being used', (done) => {
      chai.request(server)
        .post('/user/signup')
        .send(utils.userNewUsername)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('This email account is already in use.');
          if(err) done(err);
          done();
        });
    });
  });


  describe('GET /user/username', () => {
    it('should show that a username is unavailable', (done) => {
      chai.request(server)
        .get(`/user/available-username?username=johndoe`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.not.have.property('message');
          if(err) done(err);
          done();
        });
    });

    it('should show that a username is unavailable regardless of case', (done) => {
      chai.request(server)
        .get(`/user/available-username?username=JOHNDOE`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.not.have.property('message');          
          if(err) done(err);
          done();
        });
    });
  
    it('should show that a username is available', (done) => {
      chai.request(server)
        .get('/user/available-username?username=newname')
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.not.have.property('message');
          if(err) done(err);
          done();
        });
    });
  });


  describe('POST /user/login', () => {
    it('should login user with correct credentials', (done) => {
      chai.request(server)
        .post('/user/login')
        .send(utils.loginCredentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('jwt');
          if(err) done(err);
          done();
        });
    });

    it('should send an error message when wrong email is sent', (done) => {
      chai.request(server)
        .post('/user/login')
        .send(utils.wrongEmailCredentials)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message', 'The login information was incorrect.');
          if(err) done(err);
          done();
        });
    });

    it('should send an error message when wrong password is sent', (done) => {
      chai.request(server)
        .post('/user/login')
        .send(utils.wrongPasswordCredentials)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message', 'The login information was incorrect.');
          if(err) done(err);
          done();
        });
    });
  });

  describe('GET /user/profile', () => {
    it('should get the profile with only a valid jwt', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .get('/user/profile')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('username');
          res.body.should.have.property('firstName');
          res.body.should.have.property('lastName');
          res.body.should.have.property('email');
          res.body.should.have.property('isVerified');
          res.body.should.have.property('isAdmin');
          res.body.should.have.property('profilePic');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          if(err) done(err);
          done();
        });
    });
  });

  describe('GET /user/renew', () => {
    it('should return a jwt when given a valid jwt', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .get('/user/renew')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('jwt');
          if(err) done(err);
          done();
        });
    });
  });

  describe('UPDATE /user/update', () => {
    it('should return a success message when the user is updated', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/user/update')
        .set("Authorization", token)
        .field('firstName', 'Jane')
        .then(res => {
          res.should.have.status(201);
          res.body.message.should.equal("Profile successfully updated.");
        })
        .then(() => User.findOne({where: { id: 1}}))
        .then(user => {
          user.dataValues.firstName.should.equal('Jane');
          user.dataValues.email.should.equal('test@email.com');
          user.dataValues.isVerified.should.equal(false);
          done();
        })
        .catch(err => done(err));
    });

    it('should change isVerified to false when the user changes their email', (done) => {
      let token = `Bearer ${user.jwt}`;

      User.update({isVerified: true}, {where: { id: 1}, returning: true })
        .then(user => user[1][0].dataValues.isVerified.should.equal(true))
        .then(() => chai.request(server)
          .put('/user/update')
          .set("Authorization", token)
          .field('email', 'email@email.com'))
        .then(res => {
          res.should.have.status(201);
          res.body.message.should.equal("Profile successfully updated.");
        })
        .then(() => User.findOne({where: { id: 1}}))
        .then(user => {
          user.dataValues.email.should.equal('email@email.com');
          user.dataValues.isVerified.should.equal(false);
          done();
        })
        .catch(err => done(err));
    });

    it('should delete the old picture when the user uploads a new picture', (done) => {
      let token = `Bearer ${user.jwt}`;
      let originalPic;

      ProfilePic.findAll()
        .then(profilePics => {
          originalPic = profilePics[0].profilePicName;
          profilePics.length.should.equal(1);
        })
        .then(() => chai.request(server)
          .put('/user/update')
          .set("Authorization", token)
          .attach('profilePic', 'src/test/testImages/testImageJpeg.jpg'))
        .then(res => {
          res.should.have.status(201);
          res.body.message.should.equal("Profile successfully updated.");
        })
        .then(() => ProfilePic.findAll())
        .then(profilePics => {
          profilePics.length.should.equal(1);
          originalPic.should.not.equal(profilePics[0].profilePicName);
        })
        .then(() => done())
        .catch(err => done(err));
    });

    it('should return an error if the image is PNG', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/user/update')
        .set("Authorization", token)
        .field('username', 'johndoe')
        .field('firstName', 'Jane')
        .field('lastName', 'Doe')
        .field('email', 'test@email.com')
        .attach('profilePic', 'src/test/testImages/testImagePng.png')
        .end((err, res) => {
          res.should.have.status(415);
          res.body.message.should.equal('Please upload a JPEG image.');          
          if(err) done(err);
          done();
        });
    });

    it('should return an error message if the username is already in use', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/user/update')
        .set("Authorization", token)
        .field('username', 'johnsmith')
        .field('firstName', 'Jane')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('This username is already taken.');          
          if(err) done(err);
          done();
        });
    });

    it('should return an error message if the email is already in use', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/user/update')
        .set("Authorization", token)
        .field('firstName', 'Jane')
        .field('lastName', 'Doe')
        .field('email', 'smith@email.com')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('This email account is already in use.');          
          if(err) done(err);
          done();
        });
    });

    it('should return an error message if the username is too short', (done) => {
      let token = `Bearer ${user.jwt}`;
          
      chai.request(server)
        .put('/user/update')
        .set("Authorization", token)
        .field('username', 'jane')
        .field('firstName', 'Jane')
        .field('lastName', 'Doe')
        .field('email', 'test@email.com')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal("Username must be 5 to 15 characters.");
          if(err) done(err);
          done();
        });
    });

    it('should return an error message if the username is too long', (done) => {
      let token = `Bearer ${user.jwt}`;
          
      chai.request(server)
        .put('/user/update')
        .set("Authorization", token)
        .field('username', '1234567890123456')
        .field('firstName', 'Jane')
        .field('lastName', 'Doe')
        .field('email', 'test@email.com')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal("Username must be 5 to 15 characters.");
          if(err) done(err);
          done();
        });
    });
  });
  

  describe('DELETE /user/delete', () => {
    it('should return a message when a user and the user created content is deleted', (done) => {
      let token = `Bearer ${user.jwt}`;
      let token2 = `Bearer ${user2.jwt}`;

      // user 1 creates meal
      utils.createMeal1(user.jwt)
        // user 1 saves meal
        .then(() => chai.request(server)
          .post('/savedmeals/save')
          .set("Authorization", token)
          .send({ mealId: 1 }))
        // user 1 likes meal
        .then(() => chai.request(server)
          .post('/likes/add')
          .set("Authorization", token)
          .send({mealId: 1}))
        // user 2 saves meal
        .then(() => chai.request(server)
          .post('/savedmeals/save')
          .set("Authorization", token2)
          .send({ mealId: 1 }))
        // user 2 likes meal
        .then(() => chai.request(server)
          .post('/likes/add')
          .set("Authorization", token)
          .send({mealId: 1}))
        // user 1 deletes profile
        .then(() => chai.request(server)
          .delete('/user/delete')
          .set("Authorization", token)
          .then(res => {
            res.should.have.status(200);
            res.body.message.should.equal("Profile successfully deleted.");
          }))
        // Check if this has also deleted user 2 likes and saves related to user 1 created content
        .then(() => User.findOne({where: {id: 1}}))
        .then(user => expect(user).to.equal(null))
        .then(() => Like.findAll())
        .then(likes => expect(likes.length).to.equal(0))
        .then(() => Meal.findAll())
        .then(meals => expect(meals.length).to.equal(0))
        .then(() => MealPic.findAll())
        .then(mealPics => expect(mealPics.length).to.equal(0))
        .then(() => SavedMeal.findAll())
        .then(savedMeals => expect(savedMeals.length).to.equal(0))
        .then(() => done())
        .catch(err => done(err));
    });

    it('should return a error message when a user is not deleted', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .delete('/user/delete')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal("There was an error deleting your profile.");
          if(err) done(err);
          done();
        });
    });
  });

});