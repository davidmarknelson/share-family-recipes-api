'use strict';
const db = require('../../models/sequelize').sequelize;
const auth = require('../../middleware/auth');
const httpMocks = require('node-mocks-http');
const utils = require("../utils");

describe('Auth middleware', () => {
  let user;
  let response;
  let nextSpy;

  before(() => {
    return db.sync({force: true})
      .then(() => utils.createAdmin())
      .then(res => user = res.body);
  });

  beforeEach(() => {
    response = httpMocks.createResponse();
    nextSpy = chai.spy();
  });

  describe('isAuthenticated()', () => {
    it('should call next() when a valid jwt is passed', () => {
      let token = `Bearer ${user.jwt}`;
      let request  = httpMocks.createRequest({
        method: 'GET',
        url: '/',
        headers: {
          Authorization: token
        }
      });

      should.exist(token);
      token.should.be.a('string');

      auth.isAuthenticated(request, response, nextSpy);
      expect(nextSpy).to.have.been.called();
    });

    it('should throw an error when an invalid jwt signature is passed and not call next()', () => {
      let token = `Bearer ${user.jwt}invalid`;
      let request  = httpMocks.createRequest({
        method: 'GET',
        url: '/',
        headers: {
          Authorization: token
        }
      });

      should.exist(token);
      token.should.be.a('string');

      auth.isAuthenticated(request, response, nextSpy);
      expect(response.statusCode).to.equal(403);
      response._getData().should.equal('{"message":"invalid signature"}');
      expect(nextSpy).to.not.have.been.called();
    });

    it('should throw an error when an invalid jwt token is passed and not call next()', () => {
      let token = `Bearer invalid${user.jwt}`;
      let request  = httpMocks.createRequest({
        method: 'GET',
        url: '/',
        headers: {
          Authorization: token
        }
      });

      should.exist(token);
      token.should.be.a('string');

      auth.isAuthenticated(request, response, nextSpy);
      expect(response.statusCode).to.equal(403);
      response._getData().should.equal('{"message":"invalid token"}');
      expect(nextSpy).to.not.have.been.called();
    });

    it('should throw an error when no token is passed and not call next()', () => {
      let token = '';
      let request  = httpMocks.createRequest({
        method: 'GET',
        url: '/',
        headers: {
          Authorization: token
        }
      });

      auth.isAuthenticated(request, response, nextSpy);
      expect(response.statusCode).to.equal(401);
      response._getData().should.equal('{"message":"You must be signed in to do that."}');
      expect(nextSpy).to.not.have.been.called();
    });
  });
});