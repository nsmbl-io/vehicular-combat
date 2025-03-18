import { Game } from './game/Game';

// Initialize the game
const game = new Game();

// Add renderer to the page
document.body.appendChild(game.renderer.domElement);
game.renderer.setSize(window.innerWidth, window.innerHeight);

// Handle window resizing
window.addEventListener('resize', () => {
  game.onWindowResize();
});

// Set up controls
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  Space: false, // For special attacks
  Shift: false  // For turbo boost
};

window.addEventListener('keydown', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

// Game loop
function gameLoop() {
  // Handle rotation
  if (keys.ArrowLeft) game.rotatePlayer(1);    // Rotate left
  if (keys.ArrowRight) game.rotatePlayer(-1);  // Rotate right

  // Handle movement
  if (keys.ArrowUp) game.movePlayer(0, 0, -1);    // Move forward
  if (keys.ArrowDown) game.movePlayer(0, 0, 1);   // Move backward

  // Handle special attacks and turbo
  if (keys.Space) {
    // TODO: Implement special attacks
  }
  if (keys.Shift) {
    // TODO: Implement turbo boost
  }

  // Update and render the game
  game.update();
  game.renderer.render(game.scene, game.camera);
  
  // Continue the game loop
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop(); 