document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    socket.on('initialGridState', (gridState) => {
      renderGrid(gridState);
    });
  
    socket.on('updateGridState', (gridState) => {
      renderGrid(gridState);
    });
  
    function renderGrid(gridState) {
      const grid = document.querySelector('.grid');
      grid.innerHTML = '';
  
      gridState.forEach((cellState, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', index);
        cell.setAttribute('data-shape-count', cellState.shapeCount);
  
        cell.onclick = () => {
          // Simulate the client-side behavior of changing the cell state
          const updatedGridState = [...gridState];
          const updatedCellState = { ...updatedGridState[index] };
          updatedCellState.shapeCount = (updatedCellState.shapeCount + 1) % 5; // Increment shape count
          updatedGridState[index] = updatedCellState;
  
          // Emit the updated grid state to the server
          socket.emit('updateCell', updatedGridState);
        };
  
        // Render shapes based on cellState.shapeCount (your existing logic)
        for (let i = 0; i < cellState.shapeCount; i++) {
          const shape = document.createElement('div');
          shape.className = 'shape';
          // Add appropriate class for shape (circle, square, triangle)
          shape.classList.add(getRandomShape());
          cell.appendChild(shape);
        }
  
        grid.appendChild(cell);
      });
    }
  
    function getRandomShape() {
      const shapes = ['circle', 'square', 'triangle'];
      return shapes[Math.floor(Math.random() * shapes.length)];
    }
  });
  