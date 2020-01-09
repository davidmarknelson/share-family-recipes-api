'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./src/routes/index');
const config = require('./config');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
// Cloudinary
const cloudinary = require('cloudinary').v2;

// cors setup
const origin = {
  origin: (process.env.NODE_ENV === 'production') ? config.FRONT_END_URL : '*'
}

// rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: (process.env.NODE_ENV === 'production') ? 100 : 0 // 75 requests
})


//  App configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(origin));
app.use(limiter)
app.use(helmet());
app.use(compression());

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