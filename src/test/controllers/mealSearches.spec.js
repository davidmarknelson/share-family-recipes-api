'use strict';
const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;

describe('Meal searches', () => {
  let jwt;
  before(() => {
    return db.sync({force: true})
      .then(() => utils.createAdmin())
      .then(res => jwt = res.body.jwt)
      .then(() => utils.createUser())
      .then(() => utils.createMeal1(jwt))
      .then(() => utils.createMeal2(jwt));
  });

  describe('GET all meals', () => {
    it('should return meals by newest and total meal count', (done) => {
      chai.request(server)
        .get('/meals/search/newest?offset=0&limit=10')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(2);
          res.body.rows[0].creator.username.should.equal('johndoe');
          res.body.rows[0].creator.should.have.property('profilePic', null);
          res.body.rows[0].creatorId.should.equal(1);
          res.body.rows[0].should.have.property('mealPic', null);
          res.body.rows[0].name.should.equal('Soup');
          res.body.rows[0].should.have.property('likes');
          res.body.rows[0].likes.should.be.an('array');
          res.body.rows[0].prepTime.should.equal(10);
          res.body.rows[0].cookTime.should.equal(20);
          res.body.rows[0].should.not.have.property('ingredients');
          res.body.rows[0].should.not.have.property('instructions');
          res.body.rows[0].should.not.have.property('updatedAt');
          res.body.rows[0].should.not.have.property('createdAt');
          res.body.rows[1].creator.username.should.equal('johndoe');
          res.body.rows[1].name.should.equal('Sandwich');
          res.body.rows[1].should.have.property('creator');
          res.body.rows[1].should.have.property('likes');
          if(err) done(err);
          done();
        });
    });

    it('should return meals by oldest and total meal count', (done) => {
      chai.request(server)
        .get('/meals/search/oldest?offset=0&limit=10')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(2);
          res.body.rows[1].creator.username.should.equal('johndoe');
          res.body.rows[1].creator.should.have.property('profilePic', null);
          res.body.rows[1].creatorId.should.equal(1);
          res.body.rows[1].should.have.property('mealPic', null);
          res.body.rows[1].name.should.equal('Soup');
          res.body.rows[1].should.have.property('likes');
          res.body.rows[1].likes.should.be.an('array');
          res.body.rows[1].prepTime.should.equal(10);
          res.body.rows[1].cookTime.should.equal(20);
          res.body.rows[1].should.not.have.property('ingredients');
          res.body.rows[1].should.not.have.property('instructions');
          res.body.rows[1].should.not.have.property('updatedAt');
          res.body.rows[1].should.not.have.property('createdAt');
          res.body.rows[0].creator.username.should.equal('johndoe');
          res.body.rows[0].name.should.equal('Sandwich');
          res.body.rows[0].should.have.property('creator');
          res.body.rows[0].should.have.property('likes');
          if(err) done(err);
          done();
        });
    });

  });

  describe('GET all meals', () => {
    it('should return meals A to Z and total meal count', (done) => {
      chai.request(server)
        .get('/meals/search/names-a-z?offset=0&limit=10')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(2);
          res.body.rows[1].creator.username.should.equal('johndoe');
          res.body.rows[1].creator.should.have.property('profilePic', null);
          res.body.rows[1].creatorId.should.equal(1);
          res.body.rows[1].should.have.property('mealPic', null);
          res.body.rows[1].name.should.equal('Soup');
          res.body.rows[1].should.have.property('likes');
          res.body.rows[1].likes.should.be.an('array');
          res.body.rows[1].prepTime.should.equal(10);
          res.body.rows[1].cookTime.should.equal(20);
          res.body.rows[1].should.not.have.property('ingredients');
          res.body.rows[1].should.not.have.property('instructions');
          res.body.rows[1].should.not.have.property('updatedAt');
          res.body.rows[1].should.not.have.property('createdAt');
          res.body.rows[0].creator.username.should.equal('johndoe');
          res.body.rows[0].name.should.equal('Sandwich');
          res.body.rows[0].should.have.property('creator');
          res.body.rows[0].should.have.property('likes');
          if(err) done(err);
          done();
        });
    });

    it('should return meals Z to A and total meal count.rows', (done) => {
      chai.request(server)
        .get('/meals/search/names-z-a?offset=0&limit=10')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(2);
          res.body.rows[0].creator.username.should.equal('johndoe');
          res.body.rows[0].creator.should.have.property('profilePic', null);
          res.body.rows[0].creatorId.should.equal(1);
          res.body.rows[0].should.have.property('mealPic', null);
          res.body.rows[0].name.should.equal('Soup');
          res.body.rows[0].should.have.property('likes');
          res.body.rows[0].likes.should.be.an('array');
          res.body.rows[0].prepTime.should.equal(10);
          res.body.rows[0].cookTime.should.equal(20);
          res.body.rows[0].should.not.have.property('ingredients');
          res.body.rows[0].should.not.have.property('instructions');
          res.body.rows[0].should.not.have.property('updatedAt');
          res.body.rows[0].should.not.have.property('createdAt');
          res.body.rows[1].creator.username.should.equal('johndoe');
          res.body.rows[1].name.should.equal('Sandwich');
          res.body.rows[1].should.have.property('creator');
          res.body.rows[1].should.have.property('likes');
          if(err) done(err);
          done();
        });
    });

  });

  describe('GET all meals the match ingredients', () => {
    it('should return meals containing specified ingredients A to Z by name', (done) => {
      chai.request(server)
        .get('/meals/search/byingredients-a-z?ingredient=meat')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(2);
          res.body.rows[0].creator.username.should.equal('johndoe');
          res.body.rows[0].name.should.equal('Sandwich');
          res.body.rows[0].should.have.property('creator');
          res.body.rows[0].should.have.property('likes');
          res.body.rows[1].creator.username.should.equal('johndoe');
          res.body.rows[1].creator.should.have.property('profilePic', null);
          res.body.rows[1].creatorId.should.equal(1);
          res.body.rows[1].should.have.property('mealPic', null);
          res.body.rows[1].name.should.equal('Soup');
          res.body.rows[1].should.have.property('likes');
          res.body.rows[1].likes.should.be.an('array');
          res.body.rows[1].prepTime.should.equal(10);
          res.body.rows[1].cookTime.should.equal(20);
          res.body.rows[1].should.not.have.property('ingredients');
          res.body.rows[1].should.not.have.property('instructions');
          res.body.rows[1].should.not.have.property('updatedAt');
          res.body.rows[1].should.not.have.property('createdAt');
          if(err) done(err);
          done();
        });
    });

    it('should return meals containing specified ingredients A to Z by name', (done) => {
      chai.request(server)
        .get('/meals/search/byingredients-z-a?ingredient=meat')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(2);
          res.body.rows[1].creator.username.should.equal('johndoe');
          res.body.rows[1].name.should.equal('Sandwich');
          res.body.rows[1].should.have.property('creator');
          res.body.rows[1].should.have.property('likes');
          res.body.rows[0].creator.username.should.equal('johndoe');
          res.body.rows[0].creator.should.have.property('profilePic', null);
          res.body.rows[0].creatorId.should.equal(1);
          res.body.rows[0].should.have.property('mealPic', null);
          res.body.rows[0].name.should.equal('Soup');
          res.body.rows[0].should.have.property('likes');
          res.body.rows[0].likes.should.be.an('array');
          res.body.rows[0].prepTime.should.equal(10);
          res.body.rows[0].cookTime.should.equal(20);
          res.body.rows[0].should.not.have.property('ingredients');
          res.body.rows[0].should.not.have.property('instructions');
          res.body.rows[0].should.not.have.property('updatedAt');
          res.body.rows[0].should.not.have.property('createdAt');
          if(err) done(err);
          done();
        });
    });

    it('should return meals containing specified case insensitive ingredients', (done) => {
      chai.request(server)
        .get('/meals/search/byingredients-a-z?ingredient=Water')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(1);        
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(1);
          res.body.rows[0].creator.username.should.equal('johndoe');
          res.body.rows[0].creator.should.have.property('profilePic', null);
          res.body.rows[0].creatorId.should.equal(1);
          res.body.rows[0].should.have.property('mealPic', null);
          res.body.rows[0].name.should.equal('Soup');
          res.body.rows[0].should.have.property('likes');
          res.body.rows[0].likes.should.be.an('array');
          res.body.rows[0].prepTime.should.equal(10);
          res.body.rows[0].cookTime.should.equal(20);
          res.body.rows[0].should.not.have.property('ingredients');
          res.body.rows[0].should.not.have.property('instructions');
          res.body.rows[0].should.not.have.property('updatedAt');
          res.body.rows[0].should.not.have.property('createdAt');
          if(err) done(err);
          done();
        });
    });

    it('should return meals containing multiple ingredients', (done) => {
      chai.request(server)
        .get('/meals/search/byingredients-a-z?ingredient=water&ingredient=meat')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(1);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(1);
          res.body.rows[0].creator.username.should.equal('johndoe');
          res.body.rows[0].creator.should.have.property('profilePic', null);
          res.body.rows[0].creatorId.should.equal(1);
          res.body.rows[0].should.have.property('mealPic', null);
          res.body.rows[0].name.should.equal('Soup');
          res.body.rows[0].should.have.property('likes');
          res.body.rows[0].likes.should.be.an('array');
          res.body.rows[0].prepTime.should.equal(10);
          res.body.rows[0].cookTime.should.equal(20);
          res.body.rows[0].should.not.have.property('ingredients');
          res.body.rows[0].should.not.have.property('instructions');
          res.body.rows[0].should.not.have.property('updatedAt');
          res.body.rows[0].should.not.have.property('createdAt');       
          if(err) done(err);
          done();
        });
    });

    it('should return meals containing multiple ingredients where an ingredient is only part of the word', (done) => {
      chai.request(server)
        .get('/meals/search/byingredients-a-z?ingredient=water&ingredient=veget')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(1);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(1);
          res.body.rows[0].creator.username.should.equal('johndoe');
          res.body.rows[0].creator.should.have.property('profilePic', null);
          res.body.rows[0].creatorId.should.equal(1);
          res.body.rows[0].should.have.property('mealPic', null);
          res.body.rows[0].name.should.equal('Soup');
          res.body.rows[0].should.have.property('likes');
          res.body.rows[0].likes.should.be.an('array');
          res.body.rows[0].prepTime.should.equal(10);
          res.body.rows[0].cookTime.should.equal(20);
          res.body.rows[0].should.not.have.property('ingredients');
          res.body.rows[0].should.not.have.property('instructions');
          res.body.rows[0].should.not.have.property('updatedAt');
          res.body.rows[0].should.not.have.property('createdAt');      
          if(err) done(err);
          done();
        });
    });

    it('should return an error message when there are no ingredients in the search', (done) => {
      chai.request(server)
        .get('/meals/search/byingredients-a-z')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('You must add ingredients to the search.');
          if(err) done(err);
          done();
        });
    });

    it('should return an error message when no meals match the search', (done) => {
      chai.request(server)
        .get('/meals/search/byingredients-a-z?ingredient=beef')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('There are no meals with those ingredients.');
          if(err) done(err);
          done();
        });
    });

  });

  describe('GET all meals by username', () => {
    it('should return all meals created by a specific user', (done) => {
      chai.request(server)
        .get('/meals/search/byuser?username=johndoe&offset=0&limit=10')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.id.should.equal(1);
          res.body.username.should.equal('johndoe');
          res.body.should.have.property('profilePic', null);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(2);
          res.body.rows[0].creator.username.should.equal('johndoe');
          res.body.rows[0].creator.should.have.property('profilePic', null);
          res.body.rows[0].creatorId.should.equal(1);
          res.body.rows[0].should.have.property('mealPic', null);
          res.body.rows[0].name.should.equal('Sandwich');
          res.body.rows[0].should.have.property('likes');
          res.body.rows[0].likes.should.be.an('array');
          res.body.rows[0].prepTime.should.equal(5);
          res.body.rows[0].cookTime.should.equal(0);
          res.body.rows[0].should.not.have.property('ingredients');
          res.body.rows[0].should.not.have.property('instructions');
          res.body.rows[0].should.not.have.property('updatedAt');
          res.body.rows[0].should.not.have.property('createdAt');
          if(err) done(err);
          done();
        });
    });

    it('should return an error message when the user does not exist', (done) => {
      chai.request(server)
        .get('/meals/search/byuser?username=jasonsmith&offset=0&limit=10')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('This user does not exist.');
          if(err) done(err);
          done();
        });
    });

    it('should return an empty rows array when the user has not created any meals', (done) => {
      chai.request(server)
        .get('/meals/search/byuser?username=jsmith&offset=0&limit=10')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.id.should.equal(2);
          res.body.username.should.equal('jsmith');
          res.body.should.have.property('profilePic', null);
          res.body.count.should.equal(0);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(0);
          if(err) done(err);
          done();
        });
    });
  });

  describe('GET available meal name', () => {
    it('should return an error message if the meal name is taken', (done) => {
      chai.request(server)
        .get('/meals/search/available-names?name=Soup')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('That name is already taken.');
          if(err) done(err);
          done();
        });
    });

    it('should return an error message if the case insensitive meal name is taken', (done) => {
      chai.request(server)
        .get('/meals/search/available-names?name=soup')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('That name is already taken.');
          if(err) done(err);
          done();
        });
    });

    it('should return a success message if the meal name is available', (done) => {
      chai.request(server)
        .get('/meals/search/available-names?name=coffee')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('That name is available.');
          if(err) done(err);
          done();
        });
    });
  });

  describe('GET array of searched meals', () => {
    it('should return an array of meals that match the searched word', (done) => {
      chai.request(server)
        .get('/meals/search/name?name=s')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.should.have.lengthOf(2);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Sandwich');
          res.body[1].should.have.property('id');
          res.body[1].should.have.property('name');
          res.body[1].name.should.equal('Soup');
          if(err) done(err);
          done();
        });
    });
  });
});