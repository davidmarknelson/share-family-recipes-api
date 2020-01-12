let config;
if (process.env.NODE_ENV === 'test') {
  config = require('./test-config.json');
} else if (process.env.NODE_ENV === 'development') {
  config = require('./dev-config.json');
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || config.NODE_ENV,
  PORT: process.env.PORT || config.PORT,
  HOST: process.env.HOST || config.HOST,
  DB: process.env.DB || config.DB,
  DB_PORT: process.env.DB_PORT || config.DB_PORT,
  DB_USER: process.env.DB_USER || config.DB_USER,
  DB_PW: process.env.DB_PW || config.DB_PW,
  JWT_SECRET: process.env.JWT_SECRET || config.JWT_SECRET,
  SG_API_KEY: process.env.SG_API_KEY || config.SG_API_KEY,
  URL: process.env.URL || config.URL,
  EMAIL: process.env.EMAIL || config.EMAIL,
  EMAIL_HOST: process.env.EMAIL_HOST || config.EMAIL_HOST,
  EMAIL_USER: process.env.EMAIL_USER || config.EMAIL_USER,
  EMAIL_PW: process.env.EMAIL_PW || config.EMAIL_PW,
  EMAIL_PORT: process.env.EMAIL_PORT || config.EMAIL_PORT,
  ADMIN_CODE: process.env.ADMIN_CODE || config.ADMIN_CODE,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || config.JWT_EXPIRATION_TIME,
  CLOUD_NAME: process.env.CLOUD_NAME || config.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY || config.CLOUD_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET || config.CLOUD_API_SECRET,
  FRONT_END_URL: process.env.FRONT_END_URL || config.FRONT_END_URL
};