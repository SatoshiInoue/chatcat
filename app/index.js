'use strict';

// Social authentication logic
const config = require('./config');
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');
const h = require('./helpers');
// const logger = require('./logger');

require('./auth')();
// let chatrooms;
// h.getAllRooms()
// .then(function(results) {
//   chatrooms = results;
// })
// .catch(function(error) {
//   chatrooms = [];
//   logger.log('error', "Error - getAllRooms " + error);
// });

// Create an IO Server instanceof
let ioServer = (app) => {
  app.locals.chatrooms = [];

  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  io.set('transports', ['websocket']);
  let pubClient = redis(config.redis.port, config.redis.host, {
    auth_pass: config.redis.password
  });
  let subClient = redis(config.redis.port, config.redis.host, {
    return_buffers: true,
    auth_pass: config.redis.password
  });
  io.adapter(adapter({
    pubClient,
    subClient
  }));
  io.use((socket, next) => {
    require('./session')(socket.request, {}, next);
  });
  require('./socket')(io, app);
  return server;
}
module.exports = {
  router: require('./routes')(),
  session: require('./session'),
  ioServer,
  logger: require('./logger')
}
