const chai = require("chai");
const chaiHttp = require("chai-http");
const datestring = require('chai-date-string');
const spies = require('chai-spies')
// nock
const nock = require('nock');

global.chai = chai;
global.chaiHttp = chaiHttp;
global.should = global.chai.should();
global.expect = global.chai.expect;
global.nock = nock;

chai.use(chaiHttp);
chai.use(datestring);
chai.use(spies);

// disable all real internet connections to safeguard against 
// incorrect mocking
nock.disableNetConnect();
// enable net connections for localhost
nock.enableNetConnect('127.0.0.1');
// Mock requests to cloudinary for deleting images
const deleteOneScope = nock('https://api.cloudinary.com')
  .persist()
  .post(`/v1_1/${process.env.CLOUD_NAME}/image/destroy`)
  .reply(200, {result: 'ok'})
  .log(info => console.log('nock: ',info));

const deleteMultipleScope = nock('https://api.cloudinary.com')
  .persist()
  .delete(`/v1_1/${process.env.CLOUD_NAME}/resources/image/upload`)
  .reply(200, {
    "deleted": {
        "image1": "deleted"
    },
    "partial": false
  })
  .log(info => console.log('nock: ',info));