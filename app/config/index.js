'use strict';

if (process.env.NODE_ENV === 'production') {
  // Offer production stage environment variables
  // process.env.REDIS_URL : : redis://redistogo:abcdef0123456...
  let redisURI = require('url').parse(process.env.REDIS_URL);
  let redisPassword = redisURI.auth.split(':')[1];

  module.exports = {
    host: process.env.host || "",
    dbURI: process.env.dbURI || "",
    sessionSecret: process.env.sessionSecret,
    fb: {
      clientID: process.env.fbClientID,
      clientSecret: process.env.fbClientSecret,
      callbackURL: process.env.host + "/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'photos']
    },
    redis: {
      host: redisURI.hostname,
      port: redisURI.port,
      password: redisPassword
    }
  }
} else {
  module.exports = require('./development.json');
}
