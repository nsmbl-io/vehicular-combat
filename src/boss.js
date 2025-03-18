import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { bossVehicles } from './vehicles.js';
import { weapons } from './weapons.js';

export class BossAI {
    constructor(scene, map) {
        this.scene = scene;
        this.map = map;
        this.loader = new GLTFLoader();
        this.activeBoss = null;
        this.bossModel = null;
        this.target = null;
        this.state = 'idle'; // idle, chasing, attacking, special
        this.lastAttackTime = 0;
        this.attackCooldown = 2000; // 2 seconds
        this.specialAttackCooldown = 10000; // 10 seconds
        this.lastSpecialAttackTime = 0;
        this.health = 100;
        this.maxHealth = 100;
        this.difficulty = 'easy';
        this.playerCount = 0;
    }

    spawnBoss(playerCount) {
        this.playerCount = playerCount;
        this.difficulty = this.calculateDifficulty(playerCount);
        
        // Select boss based on difficulty
        const availableBosses = bossVehicles.filter(boss => boss.difficulty === this.difficulty);
        const boss = availableBosses[Math.floor(Math.random() * availableBosses.length)];

        // Set boss stats based on difficulty
        this.maxHealth = this.calculateBossHealth(boss, playerCount);
        this.health = this.maxHealth;

        // Load boss model
        this.loader.load(
            `/models/${boss.model}`,
            (gltf) => {
                this.bossModel = gltf.scene;
                this.bossModel.scale.set(1.5, 1.5, 1.5); // Bosses are larger than regular vehicles
                
                // Position boss at a random spawn point
                const spawnPoint = this.map.getRandomSpawnPoint();
                this.bossModel.position.set(spawnPoint.x, spawnPoint.y, spawnPoint.z);
                
                this.scene.add(this.bossModel);
                
                // Initialize boss data
                this.activeBoss = {
                    ...boss,
                    model: this.bossModel,
                    position: this.bossModel.position,
                    rotation: this.bossModel.rotation,
                    speed: boss.stats.speed * 0.5,
                    health: this.health,
                    maxHealth: this.maxHealth
                };

                // Start boss behavior
                this.state = 'chasing';
                this.updateBossHealthBar();
            },
            undefined,
            (error) => {
                console.error('Error loading boss model:', error);
            }
        );
    }

    calculateDifficulty(playerCount) {
        if (playerCount >= 21) return 'twisted';
        if (playerCount >= 16) return 'insane';
        if (playerCount >= 11) return 'hard';
        if (playerCount >= 6) return 'medium';
        return 'easy';
    }

    calculateBossHealth(boss, playerCount) {
        const baseHealth = 100;
        const difficultyMultiplier = {
            'easy': 1,
            'medium': 1.5,
            'hard': 2,
            'insane': 2.5,
            'twisted': 3
        }[this.difficulty];

        return baseHealth * difficultyMultiplier * (1 + playerCount * 0.1);
    }

    updateBossHealthBar() {
        const healthBar = document.getElementById('boss-health-bar');
        if (healthBar) {
            const healthPercent = (this.health / this.maxHealth) * 100;
            healthBar.style.width = `${healthPercent}%`;
        }
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        this.updateBossHealthBar();

        // Boss becomes more aggressive at low health
        if (this.health < this.maxHealth * 0.3) {
            this.attackCooldown = 1000; // Faster attacks
            this.specialAttackCooldown = 5000; // More frequent special attacks
        }

        return this.health <= 0;
    }

    update(deltaTime, players) {
        if (!this.activeBoss || !this.bossModel) return;

        // Find nearest player as target
        this.target = this.findNearestPlayer(players);
        if (!this.target) return;

        // Update boss position and rotation
        this.updateBossMovement(deltaTime);

        // Handle attacks
        this.handleAttacks(deltaTime);

        // Update boss state
        this.updateState();
    }

    findNearestPlayer(players) {
        let nearest = null;
        let minDistance = Infinity;

        for (const player of players.values()) {
            const distance = player.position.distanceTo(this.bossModel.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = player;
            }
        }

        return nearest;
    }

    updateBossMovement(deltaTime) {
        if (!this.target) return;

        // Calculate direction to target
        const direction = new THREE.Vector3()
            .subVectors(this.target.position, this.bossModel.position)
            .normalize();

        // Update rotation to face target
        this.bossModel.rotation.y = Math.atan2(direction.x, direction.z);

        // Move towards target
        const movement = direction.multiplyScalar(this.activeBoss.speed * deltaTime);
        const newPosition = this.bossModel.position.clone().add(movement);

        // Check for collisions
        if (!this.map.isCollision(newPosition, 3)) {
            this.bossModel.position.copy(newPosition);
        }
    }

    handleAttacks(deltaTime) {
        const now = Date.now();

        // Regular attack
        if (now - this.lastAttackTime >= this.attackCooldown) {
            this.performAttack();
            this.lastAttackTime = now;
        }

        // Special attack
        if (now - this.lastSpecialAttackTime >= this.specialAttackCooldown) {
            this.performSpecialAttack();
            this.lastSpecialAttackTime = now;
        }
    }

    performAttack() {
        // Fire weapon based on boss type
        const weaponType = this.activeBoss.specialAttacks[0];
        const spawnPosition = this.bossModel.position.clone();
        spawnPosition.y += 1;

        // Calculate target position
        const target = new THREE.Vector3(0, 0, -50);
        target.applyQuaternion(this.bossModel.rotation);
        target.add(spawnPosition);

        // Emit weapon fired event
        window.dispatchEvent(new CustomEvent('bossWeaponFired', {
            detail: {
                weaponType,
                position: spawnPosition,
                rotation: this.bossModel.rotation,
                target
            }
        }));
    }

    performSpecialAttack() {
        // Boss-specific special attacks
        switch (this.activeBoss.id) {
            case 'sweet-tooth':
                // Flaming Clown Head attack
                this.performFlamingClownHead();
                break;
            case 'darkside':
                // Shadow Slam attack
                this.performShadowSlam();
                break;
            case 'minion':
                // Missile Storm attack
                this.performMissileStorm();
                break;
        }
    }

    performFlamingClownHead() {
        // Create a large fireball that follows players
        const spawnPosition = this.bossModel.position.clone();
        spawnPosition.y += 2;

        window.dispatchEvent(new CustomEvent('bossSpecialAttack', {
            detail: {
                type: 'flamingClownHead',
                position: spawnPosition,
                rotation: this.bossModel.rotation
            }
        }));
    }

    performShadowSlam() {
        // Charge forward and slam into the ground
        const targetPosition = this.target.position.clone();
        const direction = new THREE.Vector3()
            .subVectors(targetPosition, this.bossModel.position)
            .normalize();

        window.dispatchEvent(new CustomEvent('bossSpecialAttack', {
            detail: {
                type: 'shadowSlam',
                direction,
                position: this.bossModel.position
            }
        }));
    }

    performMissileStorm() {
        // Fire multiple homing missiles
        const spawnPosition = this.bossModel.position.clone();
        spawnPosition.y += 2;

        window.dispatchEvent(new CustomEvent('bossSpecialAttack', {
            detail: {
                type: 'missileStorm',
                position: spawnPosition,
                rotation: this.bossModel.rotation
            }
        }));
    }

    updateState() {
        // Update boss state based on health and distance to target
        if (!this.target) return;

        const distance = this.target.position.distanceTo(this.bossModel.position);
        
        if (this.health < this.maxHealth * 0.3) {
            this.state = 'special';
        } else if (distance < 10) {
            this.state = 'attacking';
        } else {
            this.state = 'chasing';
        }
    }

    destroy() {
        if (this.bossModel) {
            this.scene.remove(this.bossModel);
            this.bossModel = null;
        }
        this.activeBoss = null;
        this.health = 0;
        this.updateBossHealthBar();
    }
} 