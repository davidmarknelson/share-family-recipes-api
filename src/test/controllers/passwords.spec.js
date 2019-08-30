'use strict';
const db = require('../../models/sequelize').sequelize;
const server = require("../../../app");
const utils = require("../utils");
// Model used to create tokens for tests
const ResetPW = require('../../models/sequelize').reset_password_token;

describe('Password', () => {
  let user;

  before(() => {
    return db.sync({force: true})
      .then(() => utils.createAdmin())
      .then(res => user = res.body);
  });

  afterEach(() => ResetPW.destroy({where: {}}));

  describe('PUT update signed in user password route', () => {
    it('should send an error message if passwords do not match', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/password/change')
        .set("Authorization", token)
        .send({
          password: "notMatching",
          passwordConfirmation: "notMatch"
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal("Passwords do not match.");
          if(err) done(err);
          done();
        });
    });

    it('should send a message when the password is updated', (done) => {
      let token = `Bearer ${user.jwt}`;

      chai.request(server)
        .put('/password/change')
        .set("Authorization", token)
        .send({
          password: "theyMatch",
          passwordConfirmation: "theyMatch"
        })
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
        .post('/password/sendemail')
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
        .post('/password/sendemail')
        .send({ email: 'test@email.com' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal("An email has been sent to test@email.com with further instructions.");
          if(err) done(err);
          done();
        });
    })
  })

  describe('PUT reset password', () => {
    it('should send an error if the token has expired or does not exist', (done) => {
      chai.request(server)
        .put('/password/reset')
        .send({ token: '' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal("Password reset token is invalid or has expired.");
          if(err) done(err);
          done();
        });
    });

    it('should send an error if the passwords do not match', (done) => {
      ResetPW.create({
        userId: user.user.id,
        token: "123456789"
      })
      .then(token => {
        return chai.request(server)
          .put('/password/reset')
          .send({
            token: token.dataValues.token,
            password: "match",
            passwordConfirmation: "notMatch"
          });
      })
      .then(res => {
        res.should.have.status(400);
        res.body.message.should.equal("Passwords do not match.");
        done();
      })
      .catch(err => done(err));
    });

    it('should send a success message if the password was reset', (done) => {
      ResetPW.create({
        userId: user.user.id,
        token: "123456789"
      })
      .then(token => {
        return chai.request(server)
          .put('/password/reset')
          .send({
            token: token.dataValues.token,
            password: "change",
            passwordConfirmation: "change"
          });
      })
      .then(res => {
        res.should.have.status(200);
        res.body.message.should.equal("Your password was successfully reset.");
        done();
      })
      .catch(err => done(err));
    });
  });

});