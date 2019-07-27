const chai = require("chai");
const chaiHttp = require("chai-http");
const datestring = require('chai-date-string');
const spies = require('chai-spies')

global.chai = chai;
global.chaiHttp = chaiHttp;
global.should = global.chai.should();
global.expect = global.chai.expect;

chai.use(chaiHttp);
chai.use(datestring);
chai.use(spies);