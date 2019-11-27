'use strict';
const db = require('../../models/sequelize').sequelize;
const server = require("../../../app");
const utils = require("../utils");
// Models to check database for data
const SavedMeal = require('../../models/sequelize').saved_meal;
const Like = require('../../models/sequelize').like;
const Meal = require('../../models/sequelize').meal;
const MealPic = require('../../models/sequelize').meal_pic;

describe('Meals', () => {
  let user;

  before(() => {
    return db.sync({force: true})
      .then(() => utils.createAdmin())
      .then(res => user = res.body);
  });

  describe('POST create meal', () => {
    it('should return an error messsage if the uploaded image is PNG', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .field('name', 'Sandwich')
        .field('description', 'An easy sandwich for those busy days!')
        .field('ingredients', JSON.stringify(['bread', 'cheese', 'meat']))
        .field('instructions', JSON.stringify([
          'Put the bread on the counter.', 
          'Put the meat between 2 slices of bread.', 
          'Put the cheese on the meat.'
        ]))
        .field('cookTime', 5)
        .field('difficulty', 1)
        .attach('mealPic', 'src/test/testImages/testMealPng.png')
        .end((err, res) => {
          res.should.have.status(415);
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
        .field('description', 'An easy sandwich for those busy days!')
        .field('ingredients', JSON.stringify(['bread', 'cheese', 'meat']))
        .field('instructions', JSON.stringify([
          'Put the bread on the counter.', 
          'Put the meat between 2 slices of bread.', 
          'Put the cheese on the meat.'
        ]))
        .field('cookTime', 5)
        .field('difficulty', 1)
        .field('originalRecipeUrl', 'www.testrecipe.com')
        .field('youtubeUrl', 'www.testvideo.com')
        .attach('mealPic', 'src/test/testImages/testMealJpeg.jpeg')
        .then(res => {
          res.should.have.status(201);
          res.body.id.should.equal(1);
          res.body.message.should.equal('Meal successfully created.')
        })
        .then(() => Meal.findOne({ 
          where: { id: 1 },
          include: [
            { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false },
          ]
        }))
        .then(meal => {
          meal.name.should.equal("Meat and Cheese Sandwich");
          meal.id.should.equal(1)
          meal.should.have.property('description');
          meal.should.have.property('originalRecipeUrl', 'www.testrecipe.com');
          meal.should.have.property('youtubeUrl', 'www.testvideo.com');
          meal.ingredients.should.be.an('array');
          meal.instructions.should.be.an('array');
          meal.mealPic.should.have.property('mealPicName');
        })
        .then(() => done())
        .catch(err => done(err));
    });

    it('should return a new meal with lowercase ingredients when received ingredients are uppercase', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .field('name', 'Soup')
        .field('description', 'A tasty soup for a cold day!')
        .field('ingredients', JSON.stringify(['WATER', 'VEGETABLES', 'MEAT']))
        .field('instructions', JSON.stringify([
          'Cut the veggies.', 
          'Boil the water.', 
          'Put veggies and meat in the water until it is cooked.'
        ]))
        .field('cookTime', 20)
        .field('difficulty', 3)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.id.should.equal(2);
          res.body.message.should.equal('Meal successfully created.')
          if(err) done(err);
          done();
        });
    });

    it('should return an error if the description is too long', (done) => {
      let token = `Bearer ${user.jwt}`;

      let msg = function() {
        let string = '';
        for (let i = 0; i < 151; i++) {
          string = string + 'a';
        }
        return string;
      }

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .field('name', 'Soup')
        .field('description', msg())
        .field('ingredients', JSON.stringify(['WATER', 'VEGETABLES', 'MEAT']))
        .field('instructions', JSON.stringify([
          'Cut the veggies.', 
          'Boil the water.', 
          'Put veggies and meat in the water until it is cooked.'
        ]))
        .field('cookTime', 20)
        .field('difficulty', 3)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('The description has a max of 150 characters.')
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
        .field('description', 'An easy sandwich for those busy days!')
        .field('ingredients', JSON.stringify(['bread', 'cheese', 'meat']))
        .field('instructions', JSON.stringify([
          'Put the bread on the counter.', 
          'Put the meat between 2 slices of bread.', 
          'Put the cheese on the meat.'
        ]))
        .field('cookTime', 5)
        .field('difficulty', 1)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('This recipe name is already taken.');
          if(err) done(err);
          done();
        });
    });
  });

  describe('GET available meal name', () => {
    it('should return an error message if the meal name is taken', (done) => {
      chai.request(server)
        .get('/meals/available-names?name=Soup')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.not.have.property('message');
          if(err) done(err);
          done();
        });
    });

    it('should return an error message if the case insensitive meal name is taken', (done) => {
      chai.request(server)
        .get('/meals/available-names?name=soup')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.not.have.property('message');          
          if(err) done(err);
          done();
        });
    });

    it('should return a success message if the meal name is available', (done) => {
      chai.request(server)
        .get('/meals/available-names?name=coffee')
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.not.have.property('message');          
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
          res.body.ingredients.should.be.an('array');
          res.body.instructions.should.be.an('array');
          if(err) done(err);
          done();
        });
    });

    it('should return a meal regardless of capitalization', (done) => {
      chai.request(server)
        .get('/meals/meal?name=soUp')
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
          res.body.message.should.equal('That meal does not exist.');
          if(err) done(err);
          done();
        });
    });
  });

  describe('PUT update meal', () => {
    it('should return an error message when updated name is already taken', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/meals/update')
        .set("Authorization", token)
        .field('id', 1)
        .field('name', 'Soup')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('This meal name is already taken.');
          if(err) done(err);
          done();
        });
    });

    it('should return an error message when the uploaded picture is PNG', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/meals/update')
        .set("Authorization", token)
        .field('id', 1)
        .field('name', 'Meat and Cheese Sandwich')
        .field('description', 'An easy sandwich for those busy days!')
        .field('ingredients', JSON.stringify(['bread', 'cheese', 'lettuce', 'meat']))
        .field('instructions', JSON.stringify([
          'Put the bread on the counter.', 
          'Put the meat between 2 slices of bread.', 
          'Put the cheese and lettuce on the meat.'
        ]))
        .field('cookTime', 5)
        .field('difficulty', 1)
        .attach('mealPic', 'src/test/testImages/testMealPng.png')
        .end((err, res) => {
          res.should.have.status(415);
          res.body.message.should.equal('Please upload a JPEG image.');
          if(err) done(err);
          done();
        });
    });

    it('should delete the old picture when the user uploads a new picture', (done) => {
      let token = `Bearer ${user.jwt}`;
      let originalPic;

      MealPic.findAll()
        .then(mealPics => originalPic = mealPics[0].dataValues.mealPicName)
        .then(() => chai.request(server)
          .put('/meals/update')
          .set("Authorization", token)
          .field('id', 1)
          .field('name', 'Meat Sandwich')
          .attach('mealPic', 'src/test/testImages/testMealJpeg.jpeg'))
        .then(res => {
          res.should.have.status(201);
          res.body.message.should.equal('Meal successfully updated.');
        })
        .then(() => MealPic.findAll())
        .then(mealPics => {
          mealPics.length.should.equal(1);
          mealPics[0].dataValues.mealPicName.should.not.equal(originalPic);
        })
        .then(() => done())
        .catch(err => done(err));
    });
  });

  describe('DELETE meal', () => {
    it('should return a success message when the meal, related savedMeals, and likes are deleted', (done) => {
      let token = `Bearer ${user.jwt}`;

      // user 1 saves meal
      chai.request(server)
        .post('/savedmeals/save')
        .set("Authorization", token)
        .send({ mealId: 1 })
        // user 1 likes meal
        .then(() => chai.request(server)
          .post('/likes/add')
          .set("Authorization", token)
          .send({mealId: 1}))
        // user deletes meal
        .then(() => chai.request(server)
          .delete('/meals/delete')
          .set("Authorization", token)
          .send({ id: 1 })
        .then(res => {
          res.should.have.status(200);
          res.body.message.should.equal('Meal successfully deleted.');
        }))
        // check if meal, saved meal, and likes are deleted
        .then(() => Like.findAll())
        .then(likes => expect(likes.length).to.equal(0))
        .then(() => Meal.findOne({where: {id: 1}}))
        .then(meal => expect(meal).to.equal(null))
        .then(() => SavedMeal.findAll())
        .then(savedMeals => expect(savedMeals.length).to.equal(0))
        .then(() => MealPic.findAll())
        .then(mealPics => expect(mealPics.length).to.equal(0))
        .then(() => done())
        .catch(err => done(err));
    });

    it('should return an error message when there is no meal to delete', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .delete('/meals/delete')
        .set("Authorization", token)
        .send({ id: 1 })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('There was an error deleting your meal.');
          if(err) done(err);
          done();
        });
    });
  });

});