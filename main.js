// Add this at the top of your file
// const socket = io();
const socket = io.connect('localhost:3000');

// Function to handle cell clicks
function handleCellClick(event) {
  const cell = event.currentTarget;
  let shapeCount = parseInt(cell.getAttribute("data-shape-count"));

  if (shapeCount < 4) {
    const shape = document.createElement("div");
    shape.classList.add("shape", shapeType);
    cell.appendChild(shape);
    cell.setAttribute("data-shape-count", shapeCount + 1);
  } else if (shapeCount === 4) {
    while (cell.firstChild) {
      cell.removeChild(cell.firstChild);
    }
    cell.setAttribute("data-shape-count", 0);
  }

  // Emit the 'cell clicked' event to the server
  socket.emit("cell clicked", {
    id: socket.id,
    shape: shapeType,
    cellState: cell.getAttribute("data-shape-count"),
  });
}

// Listen for the 'update grid' event from the server and update the grid accordingly
socket.on('update grid', function(data) {
  // Update your grid based on the data received from the server
});

// Function to get a random shape class
function getRandomShape() {
  // const shapes = ['circle', 'square', 'triangle'];
  const shapes = ["square"];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

// Randomly select a shape for the entire grid on page load
const shapeType = getRandomShape();

// Dynamically create 256 cells and attach event listeners
const grid = document.querySelector(".grid");
for (let i = 0; i < 256; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.setAttribute("data-shape-count", "0");
  cell.addEventListener("click", handleCellClick);
  grid.appendChild(cell);
}
