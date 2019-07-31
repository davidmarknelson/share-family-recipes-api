process.env.NODE_ENV = 'test';

const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;

describe.only('Password', () => {
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

  describe('PUT route', () => {
    it('should send an error message if passwords do not match', (done) => {
      let token = `Bearer ${user.jwt}`;
      let passwordObj = {
        password: "match",
        passwordConfirmation: "notMatch"
      }

      chai.request(server)
        .put('/password/change')
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
        .put('/password/change')
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

  describe('POST send reset password email', () => {
    it('should send an error message when the email is not in the database', (done) => {
      chai.request(server)
        .post('/password/send')
        .send({ email: 'wrong@email.com' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal("No account with that email address exists.");
          if(err) done(err);
          done();
        });
    })

    it('should send a message when the email has been received', (done) => {
      chai.request(server)
        .post('/password/send')
        .send({ email: 'test@email.com' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal("An email has been sent to test@email.com with further instructions.");
          if(err) done(err);
          done();
        });
    })
  })

});