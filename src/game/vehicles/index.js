import * as THREE from 'three';
import Vehicle from '../vehicle';

// Axel (Big Segway)
export class Axel extends Vehicle {
    constructor() {
        super({
            speed: 3,      // Medium
            acceleration: 2, // Slow
            handling: 2,    // Low
            armor: 4,      // High
            weight: 4      // Heavy
        });
        this.standardWeapon = 'machineGun';
        this.specialWeapon = 'shockwave';
    }

    createPlaceholderMesh() {
        // Create a detailed model based on Twisted Metal 3's Axel
        const group = new THREE.Group();

        // Two large wheels
        const wheelGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            roughness: 0.8
        });
        
        // Left wheel
        const leftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        leftWheel.position.set(-1.5, 1.2, 0);
        leftWheel.rotation.z = Math.PI / 2;
        group.add(leftWheel);
        
        // Right wheel
        const rightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        rightWheel.position.set(1.5, 1.2, 0);
        rightWheel.rotation.z = Math.PI / 2;
        group.add(rightWheel);
        
        // Axle connecting wheels
        const axleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
        const metalMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x555555,
            metalness: 0.7,
            roughness: 0.3
        });
        const axle = new THREE.Mesh(axleGeometry, metalMaterial);
        axle.position.set(0, 1.2, 0);
        axle.rotation.z = Math.PI / 2;
        group.add(axle);
        
        // Standing platform
        const platformGeometry = new THREE.BoxGeometry(1.5, 0.2, 2);
        const platformMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.5
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(0, 0.8, 0);
        group.add(platform);
        
        // Driver (human figure)
        const torsoGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.3);
        const limbMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B0000,
            roughness: 0.7
        });
        const torso = new THREE.Mesh(torsoGeometry, limbMaterial);
        torso.position.set(0, 2.1, 0);
        group.add(torso);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 8, 8);
        const skinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xD2B48C,
            roughness: 0.8
        });
        const head = new THREE.Mesh(headGeometry, skinMaterial);
        head.position.set(0, 2.7, 0);
        group.add(head);
        
        // Arms
        const armGeometry = new THREE.BoxGeometry(0.2, 0.7, 0.2);
        
        const leftArm = new THREE.Mesh(armGeometry, limbMaterial);
        leftArm.position.set(-0.5, 2.1, 0);
        leftArm.rotation.z = -0.3;
        group.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, limbMaterial);
        rightArm.position.set(0.5, 2.1, 0);
        rightArm.rotation.z = 0.3;
        group.add(rightArm);
        
        // Legs
        const legGeometry = new THREE.BoxGeometry(0.25, 0.7, 0.25);
        
        const leftLeg = new THREE.Mesh(legGeometry, limbMaterial);
        leftLeg.position.set(-0.2, 1.35, 0);
        group.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, limbMaterial);
        rightLeg.position.set(0.2, 1.35, 0);
        group.add(rightLeg);

        this.mesh = group;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    useSpecialWeapon() {
        // Shockwave implementation
        console.log('Releasing shockwave!');
        // TODO: Implement shockwave effect
    }
}

// Hammerhead (Monster Truck)
export class Hammerhead extends Vehicle {
    constructor() {
        super({
            speed: 2,      // Low
            acceleration: 3, // Medium
            handling: 2,    // Low
            armor: 4,      // High
            weight: 5      // Very Heavy
        });
        this.standardWeapon = 'heavyMachineGun';
        this.specialWeapon = 'crushingStomp';
    }

    createPlaceholderMesh() {
        // Create a detailed monster truck based on Twisted Metal 3's Hammerhead
        const group = new THREE.Group();

        // Main body - rectangular with overhangs
        const mainBodyGeometry = new THREE.BoxGeometry(3, 1.6, 5);
        const mainBodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xCC0000,  // Deep red
            roughness: 0.7,
            metalness: 0.3
        });
        const mainBody = new THREE.Mesh(mainBodyGeometry, mainBodyMaterial);
        mainBody.position.y = 3;
        group.add(mainBody);

        // Cabin
        const cabinGeometry = new THREE.BoxGeometry(2.6, 1.2, 2);
        const cabinMaterial = new THREE.MeshStandardMaterial({
            color: 0xCC0000,  // Red
            roughness: 0.7,
            metalness: 0.3
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(0, 4.2, -0.8);
        group.add(cabin);

        // Windows
        const windshieldGeometry = new THREE.PlaneGeometry(2.2, 1);
        const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0x88CCFF,
            transparent: true,
            opacity: 0.7,
            metalness: 0.9,
            roughness: 0.2
        });
        const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
        windshield.position.set(0, 4.2, -1.9);
        windshield.rotation.x = Math.PI / 12; // Slight angle
        group.add(windshield);

        // Front grill
        const grillGeometry = new THREE.BoxGeometry(2.8, 0.8, 0.3);
        const grillMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.4
        });
        const grill = new THREE.Mesh(grillGeometry, grillMaterial);
        grill.position.set(0, 2.7, -2.6);
        group.add(grill);

        // Bumper
        const bumperGeometry = new THREE.BoxGeometry(3, 0.4, 0.5);
        const bumperMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.8,
            roughness: 0.2
        });
        const bumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        bumper.position.set(0, 2.2, -2.7);
        group.add(bumper);

        // Exhaust pipes
        const exhaustGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const exhaustMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const leftExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        leftExhaust.position.set(1.4, 3.5, 1.5);
        leftExhaust.rotation.x = Math.PI / 2;
        group.add(leftExhaust);
        
        const rightExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        rightExhaust.position.set(-1.4, 3.5, 1.5);
        rightExhaust.rotation.x = Math.PI / 2;
        group.add(rightExhaust);

        // Suspension system
        const suspensionGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
        const suspensionMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.6,
            roughness: 0.4
        });
        
        // Add suspension for each wheel
        const suspensionPositions = [
            [-1.8, 2, -1.8],  // front left
            [1.8, 2, -1.8],   // front right
            [-1.8, 2, 1.8],   // rear left
            [1.8, 2, 1.8]     // rear right
        ];
        
        suspensionPositions.forEach(pos => {
            const suspension = new THREE.Mesh(suspensionGeometry, suspensionMaterial);
            suspension.position.set(...pos);
            group.add(suspension);
        });

        // Large wheels with detailed tread
        const wheelGeometry = new THREE.CylinderGeometry(1.2, 1.2, 1.0, 24, 8, false);
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Create detailed hub caps
        const hubGeometry = new THREE.CylinderGeometry(0.6, 0.6, 1.01, 8);
        const hubMaterial = new THREE.MeshStandardMaterial({
            color: 0xCCCCCC,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const wheelPositions = [
            [-1.8, 1.2, -1.8],  // front left
            [1.8, 1.2, -1.8],   // front right
            [-1.8, 1.2, 1.8],   // rear left
            [1.8, 1.2, 1.8]     // rear right
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(...pos);
            wheel.rotation.z = Math.PI / 2;
            
            const hub = new THREE.Mesh(hubGeometry, hubMaterial);
            wheel.add(hub);
            
            group.add(wheel);
        });

        this.mesh = group;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    useSpecialWeapon() {
        // Crushing Stomp implementation
        console.log('Performing crushing stomp!');
        // TODO: Implement crushing stomp effect
    }
}

// Outlaw (Police Car)
export class Outlaw extends Vehicle {
    constructor() {
        super({
            speed: 3,      // Medium
            acceleration: 3, // Medium
            handling: 3,    // Medium
            armor: 3,      // Medium
            weight: 3      // Medium
        });
        this.standardWeapon = 'rapidFireMachineGun';
        this.specialWeapon = 'taserShock';
        
        // For light animation
        this.lightTimer = 0;
        this.leftLightOn = true;
        this.updateLights = this.updateLights.bind(this);
    }

    createPlaceholderMesh() {
        // Create a detailed police car based on Twisted Metal 3's Outlaw
        const group = new THREE.Group();

        // Main body (sedan style)
        const bodyGeometry = new THREE.BoxGeometry(2.4, 1, 5);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x000080,  // Navy blue
            roughness: 0.6,
            metalness: 0.4
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.8;
        group.add(body);

        // Cabin/roof
        const roofGeometry = new THREE.BoxGeometry(2.2, 0.8, 2.5);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x000080,  // Navy blue
            roughness: 0.6,
            metalness: 0.4
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, 1.7, -0.2);
        group.add(roof);

        // Windows
        const windshieldGeometry = new THREE.PlaneGeometry(2, 0.8);
        const sideWindowGeometry = new THREE.PlaneGeometry(2.2, 0.7);
        const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0x88CCFF,
            transparent: true,
            opacity: 0.7,
            metalness: 0.9,
            roughness: 0.2
        });
        
        // Front windshield
        const frontWindow = new THREE.Mesh(windshieldGeometry, glassMaterial);
        frontWindow.position.set(0, 1.7, -1.5);
        frontWindow.rotation.x = Math.PI * 0.1;  // Slight angle
        group.add(frontWindow);
        
        // Back windshield
        const backWindow = new THREE.Mesh(windshieldGeometry, glassMaterial);
        backWindow.position.set(0, 1.7, 1.3);
        backWindow.rotation.x = -Math.PI * 0.1;  // Slight angle
        group.add(backWindow);
        
        // Side windows (will only be partially visible from certain angles)
        const leftWindow = new THREE.Mesh(sideWindowGeometry, glassMaterial);
        leftWindow.position.set(-1.21, 1.7, -0.2);
        leftWindow.rotation.y = Math.PI / 2;
        group.add(leftWindow);
        
        const rightWindow = new THREE.Mesh(sideWindowGeometry, glassMaterial);
        rightWindow.position.set(1.21, 1.7, -0.2);
        rightWindow.rotation.y = -Math.PI / 2;
        group.add(rightWindow);

        // Grill and front bumper
        const grillGeometry = new THREE.BoxGeometry(2.2, 0.4, 0.2);
        const grillMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            metalness: 0.8,
            roughness: 0.4
        });
        const grill = new THREE.Mesh(grillGeometry, grillMaterial);
        grill.position.set(0, 0.6, -2.5);
        group.add(grill);
        
        // Front bumper
        const frontBumperGeometry = new THREE.BoxGeometry(2.4, 0.3, 0.4);
        const bumperMaterial = new THREE.MeshStandardMaterial({
            color: 0xCCCCCC,
            metalness: 0.8,
            roughness: 0.2
        });
        const frontBumper = new THREE.Mesh(frontBumperGeometry, bumperMaterial);
        frontBumper.position.set(0, 0.3, -2.6);
        group.add(frontBumper);
        
        // Rear bumper
        const rearBumperGeometry = new THREE.BoxGeometry(2.4, 0.3, 0.4);
        const rearBumper = new THREE.Mesh(rearBumperGeometry, bumperMaterial);
        rearBumper.position.set(0, 0.3, 2.6);
        group.add(rearBumper);

        // Police light bar
        const lightBarGeometry = new THREE.BoxGeometry(1.8, 0.2, 0.8);
        const lightBarMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.7,
            roughness: 0.3
        });
        const lightBar = new THREE.Mesh(lightBarGeometry, lightBarMaterial);
        lightBar.position.set(0, 2.2, -0.2);
        group.add(lightBar);
        
        // Police lights
        const lightGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
        
        // Red light
        const redLightMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF0000,
            emissive: 0xFF0000,
            emissiveIntensity: 0.8
        });
        this.redLight = new THREE.Mesh(lightGeometry, redLightMaterial);
        this.redLight.position.set(-0.5, 2.3, -0.2);
        this.redLight.rotation.x = Math.PI / 2;
        group.add(this.redLight);
        
        // Blue light
        const blueLightMaterial = new THREE.MeshStandardMaterial({
            color: 0x0000FF,
            emissive: 0x0000FF,
            emissiveIntensity: 0.8
        });
        this.blueLight = new THREE.Mesh(lightGeometry, blueLightMaterial);
        this.blueLight.position.set(0.5, 2.3, -0.2);
        this.blueLight.rotation.x = Math.PI / 2;
        group.add(this.blueLight);
        
        // Police markings/decals
        const sideDecalGeometry = new THREE.PlaneGeometry(1.8, 0.6);
        const decalMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.6
        });
        
        // Left side decal
        const leftDecal = new THREE.Mesh(sideDecalGeometry, decalMaterial);
        leftDecal.position.set(-1.21, 0.8, 0);
        leftDecal.rotation.y = Math.PI / 2;
        group.add(leftDecal);
        
        // Right side decal
        const rightDecal = new THREE.Mesh(sideDecalGeometry, decalMaterial);
        rightDecal.position.set(1.21, 0.8, 0);
        rightDecal.rotation.y = -Math.PI / 2;
        group.add(rightDecal);

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.9
        });
        
        const wheelPositions = [
            [-1.0, 0.4, -1.5],  // front left
            [1.0, 0.4, -1.5],   // front right
            [-1.0, 0.4, 1.5],   // rear left
            [1.0, 0.4, 1.5]     // rear right
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(...pos);
            wheel.rotation.z = Math.PI / 2;
            group.add(wheel);
        });

        this.mesh = group;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Start the light animation
        this.updateLights();
    }
    
    updateLights() {
        if (!this.mesh) return;
        
        this.lightTimer++;
        
        if (this.lightTimer % 15 === 0) {
            this.leftLightOn = !this.leftLightOn;
            
            if (this.leftLightOn) {
                // Red light on, blue light off
                this.redLight.material.emissiveIntensity = 0.8;
                this.blueLight.material.emissiveIntensity = 0.2;
            } else {
                // Red light off, blue light on
                this.redLight.material.emissiveIntensity = 0.2;
                this.blueLight.material.emissiveIntensity = 0.8;
            }
        }
        
        // Request next frame update
        requestAnimationFrame(this.updateLights);
    }

    update(deltaTime) {
        super.update(deltaTime);
        // Light animations are handled in updateLights
    }

    useSpecialWeapon() {
        // Taser Shock implementation
        console.log('Firing taser shock!');
        // TODO: Implement taser shock effect
    }
}

// Spectre (Sports Car)
export class Spectre extends Vehicle {
    constructor() {
        super({
            speed: 5,      // High
            acceleration: 5, // High
            handling: 5,    // High
            armor: 2,      // Low
            weight: 1      // Light
        });
        this.standardWeapon = 'lightweightMachineGun';
        this.specialWeapon = 'ghostMissile';
    }

    createPlaceholderMesh() {
        // Create a detailed sports car based on Twisted Metal 3's Spectre
        const group = new THREE.Group();

        // Create base chassis - lower and sleeker
        const chassisGeometry = new THREE.BoxGeometry(2.2, 0.5, 4.8);
        const chassisMaterial = new THREE.MeshStandardMaterial({
            color: 0x30D5C8, // Turquoise/teal
            metalness: 0.8,
            roughness: 0.2
        });
        const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
        chassis.position.y = 0.4;
        group.add(chassis);

        // Create a more aerodynamic body
        const bodyGeometry = new THREE.BoxGeometry(2.0, 0.4, 4.4);
        const body = new THREE.Mesh(bodyGeometry, chassisMaterial);
        body.position.y = 0.85;
        group.add(body);

        // Create sleek, low-profile cabin
        const cabinGeometry = new THREE.BoxGeometry(1.8, 0.5, 2.8);
        const cabinMaterial = new THREE.MeshStandardMaterial({
            color: 0x30D5C8,
            metalness: 0.8,
            roughness: 0.2
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.y = 1.3;
        group.add(cabin);

        // Add curved roof using a cylinder segment
        const roofGeometry = new THREE.CylinderGeometry(1.4, 1.4, 1.8, 16, 1, false, Math.PI, Math.PI);
        const roof = new THREE.Mesh(roofGeometry, cabinMaterial);
        roof.rotation.z = Math.PI / 2;
        roof.position.set(0, 1.3, 0);
        group.add(roof);
        
        // Add windows with blue glass tint
        const windshieldGeometry = new THREE.PlaneGeometry(1.7, 0.8);
        const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0x88CCFF,
            transparent: true,
            opacity: 0.7,
            metalness: 0.9,
            roughness: 0.1
        });
        
        // Front windshield
        const frontWindshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
        frontWindshield.position.set(0, 1.5, -1.2);
        frontWindshield.rotation.x = Math.PI * 0.15; // Angled windshield
        group.add(frontWindshield);
        
        // Rear windshield
        const rearWindshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
        rearWindshield.position.set(0, 1.5, 1.2);
        rearWindshield.rotation.x = -Math.PI * 0.15; // Angled rear window
        group.add(rearWindshield);
        
        // Side windows (only visible from certain angles)
        const sideWindowGeometry = new THREE.PlaneGeometry(2.2, 0.6);
        
        const leftWindow = new THREE.Mesh(sideWindowGeometry, glassMaterial);
        leftWindow.position.set(-1.01, 1.3, 0);
        leftWindow.rotation.y = Math.PI / 2;
        group.add(leftWindow);
        
        const rightWindow = new THREE.Mesh(sideWindowGeometry, glassMaterial);
        rightWindow.position.set(1.01, 1.3, 0);
        rightWindow.rotation.y = -Math.PI / 2;
        group.add(rightWindow);

        // Add front detail (headlights, grill)
        const frontDetailGeometry = new THREE.BoxGeometry(2.0, 0.3, 0.3);
        const chromeMaterial = new THREE.MeshStandardMaterial({
            color: 0xEEEEEE,
            metalness: 0.9,
            roughness: 0.1
        });
        const frontDetail = new THREE.Mesh(frontDetailGeometry, chromeMaterial);
        frontDetail.position.set(0, 0.5, -2.4);
        group.add(frontDetail);
        
        // Add headlights
        const headlightGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
        const headlightMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFCC,
            emissive: 0xFFFFCC,
            emissiveIntensity: 0.5
        });
        
        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(-0.7, 0.5, -2.5);
        leftHeadlight.rotation.x = Math.PI / 2;
        group.add(leftHeadlight);
        
        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(0.7, 0.5, -2.5);
        rightHeadlight.rotation.x = Math.PI / 2;
        group.add(rightHeadlight);
        
        // Add taillights
        const taillightGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
        const taillightMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF0000,
            emissive: 0xFF0000,
            emissiveIntensity: 0.5
        });
        
        const leftTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
        leftTaillight.position.set(-0.7, 0.5, 2.5);
        leftTaillight.rotation.x = Math.PI / 2;
        group.add(leftTaillight);
        
        const rightTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
        rightTaillight.position.set(0.7, 0.5, 2.5);
        rightTaillight.rotation.x = Math.PI / 2;
        group.add(rightTaillight);

        // Add sleek spoiler
        const spoilerMountGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
        const spoilerMountMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const leftSpoilerMount = new THREE.Mesh(spoilerMountGeometry, spoilerMountMaterial);
        leftSpoilerMount.position.set(-0.8, 1.6, 2.2);
        group.add(leftSpoilerMount);
        
        const rightSpoilerMount = new THREE.Mesh(spoilerMountGeometry, spoilerMountMaterial);
        rightSpoilerMount.position.set(0.8, 1.6, 2.2);
        group.add(rightSpoilerMount);
        
        const spoilerGeometry = new THREE.BoxGeometry(2.0, 0.1, 0.5);
        const spoiler = new THREE.Mesh(spoilerGeometry, chassisMaterial);
        spoiler.position.set(0, 1.8, 2.2);
        group.add(spoiler);

        // Sporty low-profile wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.7
        });
        
        // Add metallic hubcaps
        const hubcapGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.21, 8);
        const hubcapMaterial = new THREE.MeshStandardMaterial({
            color: 0xCCCCCC,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const wheelPositions = [
            [-0.9, 0.35, -1.6],  // front left
            [0.9, 0.35, -1.6],   // front right
            [-0.9, 0.35, 1.6],   // rear left
            [0.9, 0.35, 1.6]     // rear right
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(...pos);
            wheel.rotation.z = Math.PI / 2;
            
            const hubcap = new THREE.Mesh(hubcapGeometry, hubcapMaterial);
            wheel.add(hubcap);
            
            group.add(wheel);
        });

        this.mesh = group;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    useSpecialWeapon() {
        // Ghost Missile implementation
        console.log('Firing ghost missile!');
        // TODO: Implement ghost missile effect
    }
}

// Auger (Rock Driller)
export class Auger extends Vehicle {
    constructor() {
        super({
            speed: 2,      // Low
            acceleration: 2, // Low
            handling: 2,    // Low
            armor: 4,      // High
            weight: 5      // Very Heavy
        });
        this.standardWeapon = 'heavyCannon';
        this.specialWeapon = 'drillCharge';
        
        // For drill animation
        this.drillRotation = 0;
        this.updateDrillAnimation = this.updateDrillAnimation.bind(this);
    }

    createPlaceholderMesh() {
        // Create a detailed rock driller based on Twisted Metal 3's Auger
        const group = new THREE.Group();

        // Main heavy-duty base
        const baseGeometry = new THREE.BoxGeometry(3.2, 1.5, 5);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x996633, // Brown/rust
            roughness: 0.8,
            metalness: 0.3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 1.4;
        group.add(base);

        // Cabin structure
        const cabinGeometry = new THREE.BoxGeometry(2.8, 1.5, 2.5);
        const cabinMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666, // Dark grey
            roughness: 0.7,
            metalness: 0.5
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(0, 2.5, 0.5);
        group.add(cabin);

        // Windows
        const windowGeometry = new THREE.PlaneGeometry(2.4, 1);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            transparent: true,
            opacity: 0.7,
            metalness: 0.9,
            roughness: 0.2
        });
        
        // Front window
        const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        frontWindow.position.set(0, 2.8, -0.8);
        frontWindow.rotation.x = Math.PI * 0.1;
        group.add(frontWindow);
        
        // Side windows
        const sideWindowGeometry = new THREE.PlaneGeometry(2, 1);
        
        const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        leftWindow.position.set(-1.41, 2.8, 0.5);
        leftWindow.rotation.y = Math.PI / 2;
        group.add(leftWindow);
        
        const rightWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        rightWindow.position.set(1.41, 2.8, 0.5);
        rightWindow.rotation.y = -Math.PI / 2;
        group.add(rightWindow);

        // Heavy-duty drill assembly
        const drillMountGeometry = new THREE.BoxGeometry(2, 1, 1.5);
        const drillMountMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.6,
            metalness: 0.7
        });
        const drillMount = new THREE.Mesh(drillMountGeometry, drillMountMaterial);
        drillMount.position.set(0, 1.5, -3);
        group.add(drillMount);
        
        // Main drill
        // Create the drill cone
        const drillGeometry = new THREE.ConeGeometry(1, 3, 32);
        const drillMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.8,
            roughness: 0.3
        });
        this.drill = new THREE.Mesh(drillGeometry, drillMaterial);
        this.drill.position.set(0, 1.5, -4.5);
        this.drill.rotation.x = -Math.PI / 2;
        
        // Add spiral drill pattern using cylinder segments wrapped around the cone
        const spiralCount = 8;
        const spiralMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.9,
            roughness: 0.2
        });

        for (let i = 0; i < spiralCount; i++) {
            const angle = (i / spiralCount) * Math.PI * 2;
            const spiralSegment = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.05, 2.8),
                spiralMaterial
            );
            spiralSegment.position.y = -0.1 * i; // Spiral down the cone
            spiralSegment.position.x = 0.4 * Math.cos(angle);
            spiralSegment.position.z = 0.4 * Math.sin(angle);
            spiralSegment.rotation.x = Math.PI / 8; // Angle the spirals
            this.drill.add(spiralSegment);
        }
        
        group.add(this.drill);

        // Add hydraulic arms
        const hydraulicGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8);
        const hydraulicMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFCC00, // Yellow hydraulic tubes
            roughness: 0.5,
            metalness: 0.7
        });
        
        const leftHydraulic = new THREE.Mesh(hydraulicGeometry, hydraulicMaterial);
        leftHydraulic.position.set(-0.8, 1.8, -2);
        leftHydraulic.rotation.z = Math.PI / 4;
        group.add(leftHydraulic);
        
        const rightHydraulic = new THREE.Mesh(hydraulicGeometry, hydraulicMaterial);
        rightHydraulic.position.set(0.8, 1.8, -2);
        rightHydraulic.rotation.z = -Math.PI / 4;
        group.add(rightHydraulic);

        // Exhaust stacks
        const exhaustGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 8);
        const exhaustMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.6,
            metalness: 0.6
        });
        
        const leftExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        leftExhaust.position.set(-1.2, 3.2, 1.8);
        group.add(leftExhaust);
        
        const rightExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        rightExhaust.position.set(1.2, 3.2, 1.8);
        group.add(rightExhaust);

        // Warning lights
        const lightGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16);
        const warningLightMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFCC00,
            emissive: 0xFFCC00,
            emissiveIntensity: 0.5
        });
        
        const warningLight = new THREE.Mesh(lightGeometry, warningLightMaterial);
        warningLight.position.set(0, 3.5, 0.5);
        warningLight.rotation.x = Math.PI / 2;
        group.add(warningLight);

        // Heavy-duty track wheels
        const trackGeometry = new THREE.BoxGeometry(3.6, 0.8, 1);
        const trackMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.9
        });
        
        const leftTrack = new THREE.Mesh(trackGeometry, trackMaterial);
        leftTrack.position.set(0, 0.4, -1);
        group.add(leftTrack);
        
        const rightTrack = new THREE.Mesh(trackGeometry, trackMaterial);
        rightTrack.position.set(0, 0.4, 1.8);
        group.add(rightTrack);
        
        // Add tank-like treads details
        const treadDetailGeometry = new THREE.BoxGeometry(3.6, 0.2, 1.01);
        const treadDetailMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333, 
            roughness: 0.7
        });
        
        for (let i = 0; i < 4; i++) {
            const leftTreadDetail = new THREE.Mesh(treadDetailGeometry, treadDetailMaterial);
            leftTreadDetail.position.set(0, 0.4, -1);
            leftTreadDetail.rotation.x = (i / 4) * Math.PI;
            leftTrack.add(leftTreadDetail);
            
            const rightTreadDetail = new THREE.Mesh(treadDetailGeometry, treadDetailMaterial);
            rightTreadDetail.position.set(0, 0.4, 1.8);
            rightTreadDetail.rotation.x = (i / 4) * Math.PI;
            rightTrack.add(rightTreadDetail);
        }

        this.mesh = group;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Start drill animation
        this.updateDrillAnimation();
    }
    
    updateDrillAnimation() {
        if (!this.drill) return;
        
        // Rotate the drill
        this.drillRotation += 0.1;
        this.drill.rotation.z = this.drillRotation;
        
        // Request next frame update
        requestAnimationFrame(this.updateDrillAnimation);
    }

    update(deltaTime) {
        super.update(deltaTime);
        // Drill animation is handled in updateDrillAnimation
    }

    useSpecialWeapon() {
        // Drill Charge implementation
        console.log('Activating drill charge!');
        // TODO: Implement drill charge effect
    }
}

// Club Kid (Party Van)
export class ClubKid extends Vehicle {
    constructor() {
        super({
            speed: 4,      // High
            acceleration: 4, // High
            handling: 3,    // Medium
            armor: 2,      // Low
            weight: 3      // Medium
        });
        this.standardWeapon = 'lightMachineGun';
        this.specialWeapon = 'discoInferno';
        
        // For disco ball animation
        this.discoBallRotation = 0;
        this.discoLightHue = 0;
        this.updateDiscoEffects = this.updateDiscoEffects.bind(this);
    }

    createPlaceholderMesh() {
        // Create a detailed party van based on Twisted Metal 3's Club Kid
        const group = new THREE.Group();

        // Van body - boxy minivan/panel van shape
        const bodyGeometry = new THREE.BoxGeometry(2.8, 2.4, 5.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x9932CC, // Purple
            metalness: 0.7,
            roughness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        group.add(body);

        // Front cab distinct from body
        const cabGeometry = new THREE.BoxGeometry(2.8, 1.4, 1.8);
        const cabMaterial = new THREE.MeshStandardMaterial({
            color: 0x9932CC, // Purple
            metalness: 0.7,
            roughness: 0.3
        });
        const cab = new THREE.Mesh(cabGeometry, cabMaterial);
        cab.position.set(0, 1.2, -1.85);
        group.add(cab);

        // Front windshield
        const windshieldGeometry = new THREE.PlaneGeometry(2.5, 1.2);
        const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0x88CCFF,
            transparent: true,
            opacity: 0.7,
            metalness: 0.9,
            roughness: 0.1
        });
        const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
        windshield.position.set(0, 1.5, -2.7);
        windshield.rotation.x = Math.PI * 0.05;
        group.add(windshield);
        
        // Side windows
        const sideWindowGeometry = new THREE.PlaneGeometry(1.5, 1);
        
        const frontLeftWindow = new THREE.Mesh(sideWindowGeometry, glassMaterial);
        frontLeftWindow.position.set(-1.41, 1.5, -1.5);
        frontLeftWindow.rotation.y = Math.PI / 2;
        group.add(frontLeftWindow);
        
        const frontRightWindow = new THREE.Mesh(sideWindowGeometry, glassMaterial);
        frontRightWindow.position.set(1.41, 1.5, -1.5);
        frontRightWindow.rotation.y = -Math.PI / 2;
        group.add(frontRightWindow);
        
        // Rear side windows
        const rearWindowGeometry = new THREE.PlaneGeometry(2, 1);
        
        const rearLeftWindow = new THREE.Mesh(rearWindowGeometry, glassMaterial);
        rearLeftWindow.position.set(-1.41, 1.5, 0.5);
        rearLeftWindow.rotation.y = Math.PI / 2;
        group.add(rearLeftWindow);
        
        const rearRightWindow = new THREE.Mesh(rearWindowGeometry, glassMaterial);
        rearRightWindow.position.set(1.41, 1.5, 0.5);
        rearRightWindow.rotation.y = -Math.PI / 2;
        group.add(rearRightWindow);

        // Rear doors
        const doorGeometry = new THREE.PlaneGeometry(2.5, 2);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x9932CC, // Purple
            metalness: 0.7,
            roughness: 0.3
        });
        const rearDoor = new THREE.Mesh(doorGeometry, doorMaterial);
        rearDoor.position.set(0, 1.5, 2.76);
        group.add(rearDoor);
        
        // Door handles
        const handleGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.05);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.position.set(-0.5, 1.5, 2.79);
        group.add(leftHandle);
        
        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.position.set(0.5, 1.5, 2.79);
        group.add(rightHandle);

        // Bumpers
        const bumperGeometry = new THREE.BoxGeometry(2.8, 0.3, 0.5);
        const bumperMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const frontBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        frontBumper.position.set(0, 0.5, -2.7);
        group.add(frontBumper);
        
        const rearBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        rearBumper.position.set(0, 0.5, 2.7);
        group.add(rearBumper);

        // Headlights
        const headlightGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        const headlightMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFCC,
            emissive: 0xFFFFCC,
            emissiveIntensity: 0.5
        });
        
        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(-1, 0.8, -2.75);
        leftHeadlight.rotation.x = Math.PI / 2;
        group.add(leftHeadlight);
        
        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(1, 0.8, -2.75);
        rightHeadlight.rotation.x = Math.PI / 2;
        group.add(rightHeadlight);

        // Disco ball on top
        const discoBallGeometory = new THREE.SphereGeometry(0.6, 16, 16);
        this.discoBallMaterial = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            metalness: 1,
            roughness: 0.1
        });
        this.discoBall = new THREE.Mesh(discoBallGeometory, this.discoBallMaterial);
        this.discoBall.position.set(0, 3.3, 0);
        
        // Add mirrored facets to the disco ball
        const facetCount = 20;
        const facetGeometry = new THREE.PlaneGeometry(0.2, 0.2);
        const facetMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            metalness: 1,
            roughness: 0,
            emissive: 0xFFFFFF,
            emissiveIntensity: 0.2
        });
        
        for (let i = 0; i < facetCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / facetCount);
            
            for (let j = 0; j < facetCount; j++) {
                const theta = Math.sqrt(facetCount * Math.PI) * phi;
                
                const facet = new THREE.Mesh(facetGeometry, facetMaterial);
                
                facet.position.setFromSphericalCoords(
                    0.61,
                    phi,
                    theta
                );
                
                facet.lookAt(0, 0, 0);
                this.discoBall.add(facet);
            }
        }
        
        group.add(this.discoBall);
        
        // Disco light mount
        const mountGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
        const mountMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.7,
            roughness: 0.3
        });
        const discoBallMount = new THREE.Mesh(mountGeometry, mountMaterial);
        discoBallMount.position.set(0, 2.95, 0);
        group.add(discoBallMount);

        // Add DJ equipment - speakers on the roof
        const speakerGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const speakerMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.9
        });
        
        const leftSpeaker = new THREE.Mesh(speakerGeometry, speakerMaterial);
        leftSpeaker.position.set(-1, 2.9, 0);
        group.add(leftSpeaker);
        
        const rightSpeaker = new THREE.Mesh(speakerGeometry, speakerMaterial);
        rightSpeaker.position.set(1, 2.9, 0);
        group.add(rightSpeaker);
        
        // Speaker cones
        const coneGeometry = new THREE.CircleGeometry(0.3, 32);
        const coneMaterial = new THREE.MeshStandardMaterial({
            color: 0xCCCCCC,
            roughness: 0.7
        });
        
        const leftCone = new THREE.Mesh(coneGeometry, coneMaterial);
        leftCone.position.set(-1, 2.9, 0.41);
        group.add(leftCone);
        
        const rightCone = new THREE.Mesh(coneGeometry, coneMaterial);
        rightCone.position.set(1, 2.9, 0.41);
        group.add(rightCone);

        // Create colorful neon trim around the van
        const neonMaterial = new THREE.MeshStandardMaterial({
            color: 0x00FFFF, // Cyan
            emissive: 0x00FFFF,
            emissiveIntensity: 0.8
        });
        
        // Top trim
        const topTrimGeometry = new THREE.BoxGeometry(2.9, 0.1, 5.6);
        const topTrim = new THREE.Mesh(topTrimGeometry, neonMaterial);
        topTrim.position.set(0, 2.75, 0);
        group.add(topTrim);
        
        // Bottom trim
        const bottomTrimGeometry = new THREE.BoxGeometry(2.9, 0.1, 5.6);
        const bottomTrim = new THREE.Mesh(bottomTrimGeometry, neonMaterial);
        bottomTrim.position.set(0, 0.31, 0);
        group.add(bottomTrim);

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.9
        });
        
        const wheelPositions = [
            [-1.2, 0.4, -1.8],  // front left
            [1.2, 0.4, -1.8],   // front right
            [-1.2, 0.4, 1.8],   // rear left
            [1.2, 0.4, 1.8]     // rear right
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(...pos);
            wheel.rotation.z = Math.PI / 2;
            group.add(wheel);
        });

        // Create disco lights that will color-shift
        this.discoLights = [];
        const discoLightGeometry = new THREE.SpotLight(0xFF0000, 2, 10, Math.PI / 4, 0.5, 1);
        
        const discoLightPositions = [
            [0, 3.3, 0, 1, 0, 0],  // right
            [0, 3.3, 0, -1, 0, 0], // left
            [0, 3.3, 0, 0, -1, 0], // down
            [0, 3.3, 0, 0, 0, 1],  // front
            [0, 3.3, 0, 0, 0, -1]  // back
        ];
        
        discoLightPositions.forEach(([x, y, z, tx, ty, tz]) => {
            const light = new THREE.SpotLight(0xFF0000, 0.8);
            light.position.set(x, y, z);
            light.target.position.set(tx, ty, tz);
            this.discoLights.push(light);
            group.add(light);
            group.add(light.target);
        });

        this.mesh = group;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Start disco effects
        this.updateDiscoEffects();
    }
    
    updateDiscoEffects() {
        if (!this.discoBall || !this.discoLights) return;
        
        // Rotate disco ball
        this.discoBallRotation += 0.02;
        this.discoBall.rotation.y = this.discoBallRotation;
        
        // Shift color of disco lights
        this.discoLightHue = (this.discoLightHue + 1) % 360;
        
        // Convert hue to RGB for the lights
        const color = this.hslToHex(this.discoLightHue, 100, 50);
        
        // Update lights with new colors
        this.discoLights.forEach((light, i) => {
            light.color.setHex(color);
        });
        
        // Request next frame update
        requestAnimationFrame(this.updateDiscoEffects);
    }
    
    // Helper to convert HSL to hex color
    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return parseInt(`0x${toHex(r)}${toHex(g)}${toHex(b)}`);
    }

    update(deltaTime) {
        super.update(deltaTime);
        // Disco animations are handled in updateDiscoEffects
    }

    useSpecialWeapon() {
        // Disco Inferno implementation
        console.log('Unleashing disco inferno!');
        // TODO: Implement disco inferno effect
    }
} 