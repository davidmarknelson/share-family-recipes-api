'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./src/routes/index');

//  App configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use('/public', express.static('public'));

// Routes
app.use(routes);

if (process.env.NODE_ENV === "test") {
  process.env.PORT = 3001;
}
app.listen(process.env.PORT || 8083, () => console.log('food-auth-api is running.'));

module.exports = app;