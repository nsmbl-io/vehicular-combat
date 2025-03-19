import * as THREE from 'three';
import WashingtonMap from './map';
import VehicleSelection from './VehicleSelection';

class GameEngine {
    constructor() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        // Initialize renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Camera position (adjusted for better view of the larger layout)
        this.camera.position.set(0, 400, 400); // Higher and further back for full map view
        this.camera.lookAt(0, 0, 0);

        // Camera controls
        this.cameraSpeed = 8; // Increased speed for larger map
        this.rotationSpeed = 0.02;
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            Shift: false,
            w: false,
            s: false,
            a: false,
            d: false,
            ' ': false, // Space for standard weapon
            e: false    // E for special weapon
        };

        // Lighting
        this.setupLighting();

        // Ground plane
        this.setupGround();

        // Washington D.C. map
        this.map = new WashingtonMap();
        this.map.addToScene(this.scene);

        // Game state
        this.isRunning = false;
        this.lastTime = 0;
        this.playerVehicle = null;
        this.vehicles = new Set();
        this.projectiles = new Set();
        this.effects = new Set();
        this.pickups = new Set();

        // Vehicle selection screen
        this.vehicleSelection = new VehicleSelection(this);

        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // Add event listeners
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    addPlayerVehicle(vehicle) {
        this.playerVehicle = vehicle;
        this.vehicles.add(vehicle);
        this.scene.add(vehicle.mesh);

        // Position the vehicle at a spawn point
        vehicle.position.set(0, 0, 300); // Start near the White House
        vehicle.mesh.position.copy(vehicle.position);

        // Switch to follow camera
        this.camera.position.set(0, 10, 320);
        this.camera.lookAt(vehicle.position);

        // Make sure the vehicle is properly initialized
        vehicle.mesh.castShadow = true;
        vehicle.mesh.receiveShadow = true;

        console.log('Player vehicle added:', vehicle);
    }

    handleKeyDown(event) {
        if (this.keys.hasOwnProperty(event.key)) {
            this.keys[event.key] = true;
            event.preventDefault();
        }
    }

    handleKeyUp(event) {
        if (this.keys.hasOwnProperty(event.key)) {
            this.keys[event.key] = false;
            event.preventDefault();
        }
    }

    updateCamera(deltaTime) {
        if (this.playerVehicle) {
            // Follow camera for player vehicle
            const idealOffset = new THREE.Vector3(0, 10, 20);
            // Use vehicle's rotation instead of quaternion
            idealOffset.applyEuler(this.playerVehicle.rotation);
            idealOffset.add(this.playerVehicle.position);

            // Smoothly move camera
            this.camera.position.lerp(idealOffset, 0.1);
            
            // Look at vehicle position
            this.camera.lookAt(this.playerVehicle.position);
        } else {
            // Free camera controls
            const moveSpeed = this.cameraSpeed * deltaTime;
            const forward = new THREE.Vector3(0, 0, -1);
            forward.applyQuaternion(this.camera.quaternion);
            forward.y = 0;
            forward.normalize();

            const right = new THREE.Vector3(1, 0, 0);
            right.applyQuaternion(this.camera.quaternion);
            right.y = 0;
            right.normalize();

            if (this.keys.ArrowUp) {
                this.camera.position.add(forward.multiplyScalar(moveSpeed));
            }
            if (this.keys.ArrowDown) {
                this.camera.position.sub(forward.multiplyScalar(moveSpeed));
            }
            if (!this.keys.Shift) {
                if (this.keys.ArrowLeft) {
                    this.camera.position.sub(right.multiplyScalar(moveSpeed));
                }
                if (this.keys.ArrowRight) {
                    this.camera.position.add(right.multiplyScalar(moveSpeed));
                }
            } else {
                if (this.keys.ArrowLeft) {
                    const radius = Math.sqrt(
                        this.camera.position.x * this.camera.position.x +
                        this.camera.position.z * this.camera.position.z
                    );
                    const angle = Math.atan2(this.camera.position.z, this.camera.position.x);
                    const newAngle = angle + this.rotationSpeed;
                    this.camera.position.x = radius * Math.cos(newAngle);
                    this.camera.position.z = radius * Math.sin(newAngle);
                }
                if (this.keys.ArrowRight) {
                    const radius = Math.sqrt(
                        this.camera.position.x * this.camera.position.x +
                        this.camera.position.z * this.camera.position.z
                    );
                    const angle = Math.atan2(this.camera.position.z, this.camera.position.x);
                    const newAngle = angle - this.rotationSpeed;
                    this.camera.position.x = radius * Math.cos(newAngle);
                    this.camera.position.z = radius * Math.sin(newAngle);
                }
            }

            this.camera.lookAt(0, 0, 0);
        }
    }

    updatePlayerVehicle(deltaTime) {
        if (!this.playerVehicle || !this.playerVehicle.isAlive) {
            console.log('No player vehicle or vehicle is not alive');
            return;
        }

        // Log controls state
        if (this.keys.w || this.keys.s || this.keys.a || this.keys.d) {
            console.log('Movement keys:', {
                w: this.keys.w,
                s: this.keys.s,
                a: this.keys.a,
                d: this.keys.d
            });
        }

        // Movement controls
        if (this.keys.w) {
            this.playerVehicle.moveForward(deltaTime);
            console.log('Moving forward');
        }
        if (this.keys.s) {
            this.playerVehicle.moveBackward(deltaTime);
            console.log('Moving backward');
        }
        if (this.keys.a) {
            this.playerVehicle.turnLeft(deltaTime);
            console.log('Turning left');
        }
        if (this.keys.d) {
            this.playerVehicle.turnRight(deltaTime);
            console.log('Turning right');
        }

        // Update mesh position
        this.playerVehicle.mesh.position.copy(this.playerVehicle.position);
        this.playerVehicle.mesh.rotation.copy(this.playerVehicle.rotation);
    }

    updateProjectiles(deltaTime) {
        for (const projectile of this.projectiles) {
            const movement = projectile.userData.direction.clone()
                .multiplyScalar(projectile.userData.speed * deltaTime);
            projectile.position.add(movement);

            // Check for collisions
            // TODO: Implement collision detection

            // Remove projectiles that have traveled too far
            if (projectile.position.length() > 1000) {
                this.scene.remove(projectile);
                this.projectiles.delete(projectile);
            }
        }
    }

    updateEffects(deltaTime) {
        for (const effect of this.effects) {
            if (Date.now() - effect.userData.created >= effect.userData.lifetime) {
                this.scene.remove(effect);
                this.effects.delete(effect);
            } else {
                // Update effect animations
                switch (effect.userData.type) {
                    case 'shockwave':
                        effect.scale.addScalar(deltaTime * 5);
                        effect.material.opacity -= deltaTime;
                        break;
                    case 'stomp':
                        effect.scale.y -= deltaTime * 2;
                        effect.material.opacity -= deltaTime;
                        break;
                    case 'disco':
                        effect.material.opacity = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
                        break;
                }
            }
        }
    }

    updatePickups(deltaTime) {
        for (const pickup of this.pickups) {
            pickup.update(deltaTime);

            // Check for collection by player
            if (this.playerVehicle && pickup.isActive) {
                const distance = pickup.position.distanceTo(this.playerVehicle.position);
                if (distance < 3) {
                    pickup.collect(this.playerVehicle);
                }
            }
        }
    }

    update(deltaTime) {
        // Update all game objects
        this.updatePlayerVehicle(deltaTime);
        this.updateProjectiles(deltaTime);
        this.updateEffects(deltaTime);
        this.updatePickups(deltaTime);

        // Update all vehicles
        for (const vehicle of this.vehicles) {
            vehicle.update(deltaTime);
        }

        // Log game state
        if (this.playerVehicle) {
            console.log('Vehicle position:', this.playerVehicle.position);
            console.log('Camera position:', this.camera.position);
        }
    }

    start() {
        if (!this.isRunning) {
            console.log('Starting game engine');
            this.isRunning = true;
            this.lastTime = performance.now();
            this.animate();
        }
    }

    stop() {
        this.isRunning = false;
    }

    animate(currentTime = 0) {
        if (!this.isRunning) {
            console.log('Game engine stopped');
            return;
        }

        // Calculate delta time
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap at 100ms
        this.lastTime = currentTime;

        // Update camera position
        this.updateCamera(deltaTime);

        // Update game state
        this.update(deltaTime);

        // Render scene
        this.renderer.render(this.scene, this.camera);

        // Request next frame
        requestAnimationFrame(this.animate);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sunlight)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(200, 500, 200);
        directionalLight.target.position.set(0, 0, 0);
        directionalLight.castShadow = true;

        // Improved shadow settings
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 1000;
        directionalLight.shadow.camera.left = -400;
        directionalLight.shadow.camera.right = 400;
        directionalLight.shadow.camera.top = 400;
        directionalLight.shadow.camera.bottom = -400;

        this.scene.add(directionalLight);
        this.scene.add(directionalLight.target);
    }

    setupGround() {
        // Much larger rectangular ground to match TM3 layout
        const groundGeometry = new THREE.PlaneGeometry(500, 800);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5a27, // Darker grass green
            roughness: 0.8,
            metalness: 0.2
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);

        // Main road (North-South)
        const mainRoadGeometry = new THREE.PlaneGeometry(60, 600);
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.9,
            metalness: 0.1
        });
        const mainRoad = new THREE.Mesh(mainRoadGeometry, roadMaterial);
        mainRoad.rotation.x = -Math.PI / 2;
        mainRoad.position.y = 0.1; // Slightly above ground to prevent z-fighting
        this.scene.add(mainRoad);

        // Cross roads (East-West)
        const crossRoadGeometry = new THREE.PlaneGeometry(300, 40);
        const crossRoadPositions = [-200, 0, 200]; // Three cross roads

        crossRoadPositions.forEach(zPos => {
            const crossRoad = new THREE.Mesh(crossRoadGeometry, roadMaterial);
            crossRoad.rotation.x = -Math.PI / 2;
            crossRoad.position.set(0, 0.1, zPos);
            this.scene.add(crossRoad);
        });
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    dispose() {
        this.stop();
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.map.dispose();
        this.renderer.dispose();

        // Clean up vehicles
        for (const vehicle of this.vehicles) {
            vehicle.dispose();
        }
        this.vehicles.clear();

        // Clean up projectiles and effects
        for (const projectile of this.projectiles) {
            this.scene.remove(projectile);
            projectile.geometry.dispose();
            projectile.material.dispose();
        }
        this.projectiles.clear();

        for (const effect of this.effects) {
            this.scene.remove(effect);
            effect.geometry.dispose();
            effect.material.dispose();
        }
        this.effects.clear();

        // Clean up pickups
        for (const pickup of this.pickups) {
            pickup.dispose();
        }
        this.pickups.clear();
    }
}

export default GameEngine; 