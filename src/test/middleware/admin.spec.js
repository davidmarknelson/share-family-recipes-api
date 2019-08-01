'use strict';
process.env.NODE_ENV = 'test';

const httpMocks = require('node-mocks-http');
const db = require('../../models/sequelize').sequelize;

const User = require('../../models/sequelize').user;
const jwt = require('jsonwebtoken');
const utils = require("../utils");
const adminMiddleware = require('../../middleware/admin');

function jwtSignUser(user) {
  const oneWeek = 60 * 60 * 24 * 7;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: oneWeek
  });
}

describe('Admin middleware', () => {
  let userAdmin;
  let userNotAdmin;

  before(() => {
    return db.sync({force: true})
      .then(() => {
        return User.create(utils.user);
      })
      .then(user => {
        userAdmin = {
          user: user,
          jwt: jwtSignUser(user.dataValues)
        };
      })
      .then(() => {
        return User.create(utils.user2);
      })
      .then(user2 => {
        userNotAdmin = {
          user: user2,
          jwt: jwtSignUser(user2.dataValues)
        };
      });
  });

  it('should return an error if the user is not an admin and not call next()', () => {
    let token = userNotAdmin.jwt;
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

  it('should return call next() with an admin user', () => {
    let token = userAdmin.jwt;
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
