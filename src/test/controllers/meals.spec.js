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
    it('should return a new meal without an image', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send(utils.mealNoPic)
        .then(res => {
          res.should.have.status(201);
          res.body.id.should.equal(1);
          res.body.name.should.equal('Meat and Cheese Sandwich');
          res.body.message.should.equal('Recipe successfully created.')
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
          meal.should.have.property('originalRecipeUrl', 'http://www.testrecipe.com');
          meal.should.have.property('youtubeUrl', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
          meal.ingredients.should.be.an('array');
          meal.instructions.should.be.an('array');
          meal.should.have.property('mealPic', null);
        })
        .then(() => done())
        .catch(err => done(err));
    });

    it('should return a new meal with an image and lowercase ingredients', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send(utils.mealWithPic)
        .then(res => {
          res.should.have.status(201);
          res.body.id.should.equal(2);
          res.body.name.should.equal('Meat and Tomato Sandwich');
          res.body.message.should.equal('Recipe successfully created.')
        })
        .then(() => Meal.findOne({ 
          where: { id: 2 },
          include: [
            { model: MealPic, as: 'mealPic', attributes: ['mealPicName'], duplicating: false },
          ]
        }))
        .then(meal => {
          meal.name.should.equal("Meat and Tomato Sandwich");
          meal.id.should.equal(2)
          meal.should.have.property('description');
          meal.should.have.property('originalRecipeUrl', 'http://www.testrecipe.com');
          meal.should.have.property('youtubeUrl', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
          meal.ingredients.should.be.an('array');
          meal.ingredients[1].should.equal('tomato');
          meal.instructions.should.be.an('array');
          meal.mealPic.should.have.property('mealPicName', 'https://mealpicurl');
        })
        .then(() => done())
        .catch(err => done(err));
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
        .send({
          name: 'Meat and Lettuce Sandwich',
          description: msg(),
          ingredients: JSON.stringify(['bread', 'lettuce', 'meat']),
          instructions: JSON.stringify(['Make sandwich.']),
          cookTime: 5,
          difficulty: 1,
          originalRecipeUrl: 'www.testrecipe.com',
          youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
          mealPicName: null,
          publicId: null
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('The description has a max of 150 characters.')
          if(err) done(err);
          done();
        });
    });

    it('should return an error if the name is too long', (done) => {
      let token = `Bearer ${user.jwt}`;

      let name = function() {
        let string = '';
        for (let i = 0; i < 76; i++) {
          string = string + 'a';
        }
        return string;
      }

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send({
          name: name(),
          description: 'An easy sandwich for those busy days!',
          ingredients: JSON.stringify(['bread', 'lettuce', 'meat']),
          instructions: JSON.stringify(['Make sandwich.']),
          cookTime: 5,
          difficulty: 1,
          originalRecipeUrl: 'www.testrecipe.com',
          youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
          mealPicName: null,
          publicId: null
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('The name has a max of 75 characters.')
          if(err) done(err);
          done();
        });
    });
    

    it('should return an error when the meal name is already being used', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send(utils.mealNoPic)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('This recipe name is already taken.');
          if(err) done(err);
          done();
        });
    });

    it('should return an error when the youtube url is too long', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send({
          name: 'Meat and lettuce sandwich',
          description: 'An easy sandwich for those busy days!',
          ingredients: JSON.stringify(['bread', 'lettuce', 'meat']),
          instructions: JSON.stringify(['Make sandwich.']),
          cookTime: 5,
          difficulty: 1,
          originalRecipeUrl: 'www.testrecipe.com',
          youtubeUrl: 'https://youtu.be/linkiswaytoolong',
          mealPicName: null,
          publicId: null
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('There was an error with your YouTube link.');
          if(err) done(err);
          done();
        });
    });

    it('should return an error when the youtube url is too short', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send({
          name: 'Meat and lettuce sandwich',
          description: 'An easy sandwich for those busy days!',
          ingredients: JSON.stringify(['bread', 'lettuce', 'meat']),
          instructions: JSON.stringify(['Make sandwich.']),
          cookTime: 5,
          difficulty: 1,
          originalRecipeUrl: 'www.testrecipe.com',
          youtubeUrl: 'https://youtu.be/short',
          mealPicName: null,
          publicId: null
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('There was an error with your YouTube link.');
          if(err) done(err);
          done();
        });
    });

    it('should return an error when the beginning of the youtube url does not match the youtube url', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send({
          name: 'Meat and lettuce sandwich',
          description: 'An easy sandwich for those busy days!',
          ingredients: JSON.stringify(['bread', 'lettuce', 'meat']),
          instructions: JSON.stringify(['Make sandwich.']),
          cookTime: 5,
          difficulty: 1,
          originalRecipeUrl: 'www.testrecipe.com',
          youtubeUrl: 'https://nottu.be/dQw4w9WgXcQ',
          mealPicName: null,
          publicId: null
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('There was an error with your YouTube link.');
          if(err) done(err);
          done();
        });
    });
  });

  describe('GET available meal name', () => {
    it('should return an error message if the meal name is taken', (done) => {
      chai.request(server)
        .get('/meals/available-names?name=Meat%20and%20Cheese%20Sandwich')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.not.have.property('message');
          if(err) done(err);
          done();
        });
    });

    it('should return an error message if the case insensitive meal name is taken', (done) => {
      chai.request(server)
        .get('/meals/available-names?name=meat%20and%20cheese%20sandwich')
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


  describe('GET specific meal by id', () => {
    it('should return a meal', (done) => {
      chai.request(server)
        .get('/meals/meal-by-id?id=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name', 'Meat and Cheese Sandwich');
          res.body.should.have.property('savedRecipes');
          res.body.savedRecipes.should.be.an('array');
          res.body.creator.username.should.equal('johndoe');
          res.body.ingredients.should.be.an('array');
          res.body.instructions.should.be.an('array');
          if(err) done(err);
          done();
        });
    });

    it('should return an error message when there is no meal that matches the query', (done) => {
      chai.request(server)
        .get('/meals/meal-by-id?id=3')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('That recipe does not exist.');
          if(err) done(err);
          done();
        });
    });
  });

  describe('GET specific meal by name', () => {
    it('should return a meal', (done) => {
      chai.request(server)
        .get('/meals/meal-by-name?name=Meat%20and%20Cheese%20Sandwich')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name', 'Meat and Cheese Sandwich');
          res.body.creator.username.should.equal('johndoe');
          res.body.should.have.property('savedRecipes');
          res.body.savedRecipes.should.be.an('array');
          res.body.ingredients.should.be.an('array');
          res.body.instructions.should.be.an('array');
          if(err) done(err);
          done();
        });
    });

    it('should return a meal regardless of capitalization', (done) => {
      chai.request(server)
        .get('/meals/meal-by-name?name=meat%20and%20cheese%20sandwich')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name', 'Meat and Cheese Sandwich');
          res.body.creator.username.should.equal('johndoe');
          if(err) done(err);
          done();
        });
    });

    it('should return an error message when there is no meal that matches the query', (done) => {
      chai.request(server)
        .get('/meals/meal-by-name?name=coffee')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('That recipe does not exist.');
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
        .send({
          id: 1,
          name: 'Meat and Tomato Sandwich'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('This recipe name is already taken.');
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
          .send({
            id: 2,
            recipePicName: 'https://newmealpicurl',
            publicId: 'folder/newmealpicname'
          }))
        .then(res => {
          res.should.have.status(201);
          res.body.message.should.equal('Recipe successfully updated.');
        })
        .then(() => MealPic.findAll())
        .then(mealPics => {
          mealPics.length.should.equal(1);
          mealPics[0].mealPicName.should.not.equal(originalPic);
          mealPics[0].mealPicName.should.equal('https://newmealpicurl');
          mealPics[0].publicId.should.equal('folder/newmealpicname');
        })
        .then(() => done())
        .catch(err => done(err));
    });

    it('should update the meal without updating the meal pic', (done) => {
      let token = `Bearer ${user.jwt}`;
      let originalPic;

      MealPic.findAll()
        .then(mealPics => originalPic = mealPics[0].dataValues.mealPicName)
        .then(() => chai.request(server)
          .put('/meals/update')
          .set("Authorization", token)
          .send({
            id: 1,
            difficulty: 5
          }))
        .then(res => {
          res.should.have.status(201);
          res.body.message.should.equal('Recipe successfully updated.');
        })
        .then(() => MealPic.findAll())
        .then(mealPics => {
          mealPics.length.should.equal(1);
          mealPics[0].mealPicName.should.equal(originalPic);
          mealPics[0].mealPicName.should.equal('https://newmealpicurl');
          mealPics[0].publicId.should.equal('folder/newmealpicname');
        })
        .then(() => Meal.findOne({where: {name: 'Meat and Cheese Sandwich'}}))
        .then(meal => {
          meal.name.should.equal('Meat and Cheese Sandwich');
          meal.difficulty.should.equal(5);
        })
        .then(() => done())
        .catch(err => done(err));
    });

    it('should add a picture url to a meal when there was not a pervious picture url', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/meals/update')
        .set("Authorization", token)
        .send({
          id: 1,
          recipePicName: 'https://brandnewmealpicurl',
          publicId: 'folder/brandnewmealpicname'
        })
        .then(res => {
          res.should.have.status(201);
          res.body.message.should.equal('Recipe successfully updated.');
        })
        .then(() => MealPic.findAll())
        .then(mealPics => {
          mealPics.length.should.equal(2);
          mealPics[1].mealPicName.should.equal('https://brandnewmealpicurl');
          mealPics[1].publicId.should.equal('folder/brandnewmealpicname');
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
          res.body.message.should.equal('Recipe successfully deleted.');
        }))
        // check if meal, saved meal, meal pics, and likes are deleted
        .then(() => Like.findAll())
        .then(likes => expect(likes.length).to.equal(0))
        .then(() => Meal.findOne({where: {id: 1}}))
        .then(meal => expect(meal).to.equal(null))
        .then(() => SavedMeal.findAll())
        .then(savedMeals => expect(savedMeals.length).to.equal(0))
        .then(() => MealPic.findAll())
        .then(mealPics => expect(mealPics.length).to.equal(1))
        .then(() => done())
        .catch(err => done(err));
    });

    it('should delete a meal when there is no related meal pic', (done) => {
      let token = `Bearer ${user.jwt}`;
      let mealId;
      // user 1 saves meal
      chai.request(server)
        .post('/meals/create')
        .set("Authorization", token)
        .send(utils.mealNoPic)
        .then(res => mealId = res.body.id)
        // user deletes meal
        .then(() => chai.request(server)
          .delete('/meals/delete')
          .set("Authorization", token)
          .send({ id: mealId })
        .then(res => {
          res.should.have.status(200);
          res.body.message.should.equal('Recipe successfully deleted.');
        }))
        .then(() => Meal.findOne({where: {id: mealId}}))
        .then(meal => expect(meal).to.equal(null))
        .then(() => done())
        .catch(err => done(err));
    });

    it('should return an error message when the meal id and the creator id do not match', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .delete('/meals/delete')
        .set("Authorization", token)
        .send({ id: 1 })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.message.should.equal('You do not have permission to delete this recipe.');
          if(err) done(err);
          done();
        });
    });
  });

});