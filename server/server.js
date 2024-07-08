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

    // Calculate the density, frequency, relative density, and relative frequency of each shape
    const shapeCounts = { circle: 0, square: 0, triangle: 0 };
    const cellCounts = { circle: 0, square: 0, triangle: 0 };
    cellStacks.forEach((cellStack) => {
      const shapeSet = new Set(cellStack);
      shapeSet.forEach((shape) => {
        shapeCounts[shape] += cellStack.filter((s) => s === shape).length;
        cellCounts[shape]++;
      });
    });
    const totalShapes = Object.values(shapeCounts).reduce((a, b) => a + b, 0);
    const totalCells = Object.values(cellCounts).reduce((a, b) => a + b, 0);
    const shapeStats = {
      circle: {
        density: shapeCounts.circle,
        frequency: cellCounts.circle,
        relativeDensity: shapeCounts.circle / totalShapes,
        relativeFrequency: cellCounts.circle / totalCells,
      },
      square: {
        density: shapeCounts.square,
        frequency: cellCounts.square,
        relativeDensity: shapeCounts.square / totalShapes,
        relativeFrequency: cellCounts.square / totalCells,
      },
      triangle: {
        density: shapeCounts.triangle,
        frequency: cellCounts.triangle,
        relativeDensity: shapeCounts.triangle / totalShapes,
        relativeFrequency: cellCounts.triangle / totalCells,
      },
    };

    console.log({
      cellIndex: data.cellIndex,
      cellStack: cellStacks[data.cellIndex],
      shapeStats: shapeStats
    });

    // Broadcast the 'update grid' event to all other clients
    socket.broadcast.emit("update grid", {
      cellIndex: data.cellIndex,
      cellStack: cellStacks[data.cellIndex],
      shapeStats: shapeStats
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected: " + socket.id);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
