import * as THREE from 'three';
import { Axel, Hammerhead, Outlaw, Spectre, Auger, ClubKid } from './vehicles';

class VehicleSelection {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        
        // Set up camera for menu view
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // Vehicle display
        this.vehicles = [
            { class: Axel, name: "Axel", description: "Big Segway - Balanced fighter with shockwave special" },
            { class: Hammerhead, name: "Hammerhead", description: "Monster Truck - Heavy hitter with crushing stomp" },
            { class: Outlaw, name: "Outlaw", description: "Police Car - All-around performer with taser shock" },
            { class: Spectre, name: "Spectre", description: "Sports Car - Fast and agile with ghost missile" },
            { class: Auger, name: "Auger", description: "Rock Driller - Tank-like with powerful drill charge" },
            { class: ClubKid, name: "Club Kid", description: "Party Van - Speed demon with disco inferno" }
        ];

        this.currentVehicleIndex = 0;
        this.vehicleInstance = null;
        this.setupLighting();
        this.createUI();
        this.createVehicleDisplay();

        // Background game view
        this.backgroundRenderer = new THREE.WebGLRenderer({
            canvas: document.createElement('canvas'),
            alpha: true
        });
        this.backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
        this.backgroundRenderer.domElement.style.position = 'absolute';
        this.backgroundRenderer.domElement.style.top = '0';
        this.backgroundRenderer.domElement.style.left = '0';
        this.backgroundRenderer.domElement.style.zIndex = '0';
        document.body.appendChild(this.backgroundRenderer.domElement);

        // Main menu renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '1';
        document.body.appendChild(this.renderer.domElement);

        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        // Add event listeners
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('keydown', this.handleKeyPress);

        // Start animation
        this.animate();
    }

    setupLighting() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);

        // Directional light
        const light = new THREE.DirectionalLight(0xffffff, 0.8);
        light.position.set(5, 5, 5);
        this.scene.add(light);

        // Spotlight for vehicle highlight
        const spotlight = new THREE.SpotLight(0xffffff, 1);
        spotlight.position.set(0, 10, 0);
        spotlight.angle = Math.PI / 4;
        spotlight.penumbra = 0.1;
        spotlight.decay = 2;
        spotlight.distance = 200;
        this.scene.add(spotlight);
    }

    createUI() {
        // Create UI container
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '2';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);

        // Stats panel
        this.statsPanel = document.createElement('div');
        this.statsPanel.style.position = 'absolute';
        this.statsPanel.style.right = '20px';
        this.statsPanel.style.top = '20px';
        this.statsPanel.style.padding = '20px';
        this.statsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.statsPanel.style.color = 'white';
        this.statsPanel.style.fontFamily = 'Arial, sans-serif';
        this.statsPanel.style.borderRadius = '10px';
        container.appendChild(this.statsPanel);

        // Controls info
        const controls = document.createElement('div');
        controls.style.position = 'absolute';
        controls.style.bottom = '20px';
        controls.style.left = '50%';
        controls.style.transform = 'translateX(-50%)';
        controls.style.padding = '10px 20px';
        controls.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        controls.style.color = 'white';
        controls.style.fontFamily = 'Arial, sans-serif';
        controls.style.borderRadius = '5px';
        controls.innerHTML = '← → to select vehicle | ENTER to join battle';
        container.appendChild(controls);

        this.updateStatsPanel();
    }

    updateStatsPanel() {
        const vehicle = this.vehicles[this.currentVehicleIndex];
        const instance = new vehicle.class({});
        
        this.statsPanel.innerHTML = `
            <h2 style="margin: 0 0 10px 0">${vehicle.name}</h2>
            <p style="margin: 0 0 15px 0">${vehicle.description}</p>
            <div style="margin-bottom: 5px">Speed: ${'★'.repeat(instance.speed)}${'☆'.repeat(5-instance.speed)}</div>
            <div style="margin-bottom: 5px">Acceleration: ${'★'.repeat(instance.acceleration)}${'☆'.repeat(5-instance.acceleration)}</div>
            <div style="margin-bottom: 5px">Handling: ${'★'.repeat(instance.handling)}${'☆'.repeat(5-instance.handling)}</div>
            <div style="margin-bottom: 5px">Armor: ${'★'.repeat(instance.armor)}${'☆'.repeat(5-instance.armor)}</div>
            <div style="margin-bottom: 5px">Weight: ${'★'.repeat(instance.weight)}${'☆'.repeat(5-instance.weight)}</div>
            <div style="margin-top: 15px">
                <div>Standard Weapon: ${instance.standardWeapon}</div>
                <div>Special Weapon: ${instance.specialWeapon}</div>
            </div>
        `;
    }

    createVehicleDisplay() {
        if (this.vehicleInstance) {
            this.scene.remove(this.vehicleInstance.mesh);
        }

        const VehicleClass = this.vehicles[this.currentVehicleIndex].class;
        this.vehicleInstance = new VehicleClass({});
        
        // Add to scene and set up rotation animation
        this.scene.add(this.vehicleInstance.mesh);
        this.vehicleInstance.mesh.rotation.y = 0;
    }

    handleKeyPress(event) {
        switch(event.key) {
            case 'ArrowLeft':
                this.currentVehicleIndex = (this.currentVehicleIndex - 1 + this.vehicles.length) % this.vehicles.length;
                this.createVehicleDisplay();
                this.updateStatsPanel();
                break;
            case 'ArrowRight':
                this.currentVehicleIndex = (this.currentVehicleIndex + 1) % this.vehicles.length;
                this.createVehicleDisplay();
                this.updateStatsPanel();
                break;
            case 'Enter':
                this.joinGame();
                break;
        }
    }

    joinGame() {
        // Clean up
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('keydown', this.handleKeyPress);
        document.body.removeChild(this.renderer.domElement);
        document.body.removeChild(this.backgroundRenderer.domElement);

        // Create selected vehicle and add to game
        const VehicleClass = this.vehicles[this.currentVehicleIndex].class;
        const playerVehicle = new VehicleClass({});
        
        // Add vehicle to game and start playing
        this.gameEngine.addPlayerVehicle(playerVehicle);
        this.gameEngine.start();

        // Stop the selection screen animation
        cancelAnimationFrame(this.animationFrame);
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.backgroundRenderer.setSize(width, height);
    }

    animate() {
        this.animationFrame = requestAnimationFrame(this.animate);

        // Rotate vehicle display
        if (this.vehicleInstance && this.vehicleInstance.mesh) {
            this.vehicleInstance.mesh.rotation.y += 0.01;
        }

        // Render background game
        this.backgroundRenderer.render(this.gameEngine.scene, this.gameEngine.camera);

        // Render menu scene
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('keydown', this.handleKeyPress);
        
        if (this.vehicleInstance) {
            this.vehicleInstance.dispose();
        }
        
        this.renderer.dispose();
        this.backgroundRenderer.dispose();
    }
}

export default VehicleSelection; 