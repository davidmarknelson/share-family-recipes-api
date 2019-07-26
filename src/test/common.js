const chai = require("chai");
const chaiHttp = require("chai-http");

global.chai = chai;
global.chaiHttp = chaiHttp;
global.should = global.chai.should();
global.expect = global.chai.expect;

chai.use(chaiHttp);