import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { socket, gameEvents } from './network.js';
import { vehicles } from './vehicles.js';
import { WashingtonMap } from './map.js';
import { WeaponSystem } from './weapons.js';
import { gsap } from 'gsap';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.loader = new GLTFLoader();
        this.vehicleSelect = document.getElementById('vehicle-select');
        this.loadingScreen = document.getElementById('loading-screen');
        this.hud = document.getElementById('hud');
        this.bossHealth = document.getElementById('boss-health');
        this.bossHealthBar = document.getElementById('boss-health-bar');
        this.players = new Map();
        this.selectedVehicle = null;
        this.map = null;
        this.weaponSystem = null;
        this.keys = new Set();
        this.playerSpeed = 0;
        this.playerRotation = 0;
        this.maxSpeed = 0;
        this.acceleration = 0;
        this.deceleration = 0;
        this.turnSpeed = 0;
        this.lastFireTime = 0;
        this.fireRate = 500; // milliseconds between shots
        this.weapons = [];
        this.currentWeaponIndex = 0;
        this.bossAI = null;
        this.lastUpdateTime = 0;
        this.bossHealth = document.getElementById('boss-health');
        this.bossHealthBar = document.getElementById('boss-health-bar');
        this.bossName = document.getElementById('boss-name');
        this.bossHealth.style.display = 'none';
        this.bossName.style.display = 'none';
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        document.getElementById('game-container').appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);

        // Setup controls for background scene
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Create Washington, D.C. map
        this.map = new WashingtonMap(this.scene);

        // Initialize weapon system
        this.weaponSystem = new WeaponSystem(this.scene);

        // Initialize boss AI
        this.bossAI = new BossAI(this.scene, this.map);

        // Handle boss-related events
        window.addEventListener('bossWeaponFired', (event) => this.handleBossWeaponFired(event.detail));
        window.addEventListener('bossSpecialAttack', (event) => this.handleBossSpecialAttack(event.detail));

        // Show vehicle selection
        this.showVehicleSelection();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // Handle keyboard input
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Handle mouse input
        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // Start animation loop
        this.animate();

        // Hide loading screen
        this.loadingScreen.style.display = 'none';
    }

    createBackgroundScene() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 10, 0);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Add ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add decorative buildings
        this.addDecorativeBuildings();
    }

    addDecorativeBuildings() {
        // Add some simple buildings for the background
        for (let i = 0; i < 10; i++) {
            const height = Math.random() * 20 + 10;
            const geometry = new THREE.BoxGeometry(5, height, 5);
            const material = new THREE.MeshStandardMaterial({
                color: 0x666666,
                roughness: 0.7,
                metalness: 0.3
            });
            const building = new THREE.Mesh(geometry, material);
            building.position.x = (Math.random() - 0.5) * 80;
            building.position.z = (Math.random() - 0.5) * 80;
            building.position.y = height / 2;
            building.castShadow = true;
            building.receiveShadow = true;
            this.scene.add(building);
        }
    }

    showVehicleSelection() {
        this.vehicleSelect.style.display = 'block';
        const vehicleGrid = this.vehicleSelect.querySelector('.vehicle-grid');

        // Add vehicle cards
        vehicles.forEach(vehicle => {
            const card = document.createElement('div');
            card.className = 'vehicle-card';
            card.innerHTML = `
                <h3>${vehicle.name}</h3>
                <p>${vehicle.description}</p>
                <div class="stats-bar">
                    <div class="stats-bar-fill" style="width: ${vehicle.stats.speed}%"></div>
                </div>
                <p>Speed: ${vehicle.speed}</p>
                <div class="stats-bar">
                    <div class="stats-bar-fill" style="width: ${vehicle.stats.armor}%"></div>
                </div>
                <p>Armor: ${vehicle.armor}</p>
                <div class="stats-bar">
                    <div class="stats-bar-fill" style="width: ${vehicle.stats.handling}%"></div>
                </div>
                <p>Handling: ${vehicle.handling}</p>
                <p><strong>Special Attack:</strong> ${vehicle.specialAttack}</p>
                <p>${vehicle.specialAttackDescription}</p>
            `;
            card.addEventListener('click', () => this.selectVehicle(vehicle));
            vehicleGrid.appendChild(card);
        });
    }

    selectVehicle(vehicle) {
        // Remove selection from all cards
        document.querySelectorAll('.vehicle-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Add selection to clicked card
        event.currentTarget.classList.add('selected');
        this.selectedVehicle = vehicle;

        // Set vehicle-specific stats
        this.maxSpeed = vehicle.speed * 0.5;
        this.acceleration = vehicle.speed * 0.01;
        this.deceleration = vehicle.speed * 0.02;
        this.turnSpeed = vehicle.handling * 0.02;

        // Emit vehicle selection to server
        gameEvents.selectVehicle(vehicle);

        // Hide vehicle selection after a short delay
        setTimeout(() => {
            this.vehicleSelect.style.display = 'none';
            this.startGame(vehicle);
        }, 1000);
    }

    startGame(vehicle) {
        // Load vehicle model
        this.loader.load(
            `/models/${vehicle.model}`,
            (gltf) => {
                const model = gltf.scene;
                model.scale.set(1, 1, 1);
                
                // Get random spawn point
                const spawnPoint = this.map.getRandomSpawnPoint();
                model.position.set(spawnPoint.x, spawnPoint.y, spawnPoint.z);
                
                this.scene.add(model);
                
                // Add player to local players map
                this.players.set(socket.id, {
                    model,
                    vehicle,
                    position: model.position,
                    rotation: model.rotation,
                    health: vehicle.armor
                });

                // Initialize weapons
                this.weapons = ['fireMissile', 'homingMissile', 'powerMissile'];
                this.currentWeaponIndex = 0;

                // Show boss health bar and name
                this.bossHealth.style.display = 'block';
                this.bossName.style.display = 'block';
                
                // Spawn boss after a delay
                setTimeout(() => {
                    this.bossAI.spawnBoss(this.players.size);
                }, 5000);

                // Update HUD
                this.updateHUD(vehicle);
            },
            undefined,
            (error) => {
                console.error('Error loading vehicle model:', error);
            }
        );
    }

    updateHUD(vehicle) {
        const currentWeapon = this.weapons[this.currentWeaponIndex];
        this.hud.innerHTML = `
            <div>Health: ${vehicle.armor}</div>
            <div>Speed: ${Math.round(this.playerSpeed * 100)}%</div>
            <div>Special Attack: ${vehicle.specialAttack}</div>
            <div>Current Weapon: ${currentWeapon}</div>
            <div>Press 1-3 to switch weapons</div>
        `;
    }

    handleKeyDown(event) {
        this.keys.add(event.key.toLowerCase());
        
        // Handle vehicle movement
        const player = this.players.get(socket.id);
        if (!player) return;

        switch(event.key.toLowerCase()) {
            case 'w':
                this.playerSpeed = Math.min(this.maxSpeed, this.playerSpeed + this.acceleration);
                break;
            case 's':
                this.playerSpeed = Math.max(-this.maxSpeed / 2, this.playerSpeed - this.acceleration);
                break;
            case 'a':
                this.playerRotation += this.turnSpeed;
                break;
            case 'd':
                this.playerRotation -= this.turnSpeed;
                break;
            case ' ':
                this.playerSpeed = Math.max(0, this.playerSpeed - this.deceleration);
                break;
            case 'shift':
                this.playerSpeed = Math.min(this.maxSpeed * 1.5, this.playerSpeed * 1.2);
                break;
            case '1':
            case '2':
            case '3':
                const index = parseInt(event.key) - 1;
                if (index < this.weapons.length) {
                    this.currentWeaponIndex = index;
                    this.updateHUD(player.vehicle);
                }
                break;
        }

        // Update player position
        if (player) {
            const newPosition = player.model.position.clone();
            newPosition.x += Math.sin(this.playerRotation) * this.playerSpeed;
            newPosition.z += Math.cos(this.playerRotation) * this.playerSpeed;

            // Check for collisions
            if (!this.map.isCollision(newPosition, 2)) {
                player.model.position.copy(newPosition);
                player.model.rotation.y = this.playerRotation;
                
                // Emit position update
                gameEvents.playerMove(player.model.position, player.model.rotation);
            }
        }
    }

    handleKeyUp(event) {
        this.keys.delete(event.key.toLowerCase());
        
        // Handle key release
        if (event.key.toLowerCase() === 'w' || event.key.toLowerCase() === 's') {
            this.playerSpeed = Math.max(0, this.playerSpeed - this.deceleration);
        }
    }

    handleMouseDown(event) {
        if (event.button === 0) { // Left click
            this.fireWeapon();
        } else if (event.button === 2) { // Right click
            this.useSpecialAttack();
        }
    }

    handleMouseUp(event) {
        // Handle mouse release if needed
    }

    fireWeapon() {
        const player = this.players.get(socket.id);
        if (!player) return;

        const now = Date.now();
        if (now - this.lastFireTime < this.fireRate) return;

        const weaponType = this.weapons[this.currentWeaponIndex];
        const spawnPosition = player.model.position.clone();
        spawnPosition.y += 1; // Spawn slightly above the vehicle

        // Calculate target position (forward direction)
        const target = new THREE.Vector3(0, 0, -50);
        target.applyQuaternion(player.model.rotation);
        target.add(spawnPosition);

        // Fire weapon
        this.weaponSystem.fireWeapon(weaponType, spawnPosition, player.model.rotation, target);
        gameEvents.fireWeapon(weaponType, target);

        this.lastFireTime = now;
    }

    useSpecialAttack() {
        const player = this.players.get(socket.id);
        if (!player) return;

        gameEvents.useSpecialAttack();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
        this.lastUpdateTime = currentTime;
        
        // Update boss AI
        if (this.bossAI) {
            this.bossAI.update(deltaTime, this.players);
        }
        
        // Update camera position to follow player
        const player = this.players.get(socket.id);
        if (player) {
            const cameraOffset = new THREE.Vector3(
                Math.sin(this.playerRotation) * 20,
                10,
                Math.cos(this.playerRotation) * 20
            );
            this.camera.position.copy(player.model.position).add(cameraOffset);
            this.camera.lookAt(player.model.position);
        } else {
            this.controls.update();
        }

        // Update weapon system
        if (this.weaponSystem) {
            this.weaponSystem.updateProjectiles(0.016); // Assuming 60fps
        }

        this.renderer.render(this.scene, this.camera);
    }

    handleBossWeaponFired(detail) {
        // Handle boss weapon firing
        this.weaponSystem.fireWeapon(
            detail.weaponType,
            detail.position,
            detail.rotation,
            detail.target
        );
    }

    handleBossSpecialAttack(detail) {
        switch (detail.type) {
            case 'flamingClownHead':
                this.handleFlamingClownHead(detail);
                break;
            case 'shadowSlam':
                this.handleShadowSlam(detail);
                break;
            case 'missileStorm':
                this.handleMissileStorm(detail);
                break;
            case 'realityWarp':
                this.handleRealityWarp(detail);
                break;
            case 'apocalypse':
                this.handleApocalypse(detail);
                break;
        }
    }

    handleFlamingClownHead(detail) {
        // Create a large fireball that follows players
        const fireball = new THREE.Mesh(
            new THREE.SphereGeometry(2, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xff4400 })
        );
        fireball.position.copy(detail.position);
        this.scene.add(fireball);

        // Add particle effects
        const particleCount = 50;
        const particles = new Float32Array(particleCount * 3);
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff6600,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        fireball.add(particleSystem);

        // Animate fireball
        const duration = 5;
        const target = this.findNearestPlayer();
        if (target) {
            gsap.to(fireball.position, {
                x: target.position.x,
                y: target.position.y + 1,
                z: target.position.z,
                duration,
                ease: 'power2.inOut',
                onComplete: () => {
                    this.scene.remove(fireball);
                    this.createExplosion(fireball.position, 5);
                }
            });
        }
    }

    handleShadowSlam(detail) {
        // Create shadow effect
        const shadow = new THREE.Mesh(
            new THREE.CircleGeometry(5, 32),
            new THREE.MeshBasicMaterial({ 
                color: 0x000000,
                transparent: true,
                opacity: 0.5
            })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.copy(detail.position);
        this.scene.add(shadow);

        // Create shockwave effect
        const shockwave = new THREE.Mesh(
            new THREE.RingGeometry(0, 5, 32),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            })
        );
        shockwave.rotation.x = -Math.PI / 2;
        shockwave.position.copy(detail.position);
        this.scene.add(shockwave);

        // Animate shadow slam
        gsap.to(shadow.material, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                this.scene.remove(shadow);
                this.createExplosion(detail.position, 8);
            }
        });

        // Animate shockwave
        gsap.to(shockwave.scale, {
            x: 3,
            z: 3,
            duration: 1
        });
        gsap.to(shockwave.material, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                this.scene.remove(shockwave);
            }
        });
    }

    handleMissileStorm(detail) {
        // Fire multiple homing missiles in different directions
        const missileCount = 8;
        for (let i = 0; i < missileCount; i++) {
            const angle = (i / missileCount) * Math.PI * 2;
            const target = new THREE.Vector3(
                Math.cos(angle) * 50,
                0,
                Math.sin(angle) * 50
            );
            target.add(detail.position);

            this.weaponSystem.fireWeapon(
                'homingMissile',
                detail.position,
                new THREE.Euler(0, angle, 0),
                target
            );
        }

        // Add visual effect for missile launch
        const launchEffect = new THREE.Mesh(
            new THREE.CircleGeometry(3, 32),
            new THREE.MeshBasicMaterial({
                color: 0xff6600,
                transparent: true,
                opacity: 0.8
            })
        );
        launchEffect.rotation.x = -Math.PI / 2;
        launchEffect.position.copy(detail.position);
        this.scene.add(launchEffect);

        gsap.to(launchEffect.material, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.scene.remove(launchEffect);
            }
        });
    }

    handleRealityWarp(detail) {
        // Create a distortion field
        const distortionField = new THREE.Mesh(
            new THREE.SphereGeometry(20, 32, 32),
            new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xff00ff) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    void main() {
                        vUv = uv;
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    void main() {
                        vec2 uv = vUv;
                        float dist = length(uv - vec2(0.5));
                        float wave = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
                        float glow = 1.0 - length(vPosition) / 20.0;
                        vec3 finalColor = mix(color, vec3(1.0), wave * glow);
                        gl_FragColor = vec4(finalColor, wave * 0.3);
                    }
                `,
                transparent: true
            })
        );
        distortionField.position.copy(detail.position);
        this.scene.add(distortionField);

        // Animate distortion field
        const duration = 5;
        gsap.to(distortionField.material.uniforms.time, {
            value: duration * 2,
            duration,
            onComplete: () => {
                this.scene.remove(distortionField);
            }
        });
    }

    handleApocalypse(detail) {
        // Combine all special attacks
        this.handleFlamingClownHead(detail);
        this.handleShadowSlam(detail);
        this.handleMissileStorm(detail);
        this.handleRealityWarp(detail);

        // Create environmental hazards
        this.createEnvironmentalHazards(detail.position);

        // Add apocalyptic visual effects
        const apocalypseEffect = new THREE.Mesh(
            new THREE.SphereGeometry(30, 32, 32),
            new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xff0000) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    void main() {
                        vUv = uv;
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    void main() {
                        vec2 uv = vUv;
                        float dist = length(uv - vec2(0.5));
                        float wave = sin(dist * 20.0 - time * 3.0) * 0.5 + 0.5;
                        float glow = 1.0 - length(vPosition) / 30.0;
                        vec3 finalColor = mix(color, vec3(1.0), wave * glow);
                        gl_FragColor = vec4(finalColor, wave * 0.2);
                    }
                `,
                transparent: true
            })
        );
        apocalypseEffect.position.copy(detail.position);
        this.scene.add(apocalypseEffect);

        // Animate apocalyptic effect
        const duration = 10;
        gsap.to(apocalypseEffect.material.uniforms.time, {
            value: duration * 3,
            duration,
            onComplete: () => {
                this.scene.remove(apocalypseEffect);
            }
        });
    }

    createEnvironmentalHazards(center) {
        // Create random obstacles and hazards
        const hazardCount = 5;
        for (let i = 0; i < hazardCount; i++) {
            const angle = (i / hazardCount) * Math.PI * 2;
            const distance = 15 + Math.random() * 10;
            const position = new THREE.Vector3(
                Math.cos(angle) * distance,
                0,
                Math.sin(angle) * distance
            );
            position.add(center);

            const hazard = new THREE.Mesh(
                new THREE.BoxGeometry(2, 2, 2),
                new THREE.MeshBasicMaterial({ 
                    color: 0xff0000,
                    transparent: true,
                    opacity: 0.8
                })
            );
            hazard.position.copy(position);
            this.scene.add(hazard);

            // Animate hazard
            gsap.to(hazard.position, {
                y: 2,
                duration: 1,
                yoyo: true,
                repeat: -1
            });

            // Add particle effects to hazard
            const particleCount = 20;
            const particles = new Float32Array(particleCount * 3);
            const particleGeometry = new THREE.BufferGeometry();
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));

            const particleMaterial = new THREE.PointsMaterial({
                color: 0xff6600,
                size: 0.1,
                transparent: true,
                opacity: 0.6
            });

            const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
            hazard.add(particleSystem);
        }
    }

    createExplosion(position, radius) {
        const particleCount = 50;
        const particles = new Float32Array(particleCount * 3);
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff6600,
            size: 0.2,
            transparent: true,
            opacity: 1
        });

        const explosion = new THREE.Points(particleGeometry, particleMaterial);
        explosion.position.copy(position);
        this.scene.add(explosion);

        // Animate explosion
        gsap.to(particleMaterial, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                this.scene.remove(explosion);
            }
        });
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new Game();
});