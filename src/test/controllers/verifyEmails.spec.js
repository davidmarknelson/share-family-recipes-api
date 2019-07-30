process.env.NODE_ENV = 'test';

const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;

describe('Email verification', () => {
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

    it('should return a message when the wrong email is sent', (done) => {
      let verifyObj = {
        email: "wrong@email.com",
        token: user.user.token
      }

      chai.request(server)
        .post('/verify')
        .send(verifyObj)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.message.should.equal('There was an error verifying your email.');
          if(err) done(err);
          done();
        });
    });

    it('should return a message when the email has been successfully verified', (done) => {
      let verifyObj = {
        email: user.user.email,
        token: user.user.token
      }

      chai.request(server)
        .post('/verify')
        .send(verifyObj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Your email is now verified.');
          if(err) done(err);
          done();
        });
    });
  });

});