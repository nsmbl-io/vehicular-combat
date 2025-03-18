import * as THREE from 'three';
import { createVehicleModels, getVehicleStats } from './VehicleModels';

export class VehicleSelection {
    constructor(scene, camera, renderer) {
        console.log('Initializing VehicleSelection...');
        
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.vehicles = createVehicleModels();
        console.log('Created vehicles:', this.vehicles);
        
        this.selectedVehicle = null;
        this.isSelecting = true;
        this.backgroundGame = null;
        this.currentModelRotation = 0;
        
        // Create model viewer scene
        this.setupModelViewer();
        console.log('Model viewer setup complete');
        
        // Create UI container
        this.uiContainer = document.createElement('div');
        this.uiContainer.className = 'vehicle-selection-ui';
        document.body.appendChild(this.uiContainer);
        console.log('UI container added to document');
        
        // Style the UI
        this.setupStyles();
        console.log('Styles applied');
        
        // Initialize vehicle selection UI
        this.initializeVehicles();
        console.log('Vehicles initialized');
        
        // Start model rotation animation
        this.animate();
        console.log('Animation started');

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Ensure the UI is visible
        this.uiContainer.style.display = 'flex';
        this.uiContainer.style.zIndex = '1000';
        console.log('VehicleSelection initialization complete');
    }

    setupModelViewer() {
        // Create a separate scene for the model viewer
        this.modelScene = new THREE.Scene();
        this.modelCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        this.modelCamera.position.set(0, 2, 5);
        this.modelCamera.lookAt(0, 0, 0);

        // Add lighting to the model viewer
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        this.modelScene.add(light);
        this.modelScene.add(new THREE.AmbientLight(0x404040));

        // Create renderer for model viewer
        this.modelRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.modelRenderer.setSize(300, 300);
        this.modelRenderer.setClearColor(0x000000, 0);
    }

    onWindowResize() {
        // Update model viewer size
        const modelViewer = document.querySelector('.model-viewer');
        if (modelViewer) {
            const rect = modelViewer.getBoundingClientRect();
            this.modelRenderer.setSize(rect.width, rect.height);
            this.modelCamera.aspect = rect.width / rect.height;
            this.modelCamera.updateProjectionMatrix();
        }
    }

    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .vehicle-selection-ui {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.7);
                z-index: 1000;
            }
            
            .vehicle-selection-container {
                display: flex;
                gap: 40px;
                align-items: center;
                max-width: 1200px;
                padding: 20px;
                width: 100%;
            }
            
            .model-viewer {
                width: 300px;
                height: 300px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                position: relative;
                overflow: hidden;
            }
            
            .model-viewer canvas {
                border-radius: 8px;
                width: 100% !important;
                height: 100% !important;
            }
            
            .vehicle-info {
                flex: 1;
                color: white;
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                min-width: 300px;
            }
            
            .vehicle-stats {
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 10px;
                margin-top: 20px;
            }
            
            .stat-bar {
                width: 200px;
                height: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                overflow: hidden;
            }
            
            .stat-fill {
                height: 100%;
                background: #ff0000;
                transition: width 0.3s ease;
            }
            
            .vehicle-list {
                display: flex;
                gap: 10px;
                margin-top: 20px;
                overflow-x: auto;
                padding: 10px;
                max-width: 100%;
                justify-content: center;
            }
            
            .vehicle-thumbnail {
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid transparent;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8em;
                color: white;
                text-align: center;
                padding: 5px;
                flex-shrink: 0;
            }
            
            .vehicle-thumbnail:hover {
                border-color: #ff4444;
                transform: scale(1.05);
            }
            
            .vehicle-thumbnail.selected {
                border-color: #ff0000;
                background: rgba(255, 0, 0, 0.2);
            }
            
            .start-button {
                margin-top: 20px;
                padding: 15px 40px;
                font-size: 1.2em;
                background: #ff0000;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            
            .start-button:hover {
                background: #cc0000;
            }
            
            .start-button:disabled {
                background: #666;
                cursor: not-allowed;
            }
            
            .special-attack {
                margin-top: 20px;
                padding: 10px;
                background: rgba(255, 0, 0, 0.2);
                border-radius: 5px;
            }

            @media (max-width: 768px) {
                .vehicle-selection-container {
                    flex-direction: column;
                    align-items: center;
                }

                .model-viewer {
                    width: 250px;
                    height: 250px;
                }

                .vehicle-info {
                    width: 100%;
                    max-width: 400px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    initializeVehicles() {
        const container = document.createElement('div');
        container.className = 'vehicle-selection-container';

        // Create model viewer
        const modelViewer = document.createElement('div');
        modelViewer.className = 'model-viewer';
        modelViewer.appendChild(this.modelRenderer.domElement);

        // Create vehicle info panel
        const vehicleInfo = document.createElement('div');
        vehicleInfo.className = 'vehicle-info';

        // Create vehicle list
        const vehicleList = document.createElement('div');
        vehicleList.className = 'vehicle-list';

        this.vehicles.forEach(vehicle => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'vehicle-thumbnail';
            thumbnail.textContent = vehicle.name;
            thumbnail.addEventListener('click', () => this.selectVehicle(vehicle));
            vehicleList.appendChild(thumbnail);
        });

        container.appendChild(modelViewer);
        container.appendChild(vehicleInfo);
        this.uiContainer.appendChild(container);
        this.uiContainer.appendChild(vehicleList);

        // Add start button
        const startButton = document.createElement('button');
        startButton.className = 'start-button';
        startButton.textContent = 'Start Game';
        startButton.disabled = true;
        startButton.addEventListener('click', () => this.startGame());
        this.uiContainer.appendChild(startButton);
        this.startButton = startButton;

        // Select first vehicle by default
        if (this.vehicles.length > 0) {
            this.selectVehicle(this.vehicles[0]);
        }

        // Initial resize
        this.onWindowResize();
    }

    selectVehicle(vehicle) {
        this.selectedVehicle = vehicle;
        this.startButton.disabled = false;
        
        // Update UI to show selection
        document.querySelectorAll('.vehicle-thumbnail').forEach(thumb => {
            thumb.classList.remove('selected');
            if (thumb.textContent === vehicle.name) {
                thumb.classList.add('selected');
            }
        });

        // Update model viewer
        this.modelScene.clear();
        this.modelScene.add(new THREE.AmbientLight(0x404040));
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        this.modelScene.add(light);

        try {
            if (vehicle.geometry instanceof THREE.Group) {
                this.modelScene.add(vehicle.geometry);
            } else if (vehicle.mesh) {
                this.modelScene.add(vehicle.mesh);
            } else {
                console.error('Invalid vehicle model:', vehicle);
                return;
            }
        } catch (error) {
            console.error('Error adding vehicle to scene:', error);
        }

        // Update vehicle info
        const vehicleInfo = document.querySelector('.vehicle-info');
        const stats = getVehicleStats(vehicle.name);
        if (stats) {
            vehicleInfo.innerHTML = `
                <h2>${vehicle.name}</h2>
                <div class="vehicle-stats">
                    <div>Speed:</div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${(stats.speed / 10) * 100}%"></div>
                    </div>
                    <div>Armor:</div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${(stats.armor / 10) * 100}%"></div>
                    </div>
                    <div>Handling:</div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${(stats.handling / 10) * 100}%"></div>
                    </div>
                </div>
                <div class="special-attack">
                    <strong>Special Attack:</strong><br>
                    ${stats.special}
                </div>
            `;
        } else {
            console.error('No stats found for vehicle:', vehicle.name);
        }
    }

    startGame() {
        if (!this.selectedVehicle) return;
        
        // Remove UI
        this.uiContainer.remove();
        this.isSelecting = false;
        
        // Emit event to start game with selected vehicle
        const event = new CustomEvent('vehicleSelected', {
            detail: { vehicle: this.selectedVehicle }
        });
        document.dispatchEvent(event);
    }

    update() {
        if (this.isSelecting && this.selectedVehicle) {
            // Rotate the selected vehicle model
            this.currentModelRotation += 0.01;
            try {
                if (this.selectedVehicle.geometry instanceof THREE.Group) {
                    this.selectedVehicle.geometry.rotation.y = this.currentModelRotation;
                } else if (this.selectedVehicle.mesh) {
                    this.selectedVehicle.mesh.rotation.y = this.currentModelRotation;
                }
            } catch (error) {
                console.error('Error rotating vehicle model:', error);
            }
            
            // Render the model viewer
            this.modelRenderer.render(this.modelScene, this.modelCamera);
        }
    }

    animate() {
        if (this.isSelecting) {
            requestAnimationFrame(() => this.animate());
            this.update();
        }
    }
} 