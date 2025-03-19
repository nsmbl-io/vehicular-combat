import * as THREE from 'three';
import * as Weapons from './weapons';

class Vehicle {
    constructor(config) {
        // Vehicle stats
        this.speed = config.speed || 3;
        this.accelerationRate = config.acceleration || 3;
        this.handling = config.handling || 3;
        this.armor = config.armor || 3;
        this.weight = config.weight || 3;

        // Health and combat
        this.maxHealth = 100 + (this.armor * 20); // More armor = more health
        this.health = this.maxHealth;
        this.isAlive = true;
        this.isStunned = false;
        this.isFrozen = false;
        this.stunEndTime = 0;
        this.freezeEndTime = 0;

        // Physics properties
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Euler();
        this.mesh = null;

        // Movement state
        this.isMoving = false;
        this.currentSpeed = 0;
        this.maxSpeed = this.speed * 2;
        this.turnSpeed = this.handling * 0.1;
        this.boostFactor = 1.0;
        this.slowFactor = 1.0;

        // Weapons
        this.standardWeapon = null;
        this.specialWeapon = null;
        this.pickupWeapon = null;
        this.initializeWeapons();

        // Create placeholder mesh (will be replaced with actual vehicle model)
        this.createPlaceholderMesh();

        // Effects
        this.activeEffects = new Set();
    }

    initializeWeapons() {
        // Standard weapons will be set by child classes
        if (this.standardWeapon) {
            const WeaponClass = Weapons[this.standardWeapon];
            if (WeaponClass) {
                this.standardWeapon = new WeaponClass();
            }
        }

        if (this.specialWeapon) {
            const WeaponClass = Weapons[this.specialWeapon];
            if (WeaponClass) {
                this.specialWeapon = new WeaponClass();
            }
        }
    }

    createPlaceholderMesh() {
        // Create a simple box geometry as placeholder
        const geometry = new THREE.BoxGeometry(2, 1, 4);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x808080,
            roughness: 0.7,
            metalness: 0.3
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    update(deltaTime) {
        if (!this.isAlive) return;

        // Check status effects
        this.updateStatusEffects();

        // Update movement
        if (!this.isFrozen) {
            // Apply speed modifiers
            const effectiveSpeed = this.currentSpeed * this.boostFactor * this.slowFactor;

            // Update position based on velocity
            if (!this.isStunned) {
                const movement = this.velocity.clone().multiplyScalar(deltaTime * effectiveSpeed);
                this.position.add(movement);
            }
        }

        // Apply friction
        this.velocity.multiplyScalar(0.98);

        // Update mesh position and rotation
        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this.mesh.rotation.copy(this.rotation);
        }

        // Update effects
        this.updateEffects(deltaTime);
    }

    updateStatusEffects() {
        const now = Date.now();

        // Check stun status
        if (this.isStunned && now >= this.stunEndTime) {
            this.isStunned = false;
        }

        // Check freeze status
        if (this.isFrozen && now >= this.freezeEndTime) {
            this.isFrozen = false;
        }
    }

    updateEffects(deltaTime) {
        // Update any active effects (shockwaves, drills, etc.)
        for (const effect of this.activeEffects) {
            if (Date.now() - effect.userData.created >= effect.userData.lifetime) {
                this.activeEffects.delete(effect);
                // TODO: Remove effect from scene
            }
        }
    }

    moveForward(deltaTime) {
        if (!this.isAlive || this.isStunned || this.isFrozen) return;

        const accel = this.accelerationRate * deltaTime;
        this.currentSpeed = Math.min(this.currentSpeed + accel, this.maxSpeed);
        
        // Calculate forward direction based on rotation
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyEuler(this.rotation);
        
        // Set velocity directly instead of copying
        this.velocity.set(
            forward.x * this.currentSpeed,
            forward.y * this.currentSpeed,
            forward.z * this.currentSpeed
        );
        this.isMoving = true;
    }

    moveBackward(deltaTime) {
        if (!this.isAlive || this.isStunned || this.isFrozen) return;

        const accel = this.accelerationRate * deltaTime;
        this.currentSpeed = Math.min(this.currentSpeed + accel, this.maxSpeed * 0.5); // Slower in reverse
        
        const backward = new THREE.Vector3(0, 0, 1);
        backward.applyEuler(this.rotation);
        
        // Set velocity directly instead of copying
        this.velocity.set(
            backward.x * this.currentSpeed,
            backward.y * this.currentSpeed,
            backward.z * this.currentSpeed
        );
        this.isMoving = true;
    }

    turnLeft(deltaTime) {
        if (!this.isAlive || this.isStunned || this.isFrozen) return;
        this.rotation.y += this.turnSpeed * deltaTime;
    }

    turnRight(deltaTime) {
        if (!this.isAlive || this.isStunned || this.isFrozen) return;
        this.rotation.y -= this.turnSpeed * deltaTime;
    }

    stop() {
        this.velocity.set(0, 0, 0);
        this.currentSpeed = 0;
        this.isMoving = false;
    }

    fireStandardWeapon(targetPosition) {
        if (!this.isAlive || !this.standardWeapon || this.isStunned || this.isFrozen) return null;

        if (this.standardWeapon.canFire()) {
            const direction = new THREE.Vector3();
            direction.subVectors(targetPosition, this.position).normalize();
            
            const projectilePosition = this.position.clone().add(direction.multiplyScalar(2));
            const projectile = this.standardWeapon.createProjectile(projectilePosition, direction);
            
            this.standardWeapon.lastFired = Date.now();
            return projectile;
        }
        return null;
    }

    fireSpecialWeapon(targetPosition) {
        if (!this.isAlive || !this.specialWeapon || this.isStunned || this.isFrozen) return null;

        if (this.specialWeapon.canFire()) {
            let effect;
            
            if (this.specialWeapon.createEffect) {
                // Area effects (shockwave, stomp, disco)
                effect = this.specialWeapon.createEffect(this.position);
            } else {
                // Projectile-based special weapons
                const direction = new THREE.Vector3();
                direction.subVectors(targetPosition, this.position).normalize();
                effect = this.specialWeapon.createProjectile(this.position, direction);
            }

            if (effect) {
                this.activeEffects.add(effect);
            }
            
            this.specialWeapon.lastFired = Date.now();
            return effect;
        }
        return null;
    }

    firePickupWeapon(targetPosition) {
        if (!this.isAlive || !this.pickupWeapon || this.isStunned || this.isFrozen) return null;

        if (this.pickupWeapon.canFire()) {
            const direction = new THREE.Vector3();
            direction.subVectors(targetPosition, this.position).normalize();
            
            const projectile = this.pickupWeapon.createProjectile(this.position, direction);
            
            this.pickupWeapon.lastFired = Date.now();
            
            // Remove pickup weapon after use
            const result = projectile;
            this.pickupWeapon = null;
            return result;
        }
        return null;
    }

    applyDamage(amount) {
        if (!this.isAlive) return 0;

        const damageMultiplier = 1 - (this.armor * 0.1); // Each point of armor reduces damage by 10%
        const actualDamage = amount * damageMultiplier;
        
        this.health -= actualDamage;
        
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
        
        return actualDamage;
    }

    heal(amount) {
        if (!this.isAlive) return;
        this.health = Math.min(this.health + amount, this.maxHealth);
    }

    applyStun(duration) {
        this.isStunned = true;
        this.stunEndTime = Date.now() + duration;
    }

    applyFreeze(duration) {
        this.isFrozen = true;
        this.freezeEndTime = Date.now() + duration;
    }

    applySlow(factor, duration) {
        this.slowFactor = factor;
        setTimeout(() => {
            this.slowFactor = 1.0;
        }, duration);
    }

    applyBoost(factor, duration) {
        this.boostFactor = factor;
        setTimeout(() => {
            this.boostFactor = 1.0;
        }, duration);
    }

    die() {
        this.isAlive = false;
        this.health = 0;
        this.stop();
        // TODO: Trigger death animation/explosion
    }

    respawn(position) {
        this.isAlive = true;
        this.health = this.maxHealth;
        this.position.copy(position);
        this.rotation.set(0, 0, 0);
        this.velocity.set(0, 0, 0);
        this.currentSpeed = 0;
        this.isStunned = false;
        this.isFrozen = false;
        this.boostFactor = 1.0;
        this.slowFactor = 1.0;
    }

    dispose() {
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
        
        // Clean up effects
        for (const effect of this.activeEffects) {
            if (effect.geometry) effect.geometry.dispose();
            if (effect.material) effect.material.dispose();
        }
        this.activeEffects.clear();
    }
}

export default Vehicle; 