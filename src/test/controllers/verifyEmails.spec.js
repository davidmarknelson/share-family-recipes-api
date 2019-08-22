'use strict';
process.env.NODE_ENV = 'test';

const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;
const User = require('../../models/sequelize').user;
const Verification = require('../../models/sequelize').verification_token;
const jwt = require('jsonwebtoken');

function jwtSignUser(user) {
  const oneWeek = 60 * 60 * 24 * 7;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: oneWeek
  });
}

describe('Email verification', () => {
  let user;

  before(() => {
    return db.sync({force: true})
      .then(() => {
        return User.create(utils.user);
      })
      .then(res => {
        user = {
          user: res,
          jwt: jwtSignUser(res.dataValues)
        };
      })
      .then(() => {
        user.user.token = '123456789'
        Verification.create({
          token: '123456789',
          userId: user.user.id
        });
      })
      .then(() => console.log(`Database, tables, and user created for tests!`));
  });


  describe('POST verify email', () => {
    it('should return a message when the wrong token is sent', (done) => {
      let verifyObj = {
        email: user.user.email,
        token: 'wrongtoken'
      }

      chai.request(server)
        .post('/verify')
        .send(verifyObj)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('There was an error verifying your email.');
          if(err) done(err);
          done();
        });
    });

    it('should return a message when the email has been successfully verified', (done) => {
      chai.request(server)
        .post('/verify')
        .send({ token: user.user.token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Your email is now verified.');
          if(err) done(err);
          done();
        });
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