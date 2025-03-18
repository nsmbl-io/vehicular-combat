import * as THREE from 'three';
import { gsap } from 'gsap';

export const weapons = {
    fireMissile: {
        name: 'Fire Missile',
        description: 'Standard missile with moderate damage',
        damage: 20,
        speed: 15,
        homing: 0.3,
        explosionRadius: 5,
        model: 'fire-missile.glb',
        effects: {
            trail: {
                color: 0xff4400,
                size: 0.5,
                length: 10
            },
            explosion: {
                color: 0xff6600,
                size: 5,
                duration: 0.5
            }
        }
    },
    homingMissile: {
        name: 'Homing Missile',
        description: 'Tracking missile with weak damage',
        damage: 15,
        speed: 12,
        homing: 0.8,
        explosionRadius: 3,
        model: 'homing-missile.glb',
        effects: {
            trail: {
                color: 0x00ff00,
                size: 0.4,
                length: 8
            },
            explosion: {
                color: 0x00cc00,
                size: 3,
                duration: 0.4
            }
        }
    },
    powerMissile: {
        name: 'Power Missile',
        description: 'Heavy missile with high damage',
        damage: 40,
        speed: 8,
        homing: 0,
        explosionRadius: 8,
        model: 'power-missile.glb',
        effects: {
            trail: {
                color: 0xff0000,
                size: 0.8,
                length: 12
            },
            explosion: {
                color: 0xff3300,
                size: 8,
                duration: 0.7
            }
        }
    }
};

export class WeaponSystem {
    constructor(scene) {
        this.scene = scene;
        this.projectiles = new Map();
        this.weaponPickups = new Map();
        this.loader = new THREE.TextureLoader();
    }

    fireWeapon(weaponType, position, rotation, target) {
        const projectile = this.createProjectile(weaponType, position, rotation, target);
        if (projectile) {
            this.projectiles.set(projectile.id, projectile);
            this.scene.add(projectile.mesh);
        }
    }

    createProjectile(weaponType, position, rotation, target) {
        let geometry, material, speed, damage, size;

        switch (weaponType) {
            case 'fireMissile':
                geometry = new THREE.SphereGeometry(0.3, 8, 8);
                material = new THREE.MeshBasicMaterial({ color: 0xff4400 });
                speed = 2;
                damage = 10;
                size = 1;
                break;
            case 'homingMissile':
                geometry = new THREE.ConeGeometry(0.3, 1, 8);
                material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                speed = 3;
                damage = 15;
                size = 1.2;
                break;
            case 'powerMissile':
                geometry = new THREE.SphereGeometry(0.5, 12, 12);
                material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
                speed = 1.5;
                damage = 25;
                size = 1.5;
                break;
            default:
                return null;
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.scale.set(size, size, size);

        return {
            id: `projectile_${Date.now()}`,
            mesh,
            type: weaponType,
            position: position.clone(),
            rotation: rotation.clone(),
            target: target.clone(),
            speed,
            damage,
            direction: new THREE.Vector3()
                .subVectors(target, position)
                .normalize()
                .multiplyScalar(speed)
        };
    }

    updateProjectiles(deltaTime) {
        for (const [id, projectile] of this.projectiles.entries()) {
            // Update position
            projectile.position.add(projectile.direction);
            projectile.mesh.position.copy(projectile.position);

            // Update rotation to face direction
            projectile.mesh.lookAt(projectile.position.clone().add(projectile.direction));

            // Check for collisions
            if (this.checkProjectileCollision(projectile)) {
                this.scene.remove(projectile.mesh);
                this.projectiles.delete(id);
            }
        }
    }

    checkProjectileCollision(projectile) {
        // Check if projectile has traveled too far
        if (projectile.position.distanceTo(projectile.mesh.position) > 100) {
            return true;
        }

        // Check for collisions with environment
        // This would be implemented based on your map's collision system
        return false;
    }

    spawnWeaponPickup(weaponType, position) {
        const pickup = this.createWeaponPickup(weaponType, position);
        if (pickup) {
            this.weaponPickups.set(pickup.id, pickup);
            this.scene.add(pickup.mesh);
        }
    }

    createWeaponPickup(weaponType, position) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: this.getWeaponColor(weaponType),
            transparent: true,
            opacity: 0.8
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);

        // Add floating animation
        gsap.to(mesh.position, {
            y: position.y + 0.5,
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut'
        });

        // Add rotation animation
        gsap.to(mesh.rotation, {
            y: Math.PI * 2,
            duration: 2,
            repeat: -1,
            ease: 'none'
        });

        return {
            id: `pickup_${Date.now()}`,
            mesh,
            type: weaponType,
            position: position.clone()
        };
    }

    getWeaponColor(weaponType) {
        switch (weaponType) {
            case 'fireMissile':
                return 0xff4400;
            case 'homingMissile':
                return 0x00ff00;
            case 'powerMissile':
                return 0xff00ff;
            default:
                return 0xffffff;
        }
    }

    collectWeaponPickup(pickupId) {
        const pickup = this.weaponPickups.get(pickupId);
        if (pickup) {
            this.scene.remove(pickup.mesh);
            this.weaponPickups.delete(pickupId);
            return pickup.type;
        }
        return null;
    }

    updateWeaponPickups() {
        for (const [id, pickup] of this.weaponPickups.entries()) {
            // Add any pickup-specific updates here
            // For example, pulsing effects or particle systems
        }
    }
}