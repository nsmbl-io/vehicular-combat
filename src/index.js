import GameEngine from './game/engine';

// Create a global game instance
let game;

// Initialize game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    game = new GameEngine();

    // Add renderer to the page
    document.body.appendChild(game.renderer.domElement);
    game.renderer.setSize(window.innerWidth, window.innerHeight);

    // Handle window resizing
    window.addEventListener('resize', () => {
        game.handleResize();
    });

    // Set up controls
    window.addEventListener('keydown', (e) => {
        game.handleKeyDown(e);
    });

    window.addEventListener('keyup', (e) => {
        game.handleKeyUp(e);
    });

    // Start with vehicle selection
    game.vehicleSelection.animate();
}); 