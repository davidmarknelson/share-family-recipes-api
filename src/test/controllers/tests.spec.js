'use strict';
const db = require('../../models/sequelize').sequelize;
const Meal = require('../../models/sequelize').meal;
const User = require('../../models/sequelize').user;
const server = require("../../../app");

describe('Meal searches', () => {

  before(() => {
    return db.sync({force: true});
  });

  afterEach(() => process.env.NODE_ENV = "test");

  describe('seed', () => {
    it('should not seed the database when in development mode', (done) => {
      process.env.NODE_ENV = "development";

      chai.request(server)
        .post('/tests/seed')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('This route only exists during tests.');
          if(err) done(err);
          done();
        });
    });

    it('should not seed the database when in production mode', (done) => {
      process.env.NODE_ENV = "production";

      chai.request(server)
        .post('/tests/seed')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('This route only exists during tests.');
          if(err) done(err);
          done();
        });
    });

    it('should seed the database', (done) => {
      chai.request(server)
        .post('/tests/seed')
        .then(res => {
          res.should.have.status(200);
          res.body.message.should.equal('The database was successfully seeded.');
        })
        .then(() => Meal.findAll())
        .then(meals => expect(meals.length).to.equal(1))
        .then(() => User.findAll())
        .then(users => expect(users.length).to.equal(1))
        .then(() => done())
        .catch(err => done(err));
    });
  });

  describe('delete', () => {
    it('should not delete the database when in development mode', (done) => {
      process.env.NODE_ENV = "development";

      chai.request(server)
        .delete('/tests/delete')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('This route only exists during tests.');
          if(err) done(err);
          done();
        });
    });

    it('should not delete the database when in production mode', (done) => {
      process.env.NODE_ENV = "production";

      chai.request(server)
        .delete('/tests/delete')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('This route only exists during tests.');
          if(err) done(err);
          done();
        });
    });

    it('should delete the database when in test mode', (done) => {
      chai.request(server)
        .delete('/tests/delete')
        .then(res => {
          res.should.have.status(200);
          res.body.message.should.equal('Database has successfully been cleared.');
        })
        .then(() => Meal.findAll())
        .then(meals => expect(meals.length).to.equal(0))
        .then(() => User.findAll())
        .then(users => expect(users.length).to.equal(0))
        .then(() => done())
        .catch(err => done(err));
    });
  });
});