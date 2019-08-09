'use strict';
process.env.NODE_ENV = 'test';

const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;
const User = require('../../models/sequelize').user;
const Meals = require('../../models/sequelize').meal;
const savedMeals = require('../../models/sequelize').saved_meal;
const jwt = require('jsonwebtoken');

function jwtSignUser(user) {
  const oneWeek = 60 * 60 * 24 * 7;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: oneWeek
  });
}

describe.only('Meals', () => {
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

  describe('GET user saved meals', () => {
    it('should return an array with the meals', (done) => {
      let token = `Bearer ${user.jwt}`;
      
      chai.request(server)
      .get('/savedmeals/find')
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.message.should.equal('You have not saved any meals.');
        if(err) done(err);
        done();
      });
    });
  })

  describe('POST save meal', () => {
    it('should return a message when a meal is successfully saved', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
      .post('/savedmeals/save')
      .set("Authorization", token)
      .send({ mealId: 1 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('Meal successfully saved.');
        if(err) done(err);
        done();
      });
    });
  });

  describe('GET user saved meals', () => {
    it('should return an array with the meals', (done) => {
      let token = `Bearer ${user.jwt}`;
      
      chai.request(server)
      .get('/savedmeals/find')
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.have.lengthOf(1);
        res.body[0].meal.name.should.equal('Sandwich');
        if(err) done(err);
        done();
      });
    });
  });

  describe('DELETE save meal', () => {
    it('should return a message when a meal is successfully unsaved', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
      .delete('/savedmeals/unsave')
      .set("Authorization", token)
      .send({ mealId: 1 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('Meal successfully unsaved.');
        if(err) done(err);
        done();
      });
    });
  });

});