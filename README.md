# Vehicular Combat

A Twisted Metal-inspired multiplayer vehicular combat game built with Three.js and WebSockets.

## Features

- Real-time multiplayer vehicular combat
- 11 unique playable vehicles with special attacks
- 3 AI-controlled boss vehicles with scalable difficulty
- Washington, D.C. battle arena with destructible elements
- Weapon pickups and power-ups
- Dynamic boss spawning system
- Spectator view in vehicle selection screen

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vehicular-combat.git
cd vehicular-combat
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:5173`

## Controls

- WASD: Vehicle movement
- Space: Brake
- Left Shift: Turbo boost
- Left Mouse Button: Fire weapon
- Right Mouse Button: Special attack
- E: Pick up weapons/items

## Vehicle Selection

Choose from 11 unique vehicles, each with different stats and special attacks:

- Axel: Giant Two-Wheeled Machine
- Outlaw: Police Cruiser
- Hammerhead: Monster Truck
- Mr. Grimm: Motorcycle
- Auger: Drill Truck
- Club Kid: Neon Car
- Spectre: Sports Car
- Firestarter: Fire Truck
- Flower Power: VW Van
- Thumper: Lowrider
- Warthog: Military Jeep

## Boss System

The game features three AI-controlled boss vehicles that spawn periodically:

- Sweet Tooth (Ice Cream Truck)
- Darkside (Armored Semi Truck)
- Minion (Demon Tank)

Boss difficulty scales based on the number of players:
- Easy: 1-5 players
- Medium: 6-10 players
- Hard: 11-15 players
- Insane: 16-20 players
- Twisted: 21+ players

## Weapons & Pickups

Available weapons:
- Fire Missile: Standard missile with moderate damage
- Homing Missile: Tracking missile with weak damage
- Power Missile: Heavy missile with high damage

Pickups:
- Special Attack: Recharges vehicle's special attack
- Turbo Boost: Recharges turbo boost
- Partial Health: Restores some vehicle HP
- Full Health: Restores all vehicle HP

## Development

The project uses:
- Three.js for 3D rendering
- Socket.IO for real-time multiplayer
- Vite for development and building
- GSAP for animations

## License

This project is licensed under the MIT License - see the LICENSE file for details. 