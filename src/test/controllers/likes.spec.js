'use strict';
const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;

describe('Likes', () => {
  let user;
  before(() => {
    return db.sync({force: true})
      .then(() => utils.createAdmin())
      .then(res => user = res.body)
      .then(() => utils.createMeal1(user.jwt));
  });

  describe('POST add like', () => {
    it('should return a message when a meal is successfully liked.', (done) => {
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

    it('should return a message when a meal is unsuccessfully liked because the mealId does not exist', (done) => {
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

    it('should return an error message when the meal has already been liked', (done) => {
      let token = `Bearer ${user.jwt}`;
      
      chai.request(server)
      .post('/likes/add')
      .set("Authorization", token)
      .send({mealId: 1})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.message.should.equal('You have already liked this meal.');
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

    it('should return a message when a meal is unsuccessfully unliked because the mealId does not exist', (done) => {
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