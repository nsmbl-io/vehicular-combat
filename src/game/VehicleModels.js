import * as THREE from 'three';

export class VehicleModel {
    constructor(name, geometry, materials, stats, special) {
        this.name = name;
        this.geometry = geometry;
        this.materials = materials;
        this.stats = stats;
        this.special = special;
        this.mesh = this.geometry;  // For groups, just use the geometry directly
    }
}

export function createVehicleModels() {
    const vehicles = [];

    // Axel (Giant Two-Wheeled Machine)
    const axelGeometry = new THREE.Group();
    // Main body (cylinder between wheels)
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.position.x = -1.25;
    wheel2.position.x = 1.25;
    wheel1.rotation.z = Math.PI / 2;
    wheel2.rotation.z = Math.PI / 2;
    
    axelGeometry.add(body);
    axelGeometry.add(wheel1);
    axelGeometry.add(wheel2);

    vehicles.push(new VehicleModel(
        'Axel',
        axelGeometry,
        null,
        { speed: 'Medium', armor: 'High', handling: 'Good' },
        'Shockwave'
    ));

    // Outlaw (Police Cruiser)
    const outlawGroup = new THREE.Group();
    // Main body
    const carBody = new THREE.BoxGeometry(2, 0.75, 4);
    const carMaterial = new THREE.MeshStandardMaterial({ color: 0x000066 });
    const mainBody = new THREE.Mesh(carBody, carMaterial);
    
    // Police lights
    const lightGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.6);
    const redLight = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000 });
    const blueLight = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff });
    const lightBar = new THREE.Mesh(lightGeometry, [redLight, blueLight]);
    lightBar.position.y = 0.475;
    
    outlawGroup.add(mainBody);
    outlawGroup.add(lightBar);

    vehicles.push(new VehicleModel(
        'Outlaw',
        outlawGroup,
        null,
        { speed: 'Balanced', armor: 'Balanced', handling: 'Good' },
        'Taser Blast'
    ));

    // Hammerhead (Monster Truck)
    const hammerheadGroup = new THREE.Group();
    // Main body
    const truckBody = new THREE.BoxGeometry(2.5, 1.5, 4);
    const truckMaterial = new THREE.MeshStandardMaterial({ color: 0x800000 });
    const truckMain = new THREE.Mesh(truckBody, truckMaterial);
    
    // Wheels
    const truckWheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    const truckWheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const truckWheel1 = new THREE.Mesh(truckWheelGeometry, truckWheelMaterial);
    const truckWheel2 = new THREE.Mesh(truckWheelGeometry, truckWheelMaterial);
    const truckWheel3 = new THREE.Mesh(truckWheelGeometry, truckWheelMaterial);
    const truckWheel4 = new THREE.Mesh(truckWheelGeometry, truckWheelMaterial);
    
    truckWheel1.position.set(-1.5, 0.8, -1.5);
    truckWheel2.position.set(1.5, 0.8, -1.5);
    truckWheel3.position.set(-1.5, 0.8, 1.5);
    truckWheel4.position.set(1.5, 0.8, 1.5);
    
    hammerheadGroup.add(truckMain);
    hammerheadGroup.add(truckWheel1);
    hammerheadGroup.add(truckWheel2);
    hammerheadGroup.add(truckWheel3);
    hammerheadGroup.add(truckWheel4);

    vehicles.push(new VehicleModel(
        'Hammerhead',
        hammerheadGroup,
        null,
        { speed: 'Low', armor: 'High', handling: 'Poor' },
        'Ground Pound'
    ));

    // Mr. Grimm (Motorcycle)
    const grimmGroup = new THREE.Group();
    // Main body
    const bikeBody = new THREE.BoxGeometry(0.5, 0.3, 2);
    const bikeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const bikeMain = new THREE.Mesh(bikeBody, bikeMaterial);
    
    // Wheels
    const bikeWheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const bikeWheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const bikeWheel1 = new THREE.Mesh(bikeWheelGeometry, bikeWheelMaterial);
    const bikeWheel2 = new THREE.Mesh(bikeWheelGeometry, bikeWheelMaterial);
    
    bikeWheel1.position.set(0, 0.4, -1);
    bikeWheel2.position.set(0, 0.4, 1);
    
    grimmGroup.add(bikeMain);
    grimmGroup.add(bikeWheel1);
    grimmGroup.add(bikeWheel2);

    vehicles.push(new VehicleModel(
        'Mr. Grimm',
        grimmGroup,
        null,
        { speed: 'High', armor: 'Low', handling: 'Excellent' },
        'Ghost Strike'
    ));

    return vehicles;
}

export function getVehicleStats(name) {
    const stats = {
        'Axel': {
            speed: 6,
            armor: 8,
            handling: 7,
            special: 'Shockwave - Emits a 360-degree pulse that damages and knocks back nearby enemies.'
        },
        'Outlaw': {
            speed: 7,
            armor: 7,
            handling: 7,
            special: 'Taser Blast - Stuns enemies briefly and deals damage.'
        },
        'Hammerhead': {
            speed: 4,
            armor: 9,
            handling: 5,
            special: 'Ground Pound - Creates a shockwave that damages and knocks back enemies.'
        },
        'Mr. Grimm': {
            speed: 9,
            armor: 4,
            handling: 9,
            special: 'Ghost Strike - Temporarily becomes invulnerable and passes through enemies.'
        }
    };
    return stats[name] || null;
} 