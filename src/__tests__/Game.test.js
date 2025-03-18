import { Game } from '../game/Game';

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  test('should initialize with correct properties', () => {
    expect(game).toBeDefined();
    expect(game.scene).toBeDefined();
    expect(game.camera).toBeDefined();
    expect(game.renderer).toBeDefined();
  });

  test('should handle player movement', () => {
    const initialPosition = game.player.position.clone();
    game.movePlayer(1, 0, 0); // Move right by 1 unit
    expect(game.player.position.x).toBe(initialPosition.x + 1);
  });

  test('should handle collision detection', () => {
    const player = game.player;
    const obstacle = game.createObstacle();
    
    // Position player and obstacle to collide
    player.position.x = 0;
    player.position.y = 0;
    player.position.z = 0;
    
    obstacle.position.x = 0;
    obstacle.position.y = 0;
    obstacle.position.z = 0;
    
    expect(game.checkCollision(player, obstacle)).toBe(true);
  });
}); 