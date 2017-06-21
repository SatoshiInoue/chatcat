'use strict';
const passport = require('passport');
const config = require('../config');
const FacebookStrategy = require('passport-facebook').Strategy;
const h = require('../helpers');
const logger = require('../logger');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // Find the user using the _id
    h.findById(id)
      .then(user => done(null, user))
      .catch(error => logger.log('error', "Error when deserializing"+error));
  });

  let authProcessor = function(accessToken, refreshToken, profile, done) {
    //Find a user in the local db using profile.id
    //If the user is found, return the user data using the done()
    //If the user is not found, create one in the local db and return
    h.findOne(profile.id)
      .then(function(result) {
        if (result) {
          done(null, result);
        } else {
          // Create a new user and return
          h.createNewUser(profile)
            .then(function(newChatUser) {
              done(null, newChatUser);
            })
            .catch(error => logger.log('error', "Error when creating a new user"+error));
        }
       });
  }
  passport.use(new FacebookStrategy(config.fb, authProcessor));
}
