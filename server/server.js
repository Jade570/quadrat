var options = {
    cors: true,
  };

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server,options);

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);

  socket.on('cell clicked', (data) => {
    console.log(data);

    // Broadcast the 'update grid' event to all other clients
    socket.broadcast.emit('update grid', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.id);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
