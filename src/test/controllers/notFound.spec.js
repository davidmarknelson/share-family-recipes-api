'use strict';
const server = require("../../../app");

describe('Not found', () => {
  it('should return a message for pages or resources that do not exist', (done) => {
    chai.request(server)
      .get('/this-shouldnt-exist')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.message.should.equal('Looks like what you are searching for does not exist!');
        if(err) done(err);
        done();
    });
  });
});