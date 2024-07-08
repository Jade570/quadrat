var options = {
  cors: true,
};

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, options);

// Create an array to hold the cell stacks
const cellStacks = new Array(100).fill().map(() => []);

io.on("connection", (socket) => {
  console.log("a user connected: " + socket.id);

  // Send the current state of all cells to the new client
  socket.emit("initial grid", cellStacks);

  socket.on("cell clicked", (data) => {
    console.log(data);

    // Push the shape to the cell stack
    if (cellStacks[data.cellIndex].length < 4) {
      cellStacks[data.cellIndex].push(data.shape);
    } else {
      // If the cell stack is full, flush it
      cellStacks[data.cellIndex] = [];
    }

    console.log({
      cellIndex: data.cellIndex,
      cellStack: cellStacks[data.cellIndex],
    });

    // Broadcast the 'update grid' event to all other clients
    socket.broadcast.emit("update grid", {
      cellIndex: data.cellIndex,
      cellStack: cellStacks[data.cellIndex],
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected: " + socket.id);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
