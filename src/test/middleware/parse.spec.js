'use strict';
process.env.NODE_ENV = 'test';

const parse = require('../../middleware/parse');
const httpMocks = require('node-mocks-http');

describe('Parse middleware', () => {
  let response;
  let nextSpy;

  beforeEach(() => {
    response = httpMocks.createResponse();
    nextSpy = chai.spy();
  });

  describe('trimBodyEmail()', () => {
    it('should trim the whitespace from the ends of any sent emails and call next()', () => {
      let request  = httpMocks.createRequest({
        method: 'GET',
        url: '/',
        body: {
          email: '   test@email.com   '
        }
      });
  
      parse.trimBodyEmail(request, response, nextSpy);
  
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
  
      parse.trimBodyEmail(request, response, nextSpy);
  
      expect(nextSpy).to.have.been.called();
      request.body.email.should.equal('test@email.com');
    });
  
    it('should call next() if there is no email present in the body', () => {
      let request  = httpMocks.createRequest({
        method: 'GET',
        url: '/'
      });
  
      request.body.should.not.have.property('email');
  
      parse.trimBodyEmail(request, response, nextSpy);
  
      expect(nextSpy).to.have.been.called();
      request.body.should.not.have.property('email');
    });
  });

  describe('parseMealFields()', () => {
    it('should remove the whitespace from meal name, turn ingredients and instructions to arrays, and lowercase ingredients', () => {
      let request  = httpMocks.createRequest({
        method: 'POST',
        url: '/',
        body: {
          name: '   Soup    ',
          ingredients: JSON.stringify([
            'WAter', 'MEaT', 'VegeTABLES'
          ]),
          instructions: JSON.stringify([
            'Boil water', 'Cook meat and vegetables in water.'
          ])
        }
      });

      request.body.ingredients.should.not.be.an('array');
      request.body.instructions.should.not.be.an('array');

      parse.parseMealFields(request, response, nextSpy);

      expect(nextSpy).to.have.been.called();
      request.body.name.should.equal('Soup');
      request.body.ingredients.should.be.an('array');
      request.body.ingredients[0].should.equal('water');
      request.body.ingredients[1].should.equal('meat');
      request.body.ingredients[2].should.equal('vegetables');
      request.body.instructions.should.be.an('array');
    });
  });
  
});