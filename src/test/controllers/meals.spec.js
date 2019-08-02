'use strict';
process.env.NODE_ENV = 'test';

const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;
const User = require('../../models/sequelize').user;
const Meals = require('../../models/sequelize').meal;
const jwt = require('jsonwebtoken');

function jwtSignUser(user) {
  const oneWeek = 60 * 60 * 24 * 7;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: oneWeek
  });
}

describe('Meals', () => {
  let user;
  before(() => {
    return db.sync({force: true})
      .then(() => User.create(utils.user))
      .then(res => {
        user = {
          user: res,
          jwt: jwtSignUser(res.dataValues)
        };
      })
      .then(() => User.create(utils.user2))
      .then(() => Meals.create(utils.meal1))
      .then(() => Meals.create(utils.meal2))
      .then(() => console.log(`Database, tables, and user created for tests!`));
  });

  describe('GET all meals', () => {
    it('should return meals by newest', (done) => {
      chai.request(server)
        .get('/meals/newest?offset=0&limit=10')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.should.have.lengthOf(2);
          res.body[0].creator.username.should.equal('jsmith');
          res.body[0].name.should.equal('Soup');
          res.body[0].should.have.property('creator');
          res.body[0].creatorId.should.equal(2);
          res.body[1].creator.username.should.equal('johndoe');
          res.body[1].name.should.equal('Sandwich');
          res.body[1].should.have.property('creator');
          res.body[1].creatorId.should.equal(1);
          if(err) done(err);
          done();
        });
    });

    it('should return meals by oldest', (done) => {
      chai.request(server)
        .get('/meals/oldest?offset=0&limit=10')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.should.have.lengthOf(2);
          res.body[1].creator.username.should.equal('jsmith');
          res.body[1].name.should.equal('Soup');
          res.body[1].should.have.property('creator');
          res.body[1].creatorId.should.equal(2);
          res.body[0].creator.username.should.equal('johndoe');
          res.body[0].name.should.equal('Sandwich');
          res.body[0].should.have.property('creator');
          res.body[0].creatorId.should.equal(1);
          if(err) done(err);
          done();
        });
    });

  });

  describe('GET available meal name', () => {
    it('should return an error message if the meal name is taken', (done) => {
      chai.request(server)
        .get('/meals/available?name=Soup')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('That name is already taken.');
          if(err) done(err);
          done();
        });
    });

    it('should return a success message if the meal name is available', (done) => {
      chai.request(server)
        .get('/meals/available?name=coffee')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('That name is available.');
          if(err) done(err);
          done();
        });
    });
  });

  describe('POST create meal', () => {
    it('should return a new meal', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send(utils.meal3)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.name.should.equal("Rice");
          res.body.ingredients.should.be.an('array');
          res.body.ingredients.should.have.lengthOf(2);
          if(err) done(err);
          done();
        });
    });
  });

  describe('PUT update meal', () => {
    it('should return a success message when the meal is updated', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/meals/update')
        .set("Authorization", token)
        .send(utils.meal3Update)
        .end((err, res) => {
          res.should.have.status(200);
          // res.body.name.should.equal("Rice and spicy sauce");
          // res.body.ingredients.should.be.an('array');
          // res.body.ingredients.should.have.lengthOf(2);
          if(err) done(err);
          done();
        });
    });
  });

});