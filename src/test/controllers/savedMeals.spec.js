'use strict';
const db = require('../../models/sequelize').sequelize;
const server = require("../../../app");
const utils = require("../utils");

describe('Saved meals', () => {
  let token;
  let user;

  before(() => {
    return db.sync({force: true})
      .then(() => utils.createAdmin())
      .then(res => {
        token = `Bearer ${res.body.jwt}`;
        user = res.body;
      })
      .then(() => utils.createMeal1(user.jwt));
  });

  describe('GET user saved meals', () => {
    it('should return an array with the meals', (done) => {
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
  });

  describe('POST save meal', () => {
    it('should return a message when a meal is successfully saved', (done) => {
      chai.request(server)
      .post('/savedmeals/save')
      .set("Authorization", token)
      .send({ mealId: 1 })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.message.should.equal('Meal successfully saved.');
        if(err) done(err);
        done();
      });
    });
  });

  describe('GET user saved meals', () => {
    it('should return an array with the meals', (done) => {
      chai.request(server)
        .get('/savedmeals/find')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(1);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(1);
          res.body.rows[0].id.should.equal(1);
          res.body.rows[0].name.should.equal('Sandwich');
          res.body.rows[0].difficulty.should.equal(1);
          res.body.rows[0].should.have.property('mealPic', null);
          res.body.rows[0].cookTime.should.equal(5);
          res.body.rows[0].creatorId.should.equal(1);
          res.body.rows[0].creator.username.should.equal('johndoe');
          res.body.rows[0].creator.should.have.property('profilePic', null);
          res.body.rows[0].likes.should.be.an('array');
          if(err) done(err);
          done();
        });
    });
  });

  describe('DELETE save meal', () => {
    it('should return a message when a meal is successfully unsaved', (done) => {
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