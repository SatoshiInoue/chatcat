'use strict';
const config = require('../config');
const logger = require('../logger');
const Mongoose = require('mongoose').connect(config.dbURI);

//Log an error if the connection fails
Mongoose.connection.on('error', error => {
  logger.log('error', "Mongoose connection error: " + error);
});
//Create a schema that defines the structure for storing the user data
const chatUser = new Mongoose.Schema({
  profileId: String,
  fullName: String,
  profilePic: String
});

//Turn the schema into a usable model
let userModel = Mongoose.model('chatUser', chatUser);

//Create a schema that defines the structure for storing the user data
const chatRoom = new Mongoose.Schema({
  room: String,
  roomID: String,
  users: []
});

//Turn the schema into a usable model
let roomModel = Mongoose.model('chatRoom', chatRoom);

module.exports = {
  Mongoose,
  userModel
}
