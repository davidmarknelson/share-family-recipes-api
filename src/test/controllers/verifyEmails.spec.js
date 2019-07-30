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
    it('should return a message when the email has been successfully verified', () => {
      user.should.have.status(200);
      user.message.should.equal('Your email is now verified.');
    });

    it('should return a message when there was an error verifying email', () => {
      user.should.have.status(500);
      user.message.should.equal('There was an error verifying your email.');
    });
  });

});