import * as THREE from 'three';

// Base Weapon class
class Weapon {
    constructor(config) {
        this.damage = config.damage || 10;
        this.cooldown = config.cooldown || 1000; // milliseconds
        this.lastFired = 0;
        this.projectileSpeed = config.projectileSpeed || 50;
        this.projectileGeometry = config.projectileGeometry || new THREE.SphereGeometry(0.2, 8, 8);
        this.projectileMaterial = config.projectileMaterial || new THREE.MeshStandardMaterial({
            color: config.projectileColor || 0xffff00,
            emissive: config.projectileColor || 0xffff00,
            emissiveIntensity: 0.5
        });
    }

    canFire() {
        return Date.now() - this.lastFired >= this.cooldown;
    }

    createProjectile(position, direction) {
        const projectile = new THREE.Mesh(this.projectileGeometry, this.projectileMaterial);
        projectile.position.copy(position);
        projectile.userData.direction = direction;
        projectile.userData.speed = this.projectileSpeed;
        projectile.userData.damage = this.damage;
        projectile.userData.type = 'projectile';
        return projectile;
    }
}

// Standard Weapons
export class MachineGun extends Weapon {
    constructor() {
        super({
            damage: 5,
            cooldown: 200,
            projectileSpeed: 70,
            projectileColor: 0xff0000
        });
    }
}

export class HeavyMachineGun extends Weapon {
    constructor() {
        super({
            damage: 8,
            cooldown: 300,
            projectileSpeed: 60,
            projectileColor: 0xff4400,
            projectileGeometry: new THREE.SphereGeometry(0.3, 8, 8)
        });
    }
}

export class RapidFireMachineGun extends Weapon {
    constructor() {
        super({
            damage: 3,
            cooldown: 100,
            projectileSpeed: 80,
            projectileColor: 0xff8800
        });
    }
}

export class LightweightMachineGun extends Weapon {
    constructor() {
        super({
            damage: 4,
            cooldown: 150,
            projectileSpeed: 90,
            projectileColor: 0xffaa00
        });
    }
}

export class HeavyCannon extends Weapon {
    constructor() {
        super({
            damage: 15,
            cooldown: 500,
            projectileSpeed: 50,
            projectileColor: 0xff2200,
            projectileGeometry: new THREE.SphereGeometry(0.4, 8, 8)
        });
    }
}

// Special Weapons
export class Shockwave extends Weapon {
    constructor() {
        super({
            damage: 20,
            cooldown: 5000,
            projectileGeometry: new THREE.RingGeometry(0, 10, 32),
            projectileMaterial: new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.5
            })
        });
    }

    createEffect(position) {
        const wave = new THREE.Mesh(this.projectileGeometry, this.projectileMaterial);
        wave.position.copy(position);
        wave.rotation.x = -Math.PI / 2;
        wave.userData.type = 'shockwave';
        wave.userData.damage = this.damage;
        wave.userData.lifetime = 1000; // milliseconds
        wave.userData.created = Date.now();
        return wave;
    }
}

export class CrushingStomp extends Weapon {
    constructor() {
        super({
            damage: 30,
            cooldown: 8000
        });
    }

    createEffect(position) {
        const geometry = new THREE.CylinderGeometry(0, 15, 5, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.3
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(position);
        effect.userData.type = 'stomp';
        effect.userData.damage = this.damage;
        effect.userData.lifetime = 500;
        effect.userData.created = Date.now();
        return effect;
    }
}

export class TaserShock extends Weapon {
    constructor() {
        super({
            damage: 15,
            cooldown: 4000,
            projectileSpeed: 100,
            projectileGeometry: new THREE.CylinderGeometry(0.1, 0.1, 2, 8),
            projectileColor: 0x00ffff
        });
    }

    createProjectile(position, direction) {
        const projectile = super.createProjectile(position, direction);
        projectile.userData.stunDuration = 2000; // milliseconds
        return projectile;
    }
}

export class GhostMissile extends Weapon {
    constructor() {
        super({
            damage: 25,
            cooldown: 6000,
            projectileSpeed: 40,
            projectileGeometry: new THREE.ConeGeometry(0.3, 1.5, 8),
            projectileMaterial: new THREE.MeshBasicMaterial({
                color: 0x88ffff,
                transparent: true,
                opacity: 0.7
            })
        });
    }

    createProjectile(position, direction) {
        const projectile = super.createProjectile(position, direction);
        projectile.userData.isGhost = true; // Can pass through obstacles
        projectile.userData.homingStrength = 0.1;
        return projectile;
    }
}

export class DrillCharge extends Weapon {
    constructor() {
        super({
            damage: 40,
            cooldown: 10000
        });
    }

    createEffect(vehicle) {
        vehicle.userData.isDrilling = true;
        vehicle.userData.drillDamage = this.damage;
        vehicle.userData.drillDuration = 3000;
        vehicle.userData.drillStarted = Date.now();
        return null; // Effect is applied directly to vehicle
    }
}

export class DiscoInferno extends Weapon {
    constructor() {
        super({
            damage: 10,
            cooldown: 7000
        });
    }

    createEffect(position) {
        const geometry = new THREE.SphereGeometry(15, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.3
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(position);
        effect.userData.type = 'disco';
        effect.userData.damage = this.damage;
        effect.userData.slowEffect = 0.5; // 50% speed reduction
        effect.userData.lifetime = 3000;
        effect.userData.created = Date.now();
        return effect;
    }
}

// Pickup Weapons
export class FreezeMissile extends Weapon {
    constructor() {
        super({
            damage: 5,
            cooldown: 3000,
            projectileSpeed: 50,
            projectileGeometry: new THREE.SphereGeometry(0.3, 8, 8),
            projectileColor: 0x00ffff
        });
    }

    createProjectile(position, direction) {
        const projectile = super.createProjectile(position, direction);
        projectile.userData.freezeDuration = 3000; // milliseconds
        return projectile;
    }
}

export class FireMissile extends Weapon {
    constructor() {
        super({
            damage: 20,
            cooldown: 2000,
            projectileSpeed: 60,
            projectileGeometry: new THREE.ConeGeometry(0.3, 1.2, 8),
            projectileColor: 0xff4400
        });
    }

    createProjectile(position, direction) {
        const projectile = super.createProjectile(position, direction);
        projectile.userData.homingStrength = 0.05;
        return projectile;
    }
}

export class HomingMissile extends Weapon {
    constructor() {
        super({
            damage: 15,
            cooldown: 4000,
            projectileSpeed: 40,
            projectileGeometry: new THREE.ConeGeometry(0.2, 1, 8),
            projectileColor: 0xff8800
        });
    }

    createProjectile(position, direction) {
        const projectile = super.createProjectile(position, direction);
        projectile.userData.homingStrength = 0.2;
        return projectile;
    }
}

export class PowerMissile extends Weapon {
    constructor() {
        super({
            damage: 40,
            cooldown: 5000,
            projectileSpeed: 30,
            projectileGeometry: new THREE.ConeGeometry(0.4, 2, 8),
            projectileColor: 0xff0000
        });
    }
} 