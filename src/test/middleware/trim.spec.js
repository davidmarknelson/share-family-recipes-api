'use strict';
process.env.NODE_ENV = 'test';

const trim = require('../../middleware/trim');
const httpMocks = require('node-mocks-http');

describe('Trim middleware', () => {
  it('should trim the whitespace from the ends of any sent emails and call next()', () => {
    let request  = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      body: {
        email: '   test@email.com   '
      }
    
    });
    let response = httpMocks.createResponse();
    let nextSpy = chai.spy();

    trim.trimBodyEmail(request, response, nextSpy);

    expect(nextSpy).to.have.been.called();
    request.body.email.should.equal('test@email.com');
  });

  it('should trim the whitespace from the ends of any sent emails, change it to lowercase, and call next()', () => {
    let request  = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      body: {
        email: '   tESt@emaiL.coM   '
      }
    
    });
    let response = httpMocks.createResponse();
    let nextSpy = chai.spy();

    trim.trimBodyEmail(request, response, nextSpy);

    expect(nextSpy).to.have.been.called();
    request.body.email.should.equal('test@email.com');
  });

  it('should call next() if there is no email present in the body', () => {
    let request  = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    });
    let response = httpMocks.createResponse();
    let nextSpy = chai.spy();

    request.body.should.not.have.property('email');

    trim.trimBodyEmail(request, response, nextSpy);

    expect(nextSpy).to.have.been.called();
    request.body.should.not.have.property('email');
  });
});