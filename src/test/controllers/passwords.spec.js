process.env.NODE_ENV = 'test';

const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;

describe('Password', () => {
  let user;

  before(() => {
    return db.sync({force: true})
      .then(() => {
        return chai.request(server)
          .post('/user/signup')
          .send(utils.user)
      })
      .then(res => {
        user = res.body;
        console.log(`Database, tables, and user created for tests!`)
      });
  });

  describe('reset route', () => {
    it('should send an error message if passwords do not match', (done) => {
      let token = `Bearer ${user.jwt}`;
      let passwordObj = {
        password: "match",
        passwordConfirmation: "notMatch"
      }

      chai.request(server)
        .post('/password/change')
        .set("Authorization", token)
        .send(passwordObj)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal("Passwords do not match.");
          if(err) done(err);
          done();
        });
    });

    it('should send a message when the password is updated', (done) => {
      let token = `Bearer ${user.jwt}`;
      let passwordObj = {
        password: "theyMatch",
        passwordConfirmation: "theyMatch"
      }

      chai.request(server)
        .post('/password/change')
        .set("Authorization", token)
        .send(passwordObj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal("Your password was successfully updated.");
          if(err) done(err);
          done();
        });
    });
  });

});