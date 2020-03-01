'use strict';
const db = require('../../models/sequelize').sequelize;
const server = require("../../../app");
const utils = require("../utils");

describe('Likes', () => {
  let user;
  before(() => {
    return db.sync({ force: true })
      .then(() => utils.createAdmin())
      .then(res => user = res.body)
      .then(() => utils.createMeal1(user.jwt))
      .then(() => utils.createMeal2(user.jwt));
  });

  describe('POST add like', () => {
    it('should return a message when a meal is successfully liked.', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/likes/add')
        .set("Authorization", token)
        .send({ recipeId: 1 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.not.have.property('message');
          res.body.should.be.an('array');
          res.body[0].userId.should.equal(1);
          if (err) done(err);
          done();
        });
    });

    it('should return a message when a meal is unsuccessfully liked because the mealId does not exist', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/likes/add')
        .set("Authorization", token)
        .send({ recipeId: 3 })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('There was an error liking this recipe.');
          if (err) done(err);
          done();
        });
    });

    it('should return an error message when the meal has already been liked', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/likes/add')
        .set("Authorization", token)
        .send({ recipeId: 1 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('You have already liked this recipe.');
          if (err) done(err);
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
        .send({ recipeId: 1 })
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.not.have.property('message');
          if (err) done(err);
          done();
        });
    });

    it('should return a message when a meal is unsuccessfully unliked because the mealId does not exist', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .delete('/likes/remove')
        .set("Authorization", token)
        .send({ recipeId: 3 })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('There was an error unliking this recipe.');
          if (err) done(err);
          done();
        });
    });
  });
});