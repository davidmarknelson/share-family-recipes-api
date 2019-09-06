'use strict';
const db = require('../../models/sequelize').sequelize;
const server = require("../../../app");
const utils = require("../utils");
// Model used to create tokens for tests
const Verification = require('../../models/sequelize').verification_token;


describe('Email verification', () => {
  before(() => {
    return db.sync({force: true})
      .then(() => utils.createAdmin())
      .then(res => {
        return Verification.create({
          token: '123456789',
          userId: res.body.user.id
        });
      });
  });


  describe('POST verify email', () => {
    it('should return a message when the wrong token is sent and not delete the token', (done) => {
      chai.request(server)
        .post('/verify')
        .send({token: 'wrongtoken'})
        .then(res => {
          res.should.have.status(404);
          res.body.message.should.equal('The token has expired. Please send another verification email.');
        })
        .then(() => {
          return Verification.findAll();
        })
        .then(tokens => {
          tokens.length.should.equal(1);
          tokens[0].token.should.equal('123456789');
          done();
        })
        .catch(err => done(err));
    });

    it('should return a message when the email has been successfully verified and delete the token', (done) => {
      chai.request(server)
        .post('/verify')
        .send({ token: '123456789' })
        .then(res => {
          res.should.have.status(200);
          res.body.message.should.equal('Your email is now verified.');
        })
        .then(() => {
          return Verification.findAll();
        })
        .then(tokens => {
          tokens.length.should.equal(0);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('POST send verification email', () => {
    it('should send a message if the email was sent', (done) => {
      chai.request(server)
        .post('/verify/send')
        .send({ email: "test@email.com" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal("Email has successfully been sent.");
          if(err) done(err);
          done();
        });
    });
  });

});