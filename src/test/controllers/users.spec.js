'use strict';
process.env.NODE_ENV = 'test';

const db = require('../../models/sequelize').sequelize;
const User = require('../../models/sequelize').user;
const server = require("../../../app");
const utils = require("../utils");

describe('Users', () => {
  let user;

  before(() => {
    return db.sync({force: true});
  });

  describe('POST /user/signup', () => {
    it('should return an error if the username is too short', (done) => {
      chai.request(server)
      .post('/user/signup')
      .send(utils.userWithShortUsername)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.message.should.equal("Validation error: Username must be between 5 and 15 characters.");
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
          res.should.have.status(500);
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

          res.should.have.status(200);
          res.body.should.have.property('user');
          res.body.should.have.property('jwt');
          res.body.user.should.have.property('id', 1);
          res.body.user.should.have.property('username', 'johndoe');
          res.body.user.should.have.property('firstName', 'John');
          res.body.user.should.have.property('lastName', 'Doe');
          res.body.user.should.have.property('email', 'test@email.com');
          res.body.user.should.not.have.property('password');
          res.body.user.should.have.property('isAdmin', true);
          res.body.user.should.have.property('createdAt');
          res.body.user.should.have.property('profilePic', 'public/images/profilePics/johndoe.jpeg');
          res.body.user.createdAt.should.be.a.dateString();
          res.body.user.should.have.property('updatedAt');
          res.body.user.updatedAt.should.be.a.dateString();
          res.body.user.createdAt.should.equal(res.body.user.updatedAt);
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
          res.should.have.status(200);
          res.body.should.have.property('user');
          res.body.should.have.property('jwt');
          res.body.user.should.have.property('id', 2);
          res.body.user.should.have.property('username', 'johnsmith');
          res.body.user.should.have.property('firstName', 'John');
          res.body.user.should.have.property('lastName', 'Doe');
          res.body.user.should.have.property('email', 'smith@email.com');
          res.body.user.should.not.have.property('password');
          res.body.user.should.have.property('isAdmin', false);
          res.body.user.should.have.property('createdAt');
          res.body.user.createdAt.should.be.a.dateString();
          res.body.user.should.have.property('updatedAt');
          res.body.user.updatedAt.should.be.a.dateString();
          res.body.user.createdAt.should.equal(res.body.user.updatedAt);
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
          res.body.message.should.equal('This username is already in use.');
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
        .get(`/user/available-username?username=${user.user.username}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('This username is already in use.');
          if(err) done(err);
          done();
        });
    });

    it('should show that a username is unavailable regardless of case', (done) => {
      chai.request(server)
        .get(`/user/available-username?username=${user.user.username.toUpperCase()}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('This username is already in use.');
          if(err) done(err);
          done();
        });
    });
  
    it('should show that a username is available', (done) => {
      chai.request(server)
        .get('/user/available-username?username=newname')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('This username is available.');
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
          res.body.should.have.property('user');
          res.body.should.have.property('jwt');
          res.body.user.should.have.property('id', 1);
          res.body.user.should.have.property('username', 'johndoe');
          res.body.user.should.have.property('firstName', 'John');
          res.body.user.should.have.property('lastName', 'Doe');
          res.body.user.should.have.property('email', 'test@email.com');
          res.body.user.should.not.have.property('password');
          res.body.user.should.have.property('createdAt');
          res.body.user.createdAt.should.be.a.dateString();
          res.body.user.should.have.property('updatedAt');
          res.body.user.updatedAt.should.be.a.dateString();
          res.body.user.should.have.property('meals');
          res.body.user.meals.should.be.an('array');
          res.body.user.should.have.property('savedMeals');
          res.body.user.savedMeals.should.be.an('array');
          if(err) done(err);
          done();
        });
    });

    it('should send an error message when wrong email is sent', (done) => {
      chai.request(server)
        .post('/user/login')
        .send(utils.wrongEmailCredentials)
        .end((err, res) => {
          res.should.have.status(403);
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
          res.should.have.status(403);
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
        .send(utils.userWithCredentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('user');
          res.body.should.have.property('jwt');
          res.body.user.should.have.property('id', 1);
          res.body.user.should.have.property('username', 'johndoe');
          res.body.user.should.have.property('firstName', 'John');
          res.body.user.should.have.property('lastName', 'Doe');
          res.body.user.should.have.property('email', 'test@email.com');
          res.body.user.should.not.have.property('password');
          res.body.user.should.have.property('createdAt');
          res.body.user.createdAt.should.be.a.dateString();
          res.body.user.should.have.property('updatedAt');
          res.body.user.updatedAt.should.be.a.dateString();
          res.body.user.should.have.property('meals');
          res.body.user.meals.should.be.an('array');
          res.body.user.should.have.property('savedMeals');
          res.body.user.savedMeals.should.be.an('array');
          if(err) done(err);
          done();
        });
    });
  });

  describe('UPDATE /user/update', () => {
    it('should return a message when the user is updated and it includes JPEG image', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/user/update')
        .set("Authorization", token)
        .field('username', 'johndoe')
        .field('firstName', 'Jane')
        .field('lastName', 'Doe')
        .field('email', 'test@email.com')
        .attach('profilePic', 'src/test/testImages/testImageJpeg.jpg')
        .then(res => {
          res.should.have.status(200);
          res.body.message.should.equal("User successfully updated.");
        })
        .then(() => User.findOne({where: { id: user.user.id }}))
        .then(user => {
          user.dataValues.firstName.should.equal('Jane');
          done();
        })
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
          res.should.have.status(500);
          res.body.message.should.equal('Please upload a JPEG image.');          
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
          res.should.have.status(500);
          res.body.message.should.equal("Validation error: Username must be between 5 and 15 characters.");
          if(err) done(err);
          done();
        });
    });
  });
  

  describe('DELETE /user/delete', () => {
    it('should return a message when a user is deleted', (done) => {
      let token = `Bearer ${user.jwt}`;
      
      chai.request(server)
        .delete('/user/delete')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal("User successfully deleted.");
          if(err) done(err);
          done();
        });
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