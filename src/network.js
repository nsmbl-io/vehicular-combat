import { io } from 'socket.io-client';

// Connect to the WebSocket server
export const socket = io('http://localhost:3000', {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

// Socket event handlers
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('error', (error) => {
    console.error('Socket error:', error);
});

// Game-specific events
socket.on('playerJoined', (playerData) => {
    console.log('Player joined:', playerData);
});

socket.on('playerLeft', (playerId) => {
    console.log('Player left:', playerId);
});

socket.on('gameState', (state) => {
    console.log('Game state update:', state);
});

socket.on('bossSpawn', (bossData) => {
    console.log('Boss spawned:', bossData);
});

socket.on('weaponPickup', (pickupData) => {
    console.log('Weapon pickup:', pickupData);
});

// Export functions for game events
export const gameEvents = {
    selectVehicle: (vehicle) => {
        socket.emit('selectVehicle', vehicle);
    },
    playerMove: (position, rotation) => {
        socket.emit('playerMove', { position, rotation });
    },
    fireWeapon: (weaponType, target) => {
        socket.emit('fireWeapon', { weaponType, target });
    },
    useSpecialAttack: () => {
        socket.emit('useSpecialAttack');
    },
    pickupWeapon: (pickupId) => {
        socket.emit('pickupWeapon', pickupId);
    }
}; 