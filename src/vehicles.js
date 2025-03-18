export const vehicles = [
    {
        id: 'axel',
        name: 'Axel',
        description: 'Giant Two-Wheeled Machine',
        speed: 7,
        armor: 9,
        handling: 6,
        specialAttack: 'Shockwave',
        specialAttackDescription: 'Emits a 360-degree pulse that damages and knocks back nearby enemies',
        model: 'axel.glb',
        stats: {
            speed: 70,
            armor: 90,
            handling: 60
        }
    },
    {
        id: 'outlaw',
        name: 'Outlaw',
        description: 'Police Cruiser',
        speed: 8,
        armor: 7,
        handling: 8,
        specialAttack: 'Taser Blast',
        specialAttackDescription: 'Stuns enemies briefly and deals damage',
        model: 'outlaw.glb',
        stats: {
            speed: 80,
            armor: 70,
            handling: 80
        }
    },
    {
        id: 'hammerhead',
        name: 'Hammerhead',
        description: 'Monster Truck',
        speed: 5,
        armor: 9,
        handling: 5,
        specialAttack: 'Crush Stomp',
        specialAttackDescription: 'Jumps and slams down, crushing nearby cars',
        model: 'hammerhead.glb',
        stats: {
            speed: 50,
            armor: 90,
            handling: 50
        }
    },
    {
        id: 'mr-grimm',
        name: 'Mr. Grimm',
        description: 'Motorcycle',
        speed: 9,
        armor: 4,
        handling: 9,
        specialAttack: 'Death Scythe',
        specialAttackDescription: 'Throws a deadly scythe that deals high damage',
        model: 'mr-grimm.glb',
        stats: {
            speed: 90,
            armor: 40,
            handling: 90
        }
    },
    {
        id: 'auger',
        name: 'Auger',
        description: 'Drill Truck',
        speed: 4,
        armor: 9,
        handling: 4,
        specialAttack: 'Drill Charge',
        specialAttackDescription: 'Dashes forward with a drill attack',
        model: 'auger.glb',
        stats: {
            speed: 40,
            armor: 90,
            handling: 40
        }
    },
    {
        id: 'club-kid',
        name: 'Club Kid',
        description: 'Neon Car',
        speed: 8,
        armor: 5,
        handling: 8,
        specialAttack: 'Disco Inferno',
        specialAttackDescription: 'Shoots out colorful energy waves in all directions',
        model: 'club-kid.glb',
        stats: {
            speed: 80,
            armor: 50,
            handling: 80
        }
    },
    {
        id: 'spectre',
        name: 'Spectre',
        description: 'Sports Car',
        speed: 9,
        armor: 4,
        handling: 9,
        specialAttack: 'Ghost Missile',
        specialAttackDescription: 'Fires a missile that phases through walls',
        model: 'spectre.glb',
        stats: {
            speed: 90,
            armor: 40,
            handling: 90
        }
    },
    {
        id: 'firestarter',
        name: 'Firestarter',
        description: 'Fire Truck',
        speed: 6,
        armor: 8,
        handling: 6,
        specialAttack: 'Flamethrower',
        specialAttackDescription: 'Burns enemies in a cone in front of the truck',
        model: 'firestarter.glb',
        stats: {
            speed: 60,
            armor: 80,
            handling: 60
        }
    },
    {
        id: 'flower-power',
        name: 'Flower Power',
        description: 'VW Van',
        speed: 7,
        armor: 5,
        handling: 7,
        specialAttack: 'Pollen Burst',
        specialAttackDescription: 'Launches a cloud that slows and damages enemies',
        model: 'flower-power.glb',
        stats: {
            speed: 70,
            armor: 50,
            handling: 70
        }
    },
    {
        id: 'thumper',
        name: 'Thumper',
        description: 'Lowrider',
        speed: 7,
        armor: 6,
        handling: 8,
        specialAttack: 'Heatwave',
        specialAttackDescription: 'Shoots a powerful fire blast forward',
        model: 'thumper.glb',
        stats: {
            speed: 70,
            armor: 60,
            handling: 80
        }
    },
    {
        id: 'warthog',
        name: 'Warthog',
        description: 'Military Jeep',
        speed: 5,
        armor: 8,
        handling: 6,
        specialAttack: 'Rocket Barrage',
        specialAttackDescription: 'Launches multiple homing rockets',
        model: 'warthog.glb',
        stats: {
            speed: 50,
            armor: 80,
            handling: 60
        }
    }
];

export const bossVehicles = [
    {
        id: 'sweet-tooth',
        name: 'Sweet Tooth',
        description: 'The infamous clown-faced ice cream truck of chaos',
        model: 'sweet-tooth.glb',
        difficulty: 'easy',
        stats: {
            speed: 80,
            armor: 120,
            handling: 70
        },
        specialAttacks: ['fireMissile', 'powerMissile'],
        specialAttack: 'Flaming Clown Head',
        specialAttackDescription: 'Launches a massive flaming clown head that chases players'
    },
    {
        id: 'darkside',
        name: 'Dark Side',
        description: 'A mysterious black vehicle with shadow powers',
        model: 'darkside.glb',
        difficulty: 'medium',
        stats: {
            speed: 90,
            armor: 150,
            handling: 80
        },
        specialAttacks: ['homingMissile', 'powerMissile'],
        specialAttack: 'Shadow Slam',
        specialAttackDescription: 'Charges forward and slams into the ground, creating a shockwave'
    },
    {
        id: 'minion',
        name: 'Minion',
        description: 'A massive military vehicle with overwhelming firepower',
        model: 'minion.glb',
        difficulty: 'hard',
        stats: {
            speed: 70,
            armor: 200,
            handling: 60
        },
        specialAttacks: ['fireMissile', 'homingMissile', 'powerMissile'],
        specialAttack: 'Missile Storm',
        specialAttackDescription: 'Fires a barrage of homing missiles in all directions'
    },
    {
        id: 'calypso',
        name: 'Calypso',
        description: 'The enigmatic tournament host with reality-bending powers',
        model: 'calypso.glb',
        difficulty: 'insane',
        stats: {
            speed: 100,
            armor: 250,
            handling: 90
        },
        specialAttacks: ['fireMissile', 'homingMissile', 'powerMissile'],
        specialAttack: 'Reality Warp',
        specialAttackDescription: 'Creates a distortion field that affects player controls and weapon trajectories'
    },
    {
        id: 'twisted-metal',
        name: 'Twisted Metal',
        description: 'The ultimate boss vehicle with all powers combined',
        model: 'twisted-metal.glb',
        difficulty: 'twisted',
        stats: {
            speed: 120,
            armor: 300,
            handling: 100
        },
        specialAttacks: ['fireMissile', 'homingMissile', 'powerMissile'],
        specialAttack: 'Apocalypse',
        specialAttackDescription: 'Unleashes all special attacks simultaneously while creating environmental hazards'
    }
];