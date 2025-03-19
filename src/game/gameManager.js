import GameEngine from './engine';
import Vehicle from './vehicle';

class GameManager {
    constructor() {
        this.engine = new GameEngine();
        this.playerVehicle = null;
        this.inputState = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        this.setupInputHandlers();
    }

    setupInputHandlers() {
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    handleKeyDown(event) {
        switch (event.key.toLowerCase()) {
            case 'w':
                this.inputState.forward = true;
                break;
            case 's':
                this.inputState.backward = true;
                break;
            case 'a':
                this.inputState.left = true;
                break;
            case 'd':
                this.inputState.right = true;
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.key.toLowerCase()) {
            case 'w':
                this.inputState.forward = false;
                break;
            case 's':
                this.inputState.backward = false;
                break;
            case 'a':
                this.inputState.left = false;
                break;
            case 'd':
                this.inputState.right = false;
                break;
        }
    }

    start() {
        // Create a test vehicle
        this.playerVehicle = new Vehicle({
            speed: 3,
            acceleration: 3,
            handling: 3,
            armor: 3,
            weight: 3
        });

        // Add vehicle to scene
        this.engine.scene.add(this.playerVehicle.mesh);

        // Start the game engine
        this.engine.start();
    }

    update(deltaTime) {
        if (this.playerVehicle) {
            // Handle vehicle movement based on input
            if (this.inputState.forward) {
                this.playerVehicle.moveForward(deltaTime);
            }
            if (this.inputState.backward) {
                this.playerVehicle.moveBackward(deltaTime);
            }
            if (this.inputState.left) {
                this.playerVehicle.turnLeft(deltaTime);
            }
            if (this.inputState.right) {
                this.playerVehicle.turnRight(deltaTime);
            }

            // Update vehicle
            this.playerVehicle.update(deltaTime);
        }
    }

    stop() {
        this.engine.stop();
        if (this.playerVehicle) {
            this.playerVehicle.dispose();
        }
    }
}

export default GameManager; 