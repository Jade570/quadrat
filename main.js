// Add this at the top of your file
// const socket = io();
const socket = io.connect("localhost:3000");

// Listen for the 'initial grid' event from the server and draw the initial state of all cells
socket.on('initial grid', function(data) {
  data.forEach((cellStack, index) => {
    const cell = grid.children[index];
    cellStack.forEach(shape => {
      const shapeElement = document.createElement('div');
      shapeElement.classList.add('shape', shape);
      cell.appendChild(shapeElement);
    });
    cell.setAttribute('data-shape-count', cellStack.length);
  });
});


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

  // Get the index of the clicked cell
  const cellIndex = Array.from(grid.children).indexOf(cell);

  // Emit the 'cell clicked' event to the server
  socket.emit("cell clicked", {
    id: socket.id,
    shape: shapeType,
    cellIndex: cellIndex,
  });
}

// Listen for the 'update grid' event from the server and update the grid accordingly
socket.on('update grid', function(data) {
  const cell = grid.children[data.cellIndex];
  while (cell.firstChild) {
    cell.removeChild(cell.firstChild);
  }
  data.cellStack.forEach(shape => {
    const shapeElement = document.createElement('div');
    shapeElement.classList.add('shape', shape);
    cell.appendChild(shapeElement);
  });
  cell.setAttribute('data-shape-count', data.cellStack.length);
});

// Function to get a random shape class
function getRandomShape() {
  const shapes = ["circle", "square", "triangle"];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

// Randomly select a shape for the entire grid on page load
const shapeType = getRandomShape();

// Dynamically create 256 cells and attach event listeners
const grid = document.querySelector(".grid");
for (let i = 0; i < 100; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.setAttribute("data-shape-count", "0");
  cell.addEventListener("click", handleCellClick);
  grid.appendChild(cell);
}
