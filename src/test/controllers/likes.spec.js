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
      .then(() => Meals.create(utils.meal1))
      .then(() => console.log(`Database, tables, and user created for tests!`));
  });

  describe('POST add like', () => {
    it('should return a message when a meal is successfully liked', (done) => {
      let token = `Bearer ${user.jwt}`;
      
      chai.request(server)
      .post('/likes/add')
      .set("Authorization", token)
      .send({mealId: 1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('Meal successfully liked.');
        if(err) done(err);
        done();
      });
    });

    it('should return a message when a meal is unsuccessfully liked', (done) => {
      let token = `Bearer ${user.jwt}`;
      
      chai.request(server)
      .post('/likes/add')
      .set("Authorization", token)
      .send({mealId: 2})
      .end((err, res) => {
        res.should.have.status(500);
        res.body.message.should.equal('There was an error liking the meal.');
        if(err) done(err);
        done();
      });
    });
  });

  describe('DELETE remove like', () => {
    it('should return a message when a meal is successfully unliked', (done) => {
      let token = `Bearer ${user.jwt}`;
      
      chai.request(server)
      .delete('/likes/remove')
      .set("Authorization", token)
      .send({mealId: 1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('Meal successfully unliked.');
        if(err) done(err);
        done();
      });
    });

    it('should return a message when a meal is unsuccessfully unliked', (done) => {
      let token = `Bearer ${user.jwt}`;
      
      chai.request(server)
      .delete('/likes/remove')
      .set("Authorization", token)
      .send({mealId: 2})
      .end((err, res) => {
        res.should.have.status(500);
        res.body.message.should.equal('There was an error unliking the meal.');
        if(err) done(err);
        done();
      });
    });
  });
});