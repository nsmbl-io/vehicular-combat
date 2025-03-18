import * as THREE from 'three';
import { VehicleSelection } from './VehicleSelection';

export class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000);
    document.body.appendChild(this.renderer.domElement);
    
    // Initialize game state
    this.isGameStarted = false;
    this.selectedVehicle = null;
    
    // Set up the scene
    this.setupScene();
    
    // Initialize vehicle selection
    this.vehicleSelection = new VehicleSelection(this.scene, this.camera, this.renderer);
    this.vehicleSelection.backgroundGame = this;
    
    // Listen for vehicle selection
    document.addEventListener('vehicleSelected', (event) => {
      this.selectedVehicle = event.detail.vehicle;
      this.isGameStarted = true;
      this.initializePlayerVehicle();
    });
    
    // Start the game loop
    this.animate();
  }

  setupScene() {
    // Create the floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x666666,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    this.scene.add(floor);
    
    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0x404040));
    
    // Set up camera position for spectator view
    this.camera.position.set(0, 15, 20);
    this.camera.lookAt(0, 0, 0);
  }

  initializePlayerVehicle() {
    // Create a basic vehicle model based on selection
    const geometry = new THREE.BoxGeometry(2, 1, 3);
    const material = new THREE.MeshStandardMaterial({ 
      color: this.getVehicleColor(this.selectedVehicle.name)
    });
    this.player = new THREE.Mesh(geometry, material);
    this.scene.add(this.player);
    
    // Set up camera to follow player
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(this.player.position);
    
    // Initialize movement properties
    this.rotationSpeed = 0.05;
    this.currentRotation = 0;
    this.speed = this.getVehicleSpeed(this.selectedVehicle.name);
    this.armor = this.getVehicleArmor(this.selectedVehicle.name);
  }

  getVehicleColor(vehicleName) {
    // Simple color mapping for vehicles
    const colors = {
      'Axel': 0xff0000,
      'Outlaw': 0x0000ff,
      'Hammerhead': 0x800000,
      'Mr. Grimm': 0x000000,
      'Auger': 0x808080,
      'Club Kid': 0xff00ff,
      'Spectre': 0x00ffff,
      'Firestarter': 0xff6600,
      'Flower Power': 0x00ff00,
      'Thumper': 0xffcc00,
      'Warthog': 0x4a4a4a
    };
    return colors[vehicleName] || 0xffffff;
  }

  getVehicleSpeed(vehicleName) {
    // Speed values based on vehicle stats
    const speeds = {
      'Axel': 0.5,
      'Outlaw': 0.6,
      'Hammerhead': 0.3,
      'Mr. Grimm': 0.8,
      'Auger': 0.2,
      'Club Kid': 0.7,
      'Spectre': 0.9,
      'Firestarter': 0.5,
      'Flower Power': 0.6,
      'Thumper': 0.5,
      'Warthog': 0.3
    };
    return speeds[vehicleName] || 0.5;
  }

  getVehicleArmor(vehicleName) {
    // Armor values based on vehicle stats
    const armor = {
      'Axel': 100,
      'Outlaw': 80,
      'Hammerhead': 120,
      'Mr. Grimm': 60,
      'Auger': 100,
      'Club Kid': 70,
      'Spectre': 50,
      'Firestarter': 90,
      'Flower Power': 70,
      'Thumper': 80,
      'Warthog': 110
    };
    return armor[vehicleName] || 80;
  }

  movePlayer(x, y, z) {
    if (!this.isGameStarted) return;
    
    // Convert local movement to world space based on current rotation
    const angle = this.currentRotation;
    const worldX = x * Math.cos(angle) - z * Math.sin(angle);
    const worldZ = x * Math.sin(angle) + z * Math.cos(angle);
    
    this.player.position.x += worldX * this.speed;
    this.player.position.y += y;
    this.player.position.z += worldZ * this.speed;
    
    // Update camera to follow player
    this.camera.position.x = this.player.position.x;
    this.camera.position.y = this.player.position.y + 5;
    this.camera.position.z = this.player.position.z + 10;
    this.camera.lookAt(this.player.position);
  }

  rotatePlayer(direction) {
    if (!this.isGameStarted) return;
    
    // Update rotation
    this.currentRotation += direction * this.rotationSpeed;
    
    // Apply rotation to player
    this.player.rotation.y = this.currentRotation;
  }

  createObstacle() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(geometry, material);
    this.scene.add(obstacle);
    return obstacle;
  }

  checkCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
  }

  update() {
    // Update vehicle selection if active
    if (this.vehicleSelection && this.vehicleSelection.isSelecting) {
      this.vehicleSelection.update();
      return; // Don't update game state while in vehicle selection
    }
    
    // Update game state if started
    if (this.isGameStarted) {
      // Add any game-specific updates here
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.update();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update vehicle selection UI if active
    if (this.vehicleSelection && this.vehicleSelection.isSelecting) {
      this.vehicleSelection.onWindowResize();
    }
  }
} 