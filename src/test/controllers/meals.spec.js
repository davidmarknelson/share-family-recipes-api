'use strict';
process.env.NODE_ENV = 'test';

const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;
const fs = require('fs');

describe('Meals', () => {
  let user;

  before(() => {
    return db.sync({force: true})
      .then(() => utils.createAdmin())
      .then(res => user = res.body);
  });

  after(() => {
    fs.stat('public/images/mealPics/Soup.jpeg', (err, stats) => {
      if (stats) {
        fs.unlink('public/images/mealPics/Soup.jpeg', (err) => {
          if (err) console.log(err);
        });
      }
    });
  });

  describe('POST create meal', () => {
    it('should return an error messsage if the uploaded image is PNG', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .field('name', 'Sandwich')
        .field('ingredients', JSON.stringify(['bread', 'cheese', 'meat']))
        .field('instructions', JSON.stringify([
          'Put the bread on the counter.', 
          'Put the meat between 2 slices of bread.', 
          'Put the cheese on the meat.'
        ]))
        .field('prepTime', 5)
        .field('cookTime', 0)
        .field('difficulty', 1)
        .attach('mealPic', 'src/test/testImages/testMealPng.png')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('Please upload a JPEG image.');
          if(err) done(err);
          done();
        });
    });

    it('should return a new meal', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .field('name', 'Meat and Cheese Sandwich')
        .field('ingredients', JSON.stringify(['bread', 'cheese', 'meat']))
        .field('instructions', JSON.stringify([
          'Put the bread on the counter.', 
          'Put the meat between 2 slices of bread.', 
          'Put the cheese on the meat.'
        ]))
        .field('prepTime', 5)
        .field('cookTime', 0)
        .field('difficulty', 1)
        .attach('mealPic', 'src/test/testImages/testMealJpeg.jpeg')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.name.should.equal("Meat and Cheese Sandwich");
          res.body.id.should.equal(1)
          res.body.ingredients.should.be.an('array');
          res.body.ingredients.should.have.lengthOf(3);
          res.body.instructions.should.be.an('array');
          res.body.instructions.should.have.lengthOf(3);
          res.body.mealPic.should.equal('public/images/mealPics/Meat-and-Cheese-Sandwich.jpeg');
          if(err) done(err);
          done();
        });
    });

    it('should return a new meal with lowercase ingredients when received ingredients are uppercase', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .field('name', 'Soup')
        .field('ingredients', JSON.stringify(['WATER', 'VEGETABLES', 'MEAT']))
        .field('instructions', JSON.stringify([
          'Cut the veggies.', 
          'Boil the water.', 
          'Put veggies and meat in the water until it is cooked.'
        ]))
        .field('prepTime', 10)
        .field('cookTime', 20)
        .field('difficulty', 3)
        .attach('mealPic', 'src/test/testImages/testMealJpeg.jpeg')
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


    it('should return an error when the meal name is already being used', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .field('name', 'Meat and Cheese Sandwich')
        .field('ingredients', JSON.stringify(['bread', 'cheese', 'meat']))
        .field('instructions', JSON.stringify([
          'Put the bread on the counter.', 
          'Put the meat between 2 slices of bread.', 
          'Put the cheese on the meat.'
        ]))
        .field('prepTime', 5)
        .field('cookTime', 0)
        .field('difficulty', 1)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('This meal name is already in use.');
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
    it('should return an error message when the uploaded picture is PNG', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/meals/update')
        .set("Authorization", token)
        .field('id', 1)
        .field('name', 'Meat and Cheese Sandwich')
        .field('ingredients', JSON.stringify(['bread', 'cheese', 'lettuce', 'meat']))
        .field('instructions', JSON.stringify([
          'Put the bread on the counter.', 
          'Put the meat between 2 slices of bread.', 
          'Put the cheese and lettuce on the meat.'
        ]))
        .field('prepTime', 5)
        .field('cookTime', 0)
        .field('difficulty', 1)
        .attach('mealPic', 'src/test/testImages/testMealPng.png')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('Please upload a JPEG image.');
          if(err) done(err);
          done();
        });
    });

    it('should return a success message when the meal is updated', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/meals/update')
        .set("Authorization", token)
        .field('id', 1)
        .field('name', 'Sandwich')
        .field('ingredients', JSON.stringify(['bread', 'cheese', 'lettuce', 'meat']))
        .field('instructions', JSON.stringify([
          'Put the bread on the counter.', 
          'Put the meat between 2 slices of bread.', 
          'Put the cheese and lettuce on the meat.'
        ]))
        .field('prepTime', 5)
        .field('cookTime', 0)
        .field('difficulty', 1)
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
        .send({ name: 'Meat and Cheese Sandwich' })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('There was an error deleting your meal.');
          if(err) done(err);
          done();
        });
    });
  });

});