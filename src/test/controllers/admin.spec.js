'use strict';
const server = require("../../../app");
const utils = require("../utils");
const db = require('../../models/sequelize').sequelize;

describe('Admin', () => {
  let user;

  before(() => {
    return db.sync({force: true})
      .then(() => utils.createAdmin())
      .then(res => user = res.body)
      .then(() => utils.createUser());
  });

  it('should get users from newest to oldest with no offest and limit params', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/newusers')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows[0].id.should.equal(2);
          res.body.rows[0].username.should.equal('jsmith');
          res.body.rows[0].firstName.should.equal('Jack');
          res.body.rows[0].lastName.should.equal('Smith');
          res.body.rows[0].email.should.equal('smith@email.com');
          res.body.rows[0].isVerified.should.equal(false);
          res.body.rows[0].isAdmin.should.equal(false);
          res.body.rows[0].createdAt.should.be.a.dateString();
          res.body.rows.should.have.lengthOf(2);
          if(err) done(err);
          done();
        });
  });

  it('should get users from newest to oldest', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/newusers?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows[0].id.should.not.equal(1);
          res.body.rows[0].username.should.equal('jsmith');
          res.body.rows.should.have.lengthOf(2);
          if(err) done(err);
          done();
        });
  });

  it('should get users from oldest to newest with no offest and limit params', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/oldusers')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows.should.have.lengthOf(2);
          res.body.rows[0].id.should.equal(1);
          res.body.rows[0].username.should.equal('johndoe');
          if(err) done(err);
          done();
        });
  });

  it('should get users from oldest to newest', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/oldusers?offset=1&limit=1')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows[0].id.should.equal(2);
          res.body.rows[0].username.should.equal('jsmith');
          res.body.rows.should.have.lengthOf(1);
          if(err) done(err);
          done();
        });
  });

  it('should get users by username A to Z', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/username-a-z?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows[0].id.should.equal(1);
          res.body.rows[0].username.should.equal('johndoe');
          res.body.rows.should.have.lengthOf(2);
          if(err) done(err);
          done();
        });
  });


  it('should get users by username Z to A', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/username-z-a?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows[0].username.should.equal('jsmith');
          res.body.rows.should.have.lengthOf(2);
          if(err) done(err);
          done();
        });
  });

  it('should get users by first name A to Z', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/firstname-a-z?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows[0].firstName.should.equal('Jack');
          res.body.rows.should.have.lengthOf(2);
          if(err) done(err);
          done();
        });
  });
  
  it('should get users by first name Z to A', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/firstname-z-a?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows[0].firstName.should.equal('John');
          res.body.rows.should.have.lengthOf(2);
          if(err) done(err);
          done();
        });
  });

  it('should get users by last name A to Z', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/lastname-a-z?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows[0].lastName.should.equal('Doe');
          res.body.rows.should.have.lengthOf(2);
          if(err) done(err);
          done();
        });
  });

  it('should get users by last name Z to A', (done) => {
    let token = `Bearer ${user.jwt}`;

    chai.request(server)
        .get('/admin/lastname-z-a?offset=0&limit=10')
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.equal(2);
          res.body.rows.should.be.an('array');
          res.body.rows[0].lastName.should.equal('Smith');
          res.body.rows.should.have.lengthOf(2);
          if(err) done(err);
          done();
        });
  });
});
