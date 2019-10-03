'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./src/routes/index');
const config = require('./config');

//  App configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use('/public', express.static('public'));

// Routes
app.use(routes);

app.listen(config.PORT || 8083, () => console.log('share-family-recipes-api is running.'));

module.exports = app;