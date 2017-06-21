 'use strict';
 const h = require('../helpers');

 module.exports = (io, app) => {
  //  let allrooms = app.locals.chatrooms;

   let allrooms;
   h.getAllRooms()
   .then(function(results) {
     allrooms = results;
     console.log("all rooms found");
     app.locals.chatrooms = allrooms;
   })
   .catch(function(error) {
     allrooms = [];
     console.log("Error - getAllRooms " + error);
   });

   io.of('/roomslist').on('connection', socket => {
     console.log('Scoket.io Connected');
     socket.on('getChatrooms', () => {
       socket.emit('chatRoomsList', JSON.stringify(allrooms));
     });

     socket.on('createNewRoom', newRoomInput => {
       // Check to see if a room with the same title exists  or newRoomInput
       // if not, create one and broadcast to everyone
       console.log(allrooms);
       console.log(newRoomInput);
       if (!h.findRoomByName(allrooms, newRoomInput)) {
        //  allrooms.push({
        //    room: newRoomInput,
        //    roomID: h.randomHex(),
        //    users: []
        //  });
        let newChatRoom = h.createNewRoom(newRoomInput)
        .then(function(room) {
          allrooms.push(room);

          // Emit an updated list to the creator
          socket.emit('chatRoomsList', JSON.stringify(allrooms));
          // Emit an updated list to everyone connected to the rooms page
          socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
        })
        .catch(function(error) {
          logger.log('error', "Error - createNewRoom " + error);
        });
       }
     });
   });

   io.of('/chatter').on('connection', socket => {
     //Join a chat room
     socket.on('join', data => {
       let userList = h.addUserToRoom(allrooms, data, socket);

       // Update the list of the active users as shown on the chatroom page
      //  console.log('userList: ', userList);
      socket.broadcast.to(data.roomID).emit('updateUserList', JSON.stringify(userList.users));
      socket.emit('updateUserList', JSON.stringify(userList.users));
     });
     // When a socket exits
     socket.on('disconnect', () => {
       // Find the room that the socket is connected to and then purge the user.
       let room = h.removeUserFromRoom(allrooms, socket);
       console.log(room);
       socket.broadcast.to(room.roomID).emit('updateUserList', JSON.stringify(room.users));
     });

     socket.on('newMessage', function(data) {
       socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
     });
   });
 }
