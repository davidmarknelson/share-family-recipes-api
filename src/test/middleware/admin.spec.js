'use strict';
const adminMiddleware = require('../../middleware/admin');
const db = require('../../models/sequelize').sequelize;
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const utils = require("../utils");

function jwtSignUser(user) {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME
  });
}

describe('Admin middleware', () => {

  before(() => {
    return db.sync({force: true});
  });

  it('should return an error if the user is not an admin and not call next()', () => {
    let token = jwtSignUser(utils.user2);
    let request  = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    });
    
    let nextSpy = chai.spy();
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        request.decoded = decoded;
      }
    });

    let response = httpMocks.createResponse();
    
    adminMiddleware.isAdmin(request, response, nextSpy);
    
    expect(response.statusCode).to.equal(403);
    response._getData().should.equal('{"message":"You do not have permission to access this service."}');
    expect(nextSpy).to.not.have.been.called();
  });

  it('should call next() with an admin user', () => {
    let token = jwtSignUser(utils.user);
    let request  = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    });
    
    let nextSpy = chai.spy();
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        request.decoded = decoded;
      }
    });

    let response = httpMocks.createResponse();
    
    adminMiddleware.isAdmin(request, response, nextSpy);
    
    expect(nextSpy).to.have.been.called();
  });
});
