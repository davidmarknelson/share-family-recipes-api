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
      .then(() => utils.createMeal1(user.jwt))
      .then(() => utils.createMeal2(user.jwt));
  });

  describe('GET user saved meals', () => {
    it('should return an array with the meals', (done) => {
      chai.request(server)
      .get('/saved/a-z')
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
      .post('/saved/save')
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
        .post('/saved/save')
        .set("Authorization", token)
        .send({ mealId: 2 })
      .then(() => chai.request(server)
        .get('/saved/a-z')
        .set("Authorization", token))
      .then(res => {
        res.should.have.status(200);
        res.body.count.should.equal(2);
        res.body.rows.should.be.an('array');
        res.body.rows.should.have.lengthOf(2);
        res.body.rows[0].id.should.equal(1);
        res.body.rows[0].name.should.equal('Sandwich');
        res.body.rows[0].difficulty.should.equal(1);
        res.body.rows[0].should.have.property('mealPic', null);
        res.body.rows[0].cookTime.should.equal(5);
        res.body.rows[0].creatorId.should.equal(1);
        res.body.rows[0].creator.username.should.equal('johndoe');
        res.body.rows[0].likes.should.be.an('array');
        done();
      })
      .catch(err => done(err));
    });

    it('should return an array with the meals', (done) => {
      chai.request(server)
        .get('/saved/z-a')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(2);
          res.body.rows[1].id.should.equal(1);
          res.body.rows[1].name.should.equal('Sandwich');
          res.body.rows[1].difficulty.should.equal(1);
          res.body.rows[1].should.have.property('mealPic', null);
          res.body.rows[1].cookTime.should.equal(5);
          res.body.rows[1].creatorId.should.equal(1);
          res.body.rows[1].creator.username.should.equal('johndoe');
          res.body.rows[1].likes.should.be.an('array');
          if(err) done(err);
          done();
        });
    });
  });

  describe('DELETE save meal', () => {
    it('should return a message when a meal is successfully unsaved', (done) => {
      chai.request(server)
        .delete('/saved/unsave')
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