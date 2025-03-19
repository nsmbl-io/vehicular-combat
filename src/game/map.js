import * as THREE from 'three';

class WashingtonMap {
    constructor() {
        this.buildings = new THREE.Group();
        this.setupLandmarks();
    }

    setupLandmarks() {
        // White House (South side)
        this.createWhiteHouse();
        
        // Washington Monument (North side)
        this.createWashingtonMonument();
        
        // Add all buildings to the group
        this.buildings.add(this.whiteHouse);
        this.buildings.add(this.washingtonMonument);
    }

    createWhiteHouse() {
        // Main building group
        this.whiteHouse = new THREE.Group();
        
        // Main building (spans entire south side)
        const mainBuilding = new THREE.BoxGeometry(300, 40, 80);
        const mainMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.7,
            metalness: 0.2
        });
        const main = new THREE.Mesh(mainBuilding, mainMaterial);
        main.position.set(0, 20, 350); // Moved further south
        main.castShadow = true;
        main.receiveShadow = true;
        this.whiteHouse.add(main);

        // North Portico (front entrance)
        const porticoGeometry = new THREE.BoxGeometry(80, 30, 40);
        const porticoMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.6,
            metalness: 0.2
        });
        const portico = new THREE.Mesh(porticoGeometry, porticoMaterial);
        portico.position.set(0, 35, 310);
        this.whiteHouse.add(portico);

        // Add columns to portico
        const columnGeometry = new THREE.CylinderGeometry(3, 3, 30, 8);
        const columnMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.5,
            metalness: 0.1
        });

        for (let i = 0; i < 8; i++) {
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            column.position.set(-28 + i * 8, 15, 290);
            this.whiteHouse.add(column);
        }

        // Add steps/landing for vehicles
        const stepsGeometry = new THREE.BoxGeometry(120, 2, 60);
        const stepsMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.8,
            metalness: 0.2
        });
        const steps = new THREE.Mesh(stepsGeometry, stepsMaterial);
        steps.position.set(0, 1, 270);
        this.whiteHouse.add(steps);

        // Add side wings
        const wingGeometry = new THREE.BoxGeometry(60, 30, 40);
        const wingMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.7,
            metalness: 0.2
        });

        // East Wing
        const eastWing = new THREE.Mesh(wingGeometry, wingMaterial);
        eastWing.position.set(120, 15, 350);
        this.whiteHouse.add(eastWing);

        // West Wing
        const westWing = new THREE.Mesh(wingGeometry, wingMaterial);
        westWing.position.set(-120, 15, 350);
        this.whiteHouse.add(westWing);

        // Add walls
        const wallGeometry = new THREE.BoxGeometry(400, 15, 2);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            roughness: 0.8,
            metalness: 0.1
        });

        // Front wall
        const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
        frontWall.position.set(0, 7.5, 250);
        this.whiteHouse.add(frontWall);

        // Side walls
        const sideWallGeometry = new THREE.BoxGeometry(2, 15, 200);
        const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
        leftWall.position.set(-200, 7.5, 350);
        this.whiteHouse.add(leftWall);

        const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
        rightWall.position.set(200, 7.5, 350);
        this.whiteHouse.add(rightWall);
    }

    createWashingtonMonument() {
        // Main obelisk group
        this.washingtonMonument = new THREE.Group();
        
        // Main obelisk
        const obeliskGeometry = new THREE.BoxGeometry(30, 250, 30);
        const obeliskMaterial = new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            roughness: 0.3,
            metalness: 0.1
        });
        const obelisk = new THREE.Mesh(obeliskGeometry, obeliskMaterial);
        obelisk.position.set(0, 125, -350); // Moved further north
        obelisk.castShadow = true;
        obelisk.receiveShadow = true;
        this.washingtonMonument.add(obelisk);

        // Pyramid top
        const pyramidGeometry = new THREE.ConeGeometry(21, 30, 4);
        const pyramidMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.3,
            metalness: 0.2
        });
        const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
        pyramid.position.set(0, 265, -350);
        pyramid.rotation.y = Math.PI / 4; // Rotate 45 degrees
        this.washingtonMonument.add(pyramid);

        // Base
        const baseGeometry = new THREE.BoxGeometry(60, 20, 60);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.8,
            metalness: 0.2
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, 10, -350);
        this.washingtonMonument.add(base);

        // Landing/plaza
        const plazaGeometry = new THREE.BoxGeometry(200, 1, 200);
        const plazaMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.9,
            metalness: 0.1
        });
        const plaza = new THREE.Mesh(plazaGeometry, plazaMaterial);
        plaza.position.set(0, 0.5, -350);
        plaza.receiveShadow = true;
        this.washingtonMonument.add(plaza);

        // Add corner pillars around plaza
        const pillarGeometry = new THREE.CylinderGeometry(5, 5, 20, 8);
        const pillarMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.7,
            metalness: 0.2
        });

        const pillarPositions = [
            [-90, -440], // Northwest
            [90, -440],  // Northeast
            [-90, -260], // Southwest
            [90, -260]   // Southeast
        ];

        pillarPositions.forEach(([x, z]) => {
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(x, 10, z);
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            this.washingtonMonument.add(pillar);
        });
    }

    addToScene(scene) {
        scene.add(this.buildings);
    }

    dispose() {
        // Dispose of all geometries and materials
        this.buildings.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry.dispose();
                object.material.dispose();
            }
        });
    }
}

export default WashingtonMap; 