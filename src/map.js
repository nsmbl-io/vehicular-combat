import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class WashingtonMap {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.buildings = new Map();
        this.landmarks = new Map();
        this.spawnPoints = [];
        this.weaponSpawnPoints = [];
        
        this.init();
    }

    init() {
        // Create ground plane with Washington, D.C. texture
        this.createGround();
        
        // Add major landmarks
        this.addLandmarks();
        
        // Add buildings and obstacles
        this.addBuildings();
        
        // Add spawn points
        this.setupSpawnPoints();
        
        // Add weapon spawn points
        this.setupWeaponSpawnPoints();
    }

    createGround() {
        // Create a large ground plane
        const groundGeometry = new THREE.PlaneGeometry(500, 500);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.2,
            side: THREE.DoubleSide
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add road network
        this.addRoads();
    }

    addRoads() {
        // Create main roads
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.9,
            metalness: 0.1
        });

        // Pennsylvania Avenue (from White House to Capitol)
        const pennAveGeometry = new THREE.BoxGeometry(100, 1, 10);
        const pennAve = new THREE.Mesh(pennAveGeometry, roadMaterial);
        pennAve.position.set(0, 0.5, 0);
        pennAve.receiveShadow = true;
        this.scene.add(pennAve);

        // Add more roads...
    }

    addLandmarks() {
        // White House
        this.addLandmark('white-house', { x: -50, y: 0, z: 0 }, 20, 30, 20);

        // Washington Monument
        this.addLandmark('washington-monument', { x: 0, y: 0, z: 50 }, 10, 50, 10);

        // Capitol Building
        this.addLandmark('capitol', { x: 50, y: 0, z: 0 }, 30, 20, 30);

        // Lincoln Memorial
        this.addLandmark('lincoln-memorial', { x: 0, y: 0, z: -50 }, 25, 15, 25);
    }

    addLandmark(name, position, width, height, depth) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.7,
            metalness: 0.3
        });
        
        const landmark = new THREE.Mesh(geometry, material);
        landmark.position.set(position.x, height / 2, position.z);
        landmark.castShadow = true;
        landmark.receiveShadow = true;
        
        this.landmarks.set(name, landmark);
        this.scene.add(landmark);
    }

    addBuildings() {
        // Add various buildings around the map
        for (let i = 0; i < 20; i++) {
            const height = Math.random() * 30 + 10;
            const width = Math.random() * 20 + 5;
            const depth = Math.random() * 20 + 5;
            
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshStandardMaterial({
                color: 0x666666,
                roughness: 0.7,
                metalness: 0.3
            });
            
            const building = new THREE.Mesh(geometry, material);
            building.position.x = (Math.random() - 0.5) * 200;
            building.position.z = (Math.random() - 0.5) * 200;
            building.position.y = height / 2;
            
            building.castShadow = true;
            building.receiveShadow = true;
            
            this.buildings.set(`building-${i}`, building);
            this.scene.add(building);
        }
    }

    setupSpawnPoints() {
        // Add spawn points around the map
        this.spawnPoints = [
            { x: -100, y: 0, z: -100 },
            { x: 100, y: 0, z: -100 },
            { x: -100, y: 0, z: 100 },
            { x: 100, y: 0, z: 100 },
            { x: 0, y: 0, z: -100 },
            { x: 0, y: 0, z: 100 }
        ];
    }

    setupWeaponSpawnPoints() {
        // Add weapon spawn points at strategic locations
        this.weaponSpawnPoints = [
            { x: -50, y: 0, z: -50 },
            { x: 50, y: 0, z: -50 },
            { x: -50, y: 0, z: 50 },
            { x: 50, y: 0, z: 50 },
            { x: 0, y: 0, z: 0 }
        ];
    }

    getRandomSpawnPoint() {
        return this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
    }

    getRandomWeaponSpawnPoint() {
        return this.weaponSpawnPoints[Math.floor(Math.random() * this.weaponSpawnPoints.length)];
    }

    isCollision(position, radius) {
        // Check collision with buildings
        for (const building of this.buildings.values()) {
            const buildingBox = new THREE.Box3().setFromObject(building);
            const playerSphere = new THREE.Sphere(position, radius);
            
            if (buildingBox.intersectsSphere(playerSphere)) {
                return true;
            }
        }

        // Check collision with landmarks
        for (const landmark of this.landmarks.values()) {
            const landmarkBox = new THREE.Box3().setFromObject(landmark);
            const playerSphere = new THREE.Sphere(position, radius);
            
            if (landmarkBox.intersectsSphere(playerSphere)) {
                return true;
            }
        }

        return false;
    }
} 