'use strict';
process.env.NODE_ENV = 'test';

const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;
const User = require('../../models/sequelize').user;
const jwt = require('jsonwebtoken');

function jwtSignUser(user) {
  const oneWeek = 60 * 60 * 24 * 7;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: oneWeek
  });
}


describe('Admin', () => {
  let user;

  before(() => {
    return db.sync({force: true})
      .then(() => User.create(utils.user2))
      .then(() => {
        return Promise.all([
          User.create(utils.user3), User.create(utils.user4), User.create(utils.user5), 
          User.create(utils.user6), User.create(utils.user7), User.create(utils.user8), 
          User.create(utils.user9), User.create(utils.user10), User.create(utils.user11), 
          User.create(utils.user12)
        ]);
      })
      .then(() => {
        return User.create(utils.user);
      })
      .then(res => {
        user = {
          user: res,
          jwt: jwtSignUser(res.dataValues)
        };
        console.log(`Database, tables, and user created for tests!`)
      });
  });

  it('should get the first 5 users from oldest to newest with no offest and limit params', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/oldusers')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].id.should.equal(1);
          res.body[0].username.should.equal('jsmith');
          res.body.should.have.lengthOf(5);
          if(err) done(err);
          done();
        });
  });

  it('should get the first 10 users from oldest to newest', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/oldusers?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].id.should.equal(1);
          res.body[0].username.should.equal('jsmith');
          res.body.should.have.lengthOf(10);
          if(err) done(err);
          done();
        });
  });

  it('should get the first 5 users from newest to oldest with no offest and limit params', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/newusers')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].id.should.not.equal(1);
          res.body[0].username.should.equal('johndoe');
          res.body.should.have.lengthOf(5);
          if(err) done(err);
          done();
        });
  });

  it('should get the first 10 users from newest to oldest', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/newusers?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].id.should.not.equal(1);
          res.body[0].username.should.equal('johndoe');
          res.body.should.have.lengthOf(10);
          if(err) done(err);
          done();
        });
  });

  it('should get the first 10 users by username A to Z', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/username-a-to-z?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].id.should.equal(12);
          res.body[0].username.should.equal('johndoe');
          res.body.should.have.lengthOf(10);
          if(err) done(err);
          done();
        });
  });


  it('should get the first 10 users by username Z to A', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/username-z-to-a?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].username.should.equal('user9');
          res.body.should.have.lengthOf(10);
          if(err) done(err);
          done();
        });
  });

  it('should get the first 10 users by first name A to Z', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/firstname-a-to-z?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].firstName.should.equal('Aaaa');
          res.body.should.have.lengthOf(10);
          if(err) done(err);
          done();
        });
  });
  
  it('should get the first 10 users by first name Z to A', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/firstname-z-to-a?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].firstName.should.equal('John');
          res.body.should.have.lengthOf(10);
          if(err) done(err);
          done();
        });
  });

  it('should get the first 10 users by last name A to Z', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/lastname-a-to-z?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].lastName.should.equal('Aaaa');
          res.body.should.have.lengthOf(10);
          if(err) done(err);
          done();
        });
  });

  it('should get the first 10 users by last name Z to A', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/lastname-z-to-a?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].lastName.should.equal('Smith');
          res.body.should.have.lengthOf(10);
          if(err) done(err);
          done();
        });
  });
});
