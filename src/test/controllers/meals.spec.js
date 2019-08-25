'use strict';
process.env.NODE_ENV = 'test';

const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;

describe('Meals', () => {
  let user;

  before(() => {
    return db.sync({force: true})
      .then(() => utils.createAdmin())
      .then(res => user = res.body);
  });

  describe('POST create meal', () => {
    it('should return a new meal', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send(utils.meal1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.name.should.equal("Sandwich");
          res.body.ingredients.should.be.an('array');
          res.body.ingredients.should.have.lengthOf(3);
          if(err) done(err);
          done();
        });
    });

    it('should return a new meal with lowercase ingredients when received ingredients are uppercase', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send(utils.meal2)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.name.should.equal("Soup");
          res.body.ingredients.should.be.an('array');
          res.body.ingredients.should.have.lengthOf(3);
          res.body.ingredients[0].should.equal('water');
          res.body.ingredients[1].should.equal('vegetables');
          res.body.ingredients[2].should.equal('meat');
          res.body.id.should.equal(2);
          if(err) done(err);
          done();
        });
    });
  });

  describe('GET specific meal', () => {
    it('should return a meal', (done) => {
      chai.request(server)
        .get('/meals/meal?name=Soup')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name', 'Soup');
          res.body.creator.username.should.equal('johndoe');
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

  describe('PUT update meal', () => {
    it('should return a success message when the meal is updated', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/meals/update')
        .set("Authorization", token)
        .send(utils.meal1Update)
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

    it('should return an error message when there is no meal to delete', (done) => {
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