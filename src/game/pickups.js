import * as THREE from 'three';
import * as Weapons from './weapons';

// Base class for all pickups
class Pickup {
    constructor(position) {
        this.position = position.clone();
        this.mesh = null;
        this.createMesh();
        this.respawnTime = 30000; // 30 seconds
        this.isActive = true;
    }

    createMesh() {
        // Override in child classes
    }

    collect(vehicle) {
        // Override in child classes
        this.isActive = false;
        setTimeout(() => {
            this.isActive = true;
        }, this.respawnTime);
    }

    update(deltaTime) {
        if (this.mesh && this.isActive) {
            // Rotate and bob up and down
            this.mesh.rotation.y += deltaTime;
            this.mesh.position.y = this.position.y + Math.sin(Date.now() * 0.003) * 0.5;
        }
    }

    dispose() {
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
    }
}

// Health pickups
export class HealthPickup extends Pickup {
    constructor(position, isFullHealth = false) {
        super(position);
        this.healAmount = isFullHealth ? 999 : 50;
        this.respawnTime = isFullHealth ? 60000 : 20000;
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
    }

    collect(vehicle) {
        if (this.isActive) {
            vehicle.heal(this.healAmount);
            super.collect(vehicle);
        }
    }
}

// Weapon pickups
export class WeaponPickup extends Pickup {
    constructor(position, weaponType) {
        super(position);
        this.weaponType = weaponType;
        this.respawnTime = 45000;
    }

    createMesh() {
        const geometry = new THREE.TetrahedronGeometry(1);
        const material = new THREE.MeshStandardMaterial({
            color: this.getWeaponColor(),
            emissive: this.getWeaponColor(),
            emissiveIntensity: 0.5
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
    }

    getWeaponColor() {
        switch (this.weaponType) {
            case 'FreezeMissile':
                return 0x00ffff;
            case 'FireMissile':
                return 0xff4400;
            case 'HomingMissile':
                return 0xff8800;
            case 'PowerMissile':
                return 0xff0000;
            default:
                return 0xffff00;
        }
    }

    collect(vehicle) {
        if (this.isActive) {
            const WeaponClass = Weapons[this.weaponType];
            if (WeaponClass) {
                vehicle.pickupWeapon = new WeaponClass();
            }
            super.collect(vehicle);
        }
    }
}

// Turbo boost pickup
export class TurboPickup extends Pickup {
    constructor(position) {
        super(position);
        this.boostFactor = 2.0;
        this.boostDuration = 5000; // 5 seconds
        this.respawnTime = 30000;
    }

    createMesh() {
        const geometry = new THREE.ConeGeometry(0.5, 1.5, 4);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.5
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
    }

    collect(vehicle) {
        if (this.isActive) {
            vehicle.applyBoost(this.boostFactor, this.boostDuration);
            super.collect(vehicle);
        }
    }
}

// Factory function to create pickups
export function createPickup(type, position, options = {}) {
    switch (type) {
        case 'health':
            return new HealthPickup(position, options.isFullHealth);
        case 'weapon':
            return new WeaponPickup(position, options.weaponType);
        case 'turbo':
            return new TurboPickup(position);
        default:
            throw new Error(`Unknown pickup type: ${type}`);
    }
} 