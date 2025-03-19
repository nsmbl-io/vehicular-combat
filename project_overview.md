Twisted Metal-Inspired Multiplayer Game – Development Overview

Overview

This is a real-time vehicular combat game inspired by Twisted Metal, built using Three.js for rendering, WebSockets for multiplayer, and hosted on Render. Players select one of six unique vehicles, collect weapons and power-ups, and battle AI-controlled bosses in a destructible Washington, D.C. arena.

⸻

1. Game Map: Washington, D.C. (Twisted Metal III-Inspired)

🔗 Washington D.C. (Twisted Metal III) Map

The arena features:
	•	The White House – A central structure that can be damaged and partially destroyed.
	•	The Washington Monument – Adds verticality and serves as a cover point or destructible object.
	•	The Capitol Building – Features explosive damage zones that create debris-based obstacles.
	•	General Map Features:
	•	A balance of open areas for high-speed combat and tight corridors for close-quarters fights.
	•	Destructible objects that drop power-ups (full health, special attacks, etc.).
	•	Ramps with item spawns rewarding skillful driving.

⸻

2. Gameplay Flow & UI

Vehicle Selection Screen
	•	Players land on a vehicle selection menu, with live gameplay from the current battle in the background.
	•	Once a player selects a vehicle, they spawn immediately into the ongoing match.

Boss System & Global Health Bar
	•	AI bosses spawn periodically, scaling in difficulty based on player count:
	•	Easy: 1-5 players
	•	Medium: 6-10 players
	•	Hard: 11-15 players
	•	Insane: 16-20 players
	•	Twisted: 21+ players
	•	A global boss health bar appears at the top of all screens.
	•	After a boss is defeated, it explodes, dropping weapon pickups before the next one spawns.

Multiplayer & Respawning
	•	All players share a single session (no separate lobbies).
	•	Respawn System:
	•	Players do not respawn instantly after dying.
	•	A respawn timer starts, increasing in length with repeated deaths.
	•	While waiting, players spectate the match from a top-down map view.

Combat Design
	•	Fast-paced battles emphasizing movement, dodging, and strategic weapon use.
	•	Limited but impactful weapons for balanced, engaging fights.
	•	Dynamic destruction and item spawns promote aggressive play and smart positioning.

⸻

3. Playable Vehicles (6 Total)

🔗 Axel (Big Segway)
	•	Speed: Medium (3/5)
	•	Acceleration: Slow (2/5)
	•	Handling: Low (2/5)
	•	Armor: High (4/5)
	•	Weight: Heavy (4/5)
	•	Standard Weapon: Machine Gun
	•	Special Weapon: Shockwave – Releases a 360-degree energy pulse, knocking back and damaging nearby enemies. Slight delay but large area effect.

🔗 Hammerhead (Monster Truck)
	•	Speed: Low (2/5)
	•	Acceleration: Medium (3/5)
	•	Handling: Low (2/5)
	•	Armor: High (4/5)
	•	Weight: Very Heavy (5/5)
	•	Standard Weapon: Heavy Machine Gun
	•	Special Weapon: Crushing Stomp – Jumps and slams down, creating a shockwave that flips nearby vehicles. Direct hits deal double damage.

🔗 Outlaw (Police Car)
	•	Speed: Medium (3/5)
	•	Acceleration: Medium (3/5)
	•	Handling: Medium (3/5)
	•	Armor: Medium (3/5)
	•	Weight: Medium (3/5)
	•	Standard Weapon: Rapid-Fire Machine Gun
	•	Special Weapon: Taser Shock – Fires an electric charge, dealing damage and stunning enemies for a short time.

🔗 Spectre (Sports Car)
	•	Speed: High (5/5)
	•	Acceleration: High (5/5)
	•	Handling: High (5/5)
	•	Armor: Low (2/5)
	•	Weight: Light (1/5)
	•	Standard Weapon: Lightweight Machine Gun
	•	Special Weapon: Ghost Missile – Fires a spectral missile that phases through obstacles and homes in on targets. Moderate damage, hard to avoid.

🔗 Auger (Rock Driller)
	•	Speed: Low (2/5)
	•	Acceleration: Low (2/5)
	•	Handling: Low (2/5)
	•	Armor: High (4/5)
	•	Weight: Very Heavy (5/5)
	•	Standard Weapon: Heavy Cannon
	•	Special Weapon: Drill Charge – Surges forward with a massive drill, dealing continuous damage while ramming enemies.

🔗 Club Kid (Party Van)
	•	Speed: High (4/5)
	•	Acceleration: High (4/5)
	•	Handling: Medium (3/5)
	•	Armor: Low (2/5)
	•	Weight: Medium (3/5)
	•	Standard Weapon: Light Machine Gun
	•	Special Weapon: Disco Inferno – Fires an energy pulse in all directions, dealing light damage and applying a slow effect to hit enemies.

⸻

4. AI Boss Vehicles

🔗 Sweet Tooth (Ice Cream Truck)
	•	Speed: Medium (3/5)
	•	Armor: High (4/5)
	•	Special Weapon: Flaming Clown Head – Fires a homing fireball that explodes on impact, dealing significant area damage.

🔗 Darkside (Armored Semi Truck)
	•	Speed: Slow (2/5)
	•	Armor: Very High (5/5)
	•	Special Weapon: Shadow Slam – Charges forward at high speed, slamming into enemies and knocking them back with massive force.

🔗 Minion (Demon Tank)
	•	Speed: Very Slow (1/5)
	•	Armor: Extremely High (5/5)
	•	Special Weapon: Missile Storm – Fires a barrage of homing missiles, covering a massive area and dealing devastating damage.

⸻

5. Weapons & Pickups
	•	🔗 Freeze Missile – Temporarily freezes enemies, making them vulnerable.
	•	🔗 Fire Missile – Fast, moderate damage, slight homing.
	•	🔗 Homing Missile – Weak damage, strong homing ability.
	•	🔗 Power Missile – Slow-moving, very high damage.
	•	🔗 Turbo Recharge – Restores turbo boost energy.
	•	Partial Health – Restores some health.
	•	Full Health – Fully restores health.