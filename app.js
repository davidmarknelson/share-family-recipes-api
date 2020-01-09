'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./src/routes/index');
const config = require('./config');
// Cloudinary
const cloudinary = require('cloudinary').v2;

//  App configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: config.CLOUD_NAME, 
  api_key: config.CLOUD_API_KEY, 
  api_secret: config.CLOUD_API_SECRET
});

// Routes
app.use(routes);

app.listen(config.PORT || 8083, () => console.log('share-family-recipes-api is running.'));

module.exports = app;