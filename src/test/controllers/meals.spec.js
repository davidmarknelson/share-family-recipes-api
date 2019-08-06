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

  describe('GET specific meal', () => {
    it('should return a meal', (done) => {
      chai.request(server)
        .get('/meals/meal?name=Soup')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name', 'Soup');
          res.body.creator.username.should.equal('jsmith');
          if(err) done(err);
          done();
        });
    });

    it('should return an error message when there is no meal that matches the query', (done) => {
      chai.request(server)
        .get('/meals/meal?name=coffee')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('There was an error getting the meal.');
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

    it('should return a new meal with lowercase ingredients', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send(utils.meal4)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.name.should.equal("Chicken and Cheese");
          res.body.ingredients.should.be.an('array');
          res.body.ingredients.should.have.lengthOf(2);
          res.body.ingredients[0].should.equal('chicken');
          res.body.ingredients[1].should.equal('cheese');
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
          res.body.message.should.equal('Meal successfully updated.');
          if(err) done(err);
          done();
        });
    });
  });

  describe('DELETE meal', () => {
    it('should return a success message when the meal is deleted', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .delete('/meals/delete')
        .set("Authorization", token)
        .send({ name: 'Sandwich' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Meal successfully deleted.');
          if(err) done(err);
          done();
        });
    });

    it('should return an error message when there is no meal to delelte', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .delete('/meals/delete')
        .set("Authorization", token)
        .send({ name: 'Sandwich' })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('There was an error deleting your meal.');
          if(err) done(err);
          done();
        });
    });
  });

});