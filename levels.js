// ===== Ninja Dash - Level data =====
// All 10 levels are described here as plain data: where the platforms,
// coins, enemies, hazards, checkpoints and finish are.
// There is no game logic in this file - game.js reads this data and
// builds the level from it. To change a level, just edit the numbers.
//
// Coordinates are in game pixels. The screen is 800 x 450 and scrolls
// sideways, so a level can be much wider than 800. y grows downward;
// the top of the ground is y = 390.
//
// The ninja can jump about 134 px high and about 200 px across,
// so every gap and step below was designed to fit that.
// (tools/check-levels.js tests that every level can really be finished.)

const GROUND_TOP = 390;

// ----- Small helpers so the level lists stay short and readable -----

// A section of ground from x, w wide (reaches the bottom of the screen)
function ground(x, w) {
  return { x: x, y: GROUND_TOP, w: w, h: 60 };
}

// A floating platform (ledge) whose top is at y
function ledge(x, y, w) {
  return { x: x, y: y, w: w, h: 20 };
}

// A platform that slides back and forth.
// axis "x" = left/right, "y" = up/down. range = how far it travels (px).
// speed = how fast (bigger = faster). It starts at (x, y).
function mover(x, y, w, axis, range, speed) {
  return { x: x, y: y, w: w, h: 20, move: { axis: axis, range: range, speed: speed } };
}

// A platform that shakes and falls a moment after you step on it
function faller(x, y, w) {
  return { x: x, y: y, w: w, h: 20, falling: true };
}

// A hidden platform: almost invisible until you get close
function secret(x, y, w) {
  return { x: x, y: y, w: w, h: 20, hidden: true };
}

// An enemy walking between left and right on a surface at y
function patrol(left, right, y, speed) {
  return { left: left, right: right, y: y, speed: speed };
}

// Spikes on a surface at y, from x, w wide
function spikes(x, y, w) {
  return { x: x, y: y, w: w };
}

// A lava pool filling a pit from x, w wide
function lava(x, w) {
  return { x: x, w: w };
}

// ----- Coins (x, y are the CENTER of each coin) -----

// A straight row of coins
function coinRow(x, y, count, gap) {
  const coins = [];
  for (let i = 0; i < count; i++) {
    coins.push({ x: x + i * (gap || 40), y: y });
  }
  return coins;
}

// Coins in an arch - good for showing the path of a jump over a gap
function coinArc(x, y, count, width, height) {
  const coins = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1); // 0 → 1
    coins.push({ x: x + t * width, y: y - Math.sin(t * Math.PI) * height });
  }
  return coins;
}

// Coins floating at chest height above a surface at surfaceY
function coinsOn(x, surfaceY, count, gap) {
  return coinRow(x, surfaceY - 40, count, gap);
}

// ===================================================================
// ===== THE 10 LEVELS ===============================================
// ===================================================================
// Every level has:
//   name, theme        - title and look (themes are in background.js)
//   width              - how long the level is
//   difficulty         - starting difficulty (enemy speed, walker spawns)
//   walkers            - do extra enemies walk in along the ground?
//   start, finish      - where you begin and where the finish gate is
//   checkpoints        - lanterns that save your progress
//   platforms, enemies, coins, spikes, lava

const LEVELS = [
  // ---------------------------------------------------------------
  // LEVEL 1 - TRAINING: wide platforms, small gaps, slow enemies
  // ---------------------------------------------------------------
  {
    name: "Training",
    theme: "training",
    width: 2400,
    difficulty: 1,
    walkers: false,
    start: { x: 60, y: GROUND_TOP },
    finish: { x: 2280, y: GROUND_TOP },
    checkpoints: [],
    platforms: [
      ground(0, 720), ground(840, 620), ground(1580, 820),
      ledge(260, 320, 140), ledge(470, 250, 120),
      ledge(960, 320, 120), ledge(1150, 250, 120), ledge(1320, 320, 100),
      ledge(1700, 320, 140), ledge(1900, 250, 120), ledge(2100, 320, 100),
    ],
    enemies: [
      patrol(420, 700, GROUND_TOP, 0.9),
      patrol(1150, 1270, 250, 0.7),
      patrol(1760, 2060, GROUND_TOP, 1.0),
    ],
    coins: [
      ...coinsOn(140, GROUND_TOP, 3),
      ...coinsOn(290, 320, 3),
      ...coinsOn(495, 250, 3),
      ...coinArc(730, 330, 3, 100, 50),
      ...coinsOn(990, 320, 3),
      ...coinsOn(1180, 250, 3),
      ...coinsOn(1340, 320, 2),
      ...coinArc(1470, 330, 3, 100, 50),
      ...coinsOn(1730, 320, 3),
      ...coinsOn(1930, 250, 3),
      ...coinsOn(2120, 320, 2),
    ],
    spikes: [],
    lava: [],
  },

  // ---------------------------------------------------------------
  // LEVEL 2 - FOREST: more platforms, more enemies, longer gaps
  // ---------------------------------------------------------------
  {
    name: "Forest",
    theme: "forest",
    width: 2800,
    difficulty: 1,
    walkers: false,
    start: { x: 60, y: GROUND_TOP },
    finish: { x: 2700, y: GROUND_TOP },
    checkpoints: [{ x: 1450, y: GROUND_TOP }],
    platforms: [
      ground(0, 620), ground(760, 520), ground(1420, 520), ground(2080, 720),
      ledge(200, 320, 110), ledge(380, 250, 100), ledge(560, 180, 100),
      ledge(820, 320, 100), ledge(990, 250, 100), ledge(1150, 320, 100), ledge(1300, 260, 80),
      ledge(1560, 320, 100), ledge(1720, 250, 90), ledge(1860, 320, 80),
      ledge(2150, 320, 100), ledge(2330, 250, 100), ledge(2510, 180, 100),
    ],
    enemies: [
      patrol(260, 600, GROUND_TOP, 1.0),
      patrol(800, 1260, GROUND_TOP, 1.1),
      patrol(990, 1090, 250, 0.8),
      patrol(1580, 1920, GROUND_TOP, 1.2),
      patrol(2130, 2600, GROUND_TOP, 1.2),
      patrol(2330, 2430, 250, 0.9),
    ],
    coins: [
      ...coinsOn(120, GROUND_TOP, 2),
      ...coinsOn(225, 320, 2),
      ...coinsOn(400, 250, 2),
      ...coinsOn(585, 180, 2),
      ...coinArc(640, 330, 3, 100, 50),
      ...coinsOn(845, 320, 2),
      ...coinsOn(1015, 250, 2),
      ...coinsOn(1175, 320, 2),
      ...coinsOn(1320, 260, 2),
      ...coinsOn(1585, 320, 2),
      ...coinsOn(1740, 250, 2),
      ...coinArc(1960, 330, 3, 100, 50),
      ...coinsOn(2175, 320, 2),
      ...coinsOn(2355, 250, 2),
      ...coinsOn(2535, 180, 2),
    ],
    spikes: [],
    lava: [],
  },

  // ---------------------------------------------------------------
  // LEVEL 3 - NIGHT: dark, stepping stones over pits, faster enemies
  // ---------------------------------------------------------------
  {
    name: "Night",
    theme: "night",
    width: 3000,
    difficulty: 2,
    walkers: true,
    start: { x: 60, y: GROUND_TOP },
    finish: { x: 2900, y: GROUND_TOP },
    checkpoints: [{ x: 1760, y: GROUND_TOP }],
    platforms: [
      ground(0, 520), ground(900, 520), ground(1720, 500), ground(2480, 520),
      // Stepping stones over the pits
      ledge(580, 320, 80), ledge(720, 280, 80),
      ledge(1480, 310, 70), ledge(1610, 250, 70),
      ledge(2280, 320, 70), ledge(2400, 270, 60),
      // Higher routes
      ledge(300, 250, 100),
      ledge(1000, 300, 100), ledge(1180, 230, 100), ledge(1350, 160, 70),
      ledge(1900, 300, 100), ledge(2060, 230, 100),
      ledge(2600, 300, 100), ledge(2760, 230, 90),
    ],
    enemies: [
      patrol(250, 500, GROUND_TOP, 1.5),
      patrol(950, 1400, GROUND_TOP, 1.6),
      patrol(1180, 1280, 230, 1.2),
      patrol(1860, 2200, GROUND_TOP, 1.7),
      patrol(2060, 2160, 230, 1.3),
      patrol(2560, 2860, GROUND_TOP, 1.7),
    ],
    coins: [
      ...coinsOn(130, GROUND_TOP, 2),
      ...coinsOn(325, 250, 2),
      ...coinsOn(600, 320, 2),
      ...coinsOn(740, 280, 2),
      ...coinsOn(1025, 300, 2),
      ...coinsOn(1205, 230, 2),
      ...coinsOn(1370, 160, 2, 30),
      ...coinsOn(1495, 310, 2),
      ...coinsOn(1625, 250, 2),
      ...coinsOn(1925, 300, 2),
      ...coinsOn(2085, 230, 2),
      ...coinsOn(2295, 320, 2),
      ...coinsOn(2410, 270, 1),
      ...coinsOn(2625, 300, 2),
      ...coinsOn(2780, 230, 2),
    ],
    spikes: [],
    lava: [],
  },

  // ---------------------------------------------------------------
  // LEVEL 4 - RUINS: narrow platforms and moving platforms
  // ---------------------------------------------------------------
  {
    name: "Ruins",
    theme: "ruins",
    width: 3200,
    difficulty: 2,
    walkers: true,
    start: { x: 60, y: GROUND_TOP },
    finish: { x: 3100, y: GROUND_TOP },
    checkpoints: [{ x: 1680, y: GROUND_TOP }],
    platforms: [
      ground(0, 460), ground(820, 420), ground(1640, 420), ground(2440, 760),
      // Pit 1: a platform sliding left and right
      mover(520, 320, 90, "x", 140, 0.02),
      // Pit 2: narrow pillars
      ledge(1300, 320, 50), ledge(1410, 270, 50), ledge(1520, 320, 50),
      // Pit 3: a platform going up and down, then a high narrow ledge
      mover(2120, 340, 80, "y", 120, 0.025), ledge(2260, 210, 60), ledge(2360, 290, 50),
      // Broken columns to climb
      ledge(200, 290, 70), ledge(900, 290, 60), ledge(1050, 220, 60),
      ledge(1760, 300, 70), ledge(1900, 230, 60),
      ledge(2550, 300, 60), ledge(2700, 230, 60), ledge(2850, 300, 60),
    ],
    enemies: [
      patrol(250, 440, GROUND_TOP, 1.4),
      patrol(860, 1220, GROUND_TOP, 1.5),
      patrol(1800, 2040, GROUND_TOP, 1.6),
      patrol(2500, 2800, GROUND_TOP, 1.7),
      patrol(2860, 3040, GROUND_TOP, 1.7),
    ],
    coins: [
      ...coinsOn(120, GROUND_TOP, 2),
      ...coinsOn(220, 290, 2),
      ...coinRow(540, 250, 4, 45),
      ...coinsOn(915, 290, 1),
      ...coinsOn(1065, 220, 2, 30),
      ...coinsOn(1325, 320, 1),
      ...coinsOn(1435, 270, 1),
      ...coinsOn(1545, 320, 1),
      ...coinsOn(1780, 300, 2),
      ...coinsOn(1915, 230, 2, 30),
      ...coinRow(2160, 170, 2),
      ...coinsOn(2275, 210, 2, 30),
      ...coinsOn(2385, 290, 1),
      ...coinsOn(2565, 300, 2, 30),
      ...coinsOn(2715, 230, 2, 30),
      ...coinsOn(2865, 300, 2, 30),
    ],
    spikes: [],
    lava: [],
  },

  // ---------------------------------------------------------------
  // LEVEL 5 - MOUNTAIN: big gaps and tricky jumps
  // ---------------------------------------------------------------
  {
    name: "Mountain",
    theme: "mountain",
    width: 3400,
    difficulty: 3,
    walkers: true,
    start: { x: 60, y: GROUND_TOP },
    finish: { x: 3300, y: GROUND_TOP },
    checkpoints: [{ x: 1480, y: GROUND_TOP }, { x: 2680, y: GROUND_TOP }],
    platforms: [
      ground(0, 420), ground(580, 300), ground(1440, 340), ground(2640, 320), ground(3130, 270),
      ledge(960, 320, 80), ledge(1120, 250, 70), ledge(1280, 320, 70),
      ledge(1950, 330, 90), ledge(2120, 260, 80), ledge(2290, 200, 80), ledge(2470, 290, 80),
      ledge(250, 290, 80), ledge(680, 290, 80), ledge(1560, 290, 80), ledge(2760, 290, 80),
    ],
    enemies: [
      patrol(150, 400, GROUND_TOP, 1.6),
      patrol(620, 860, GROUND_TOP, 1.7),
      patrol(1600, 1760, GROUND_TOP, 1.8),
      patrol(2120, 2200, 260, 1.4),
      patrol(2790, 2940, GROUND_TOP, 1.9),
      patrol(3160, 3260, GROUND_TOP, 1.8),
    ],
    coins: [
      ...coinsOn(120, GROUND_TOP, 2),
      ...coinsOn(275, 290, 2),
      ...coinArc(440, 330, 4, 120, 80),
      ...coinsOn(705, 290, 2),
      ...coinsOn(980, 320, 2),
      ...coinsOn(1140, 250, 2, 30),
      ...coinsOn(1300, 320, 2, 30),
      ...coinsOn(1585, 290, 2),
      ...coinArc(1800, 330, 4, 130, 80),
      ...coinsOn(1975, 330, 2),
      ...coinsOn(2140, 260, 2),
      ...coinsOn(2310, 200, 2),
      ...coinsOn(2490, 290, 2),
      ...coinsOn(2785, 290, 2),
      ...coinArc(2980, 330, 4, 130, 80),
    ],
    spikes: [],
    lava: [],
  },

  // ---------------------------------------------------------------
  // LEVEL 6 - TEMPLE: spike traps, more enemies, hidden coin rooms
  // ---------------------------------------------------------------
  {
    name: "Temple",
    theme: "temple",
    width: 3600,
    difficulty: 3,
    walkers: true,
    start: { x: 60, y: GROUND_TOP },
    finish: { x: 3500, y: GROUND_TOP },
    checkpoints: [{ x: 1080, y: GROUND_TOP }, { x: 1940, y: GROUND_TOP }],
    platforms: [
      ground(0, 900), ground(1050, 700), ground(1900, 700), ground(2750, 850),
      ledge(250, 300, 100), ledge(600, 250, 100), ledge(780, 320, 80), ledge(950, 320, 60),
      ledge(1260, 300, 120), ledge(1450, 230, 100), ledge(1620, 320, 90), ledge(1800, 300, 50),
      ledge(2000, 300, 90), ledge(2230, 240, 90), ledge(2450, 300, 90), ledge(2650, 310, 60),
      ledge(2850, 300, 90), ledge(3100, 240, 100), ledge(3300, 300, 90),
      // Hidden rooms full of coins - look for them high above
      secret(640, 130, 90), secret(2280, 120, 80), secret(3150, 120, 90),
    ],
    enemies: [
      patrol(180, 400, GROUND_TOP, 1.6),
      patrol(560, 880, GROUND_TOP, 1.7),
      patrol(1420, 1740, GROUND_TOP, 1.8),
      patrol(1450, 1550, 230, 1.3),
      patrol(2210, 2340, GROUND_TOP, 1.8),
      patrol(2460, 2590, GROUND_TOP, 1.8),
      patrol(2780, 2940, GROUND_TOP, 1.9),
      patrol(3080, 3420, GROUND_TOP, 2.0),
      patrol(3100, 3200, 240, 1.4),
    ],
    coins: [
      ...coinsOn(120, GROUND_TOP, 2),
      ...coinsOn(275, 300, 2),
      ...coinsOn(625, 250, 2),
      ...coinRow(655, 90, 3, 30),     // Hidden room
      ...coinsOn(800, 320, 1),
      ...coinsOn(1290, 300, 3),
      ...coinsOn(1475, 230, 2),
      ...coinsOn(1645, 320, 2),
      ...coinsOn(2025, 300, 2),
      ...coinsOn(2255, 240, 2),
      ...coinRow(2290, 80, 3, 30),    // Hidden room
      ...coinsOn(2475, 300, 2),
      ...coinsOn(2875, 300, 2),
      ...coinsOn(3125, 240, 2),
      ...coinRow(3165, 80, 3, 30),    // Hidden room
      ...coinsOn(3320, 300, 2),
    ],
    spikes: [
      spikes(420, GROUND_TOP, 110),
      spikes(1250, GROUND_TOP, 140),
      spikes(2100, GROUND_TOP, 100),
      spikes(2350, GROUND_TOP, 100),
      spikes(2950, GROUND_TOP, 120),
    ],
    lava: [],
  },

  // ---------------------------------------------------------------
  // LEVEL 7 - LAVA ZONE: lava pits and platforms that fall
  // ---------------------------------------------------------------
  {
    name: "Lava Zone",
    theme: "lava",
    width: 3800,
    difficulty: 4,
    walkers: true,
    start: { x: 60, y: GROUND_TOP },
    finish: { x: 3700, y: GROUND_TOP },
    checkpoints: [{ x: 1740, y: GROUND_TOP }, { x: 2640, y: GROUND_TOP }],
    platforms: [
      ground(0, 500), ground(850, 450), ground(1700, 500), ground(2600, 450), ground(3350, 450),
      faller(560, 320, 80), faller(700, 300, 80),
      faller(1360, 310, 70), ledge(1480, 250, 70), faller(1600, 310, 70),
      mover(2260, 320, 90, "x", 150, 0.022),
      faller(3110, 300, 70), faller(3240, 280, 60),
      ledge(200, 300, 100), ledge(1000, 300, 100), ledge(1150, 230, 90),
      ledge(1850, 300, 100), ledge(2020, 230, 90),
      ledge(2750, 300, 100), ledge(2900, 230, 90), ledge(3450, 300, 100),
    ],
    enemies: [
      patrol(150, 480, GROUND_TOP, 1.8),
      patrol(900, 1280, GROUND_TOP, 2.0),
      patrol(1840, 2180, GROUND_TOP, 2.0),
      patrol(2020, 2110, 230, 1.5),
      patrol(2760, 3030, GROUND_TOP, 2.1),
      patrol(3420, 3660, GROUND_TOP, 2.2),
    ],
    coins: [
      ...coinsOn(120, GROUND_TOP, 1),
      ...coinsOn(225, 300, 2),
      ...coinsOn(585, 320, 2),
      ...coinsOn(725, 300, 2),
      ...coinsOn(1025, 300, 2),
      ...coinsOn(1175, 230, 2),
      ...coinsOn(1380, 310, 1),
      ...coinsOn(1500, 250, 2, 30),
      ...coinsOn(1620, 310, 1),
      ...coinsOn(1875, 300, 2),
      ...coinsOn(2045, 230, 2),
      ...coinRow(2280, 260, 4, 45),
      ...coinsOn(2775, 300, 2),
      ...coinsOn(2925, 230, 2),
      ...coinsOn(3130, 300, 1),
      ...coinsOn(3255, 280, 1),
      ...coinsOn(3475, 300, 2),
    ],
    spikes: [],
    lava: [lava(500, 350), lava(1300, 400), lava(2200, 400), lava(3050, 300)],
  },

  // ---------------------------------------------------------------
  // LEVEL 8 - SHADOW REALM: very dark, mostly small floating platforms
  // ---------------------------------------------------------------
  {
    name: "Shadow Realm",
    theme: "shadow",
    width: 4000,
    difficulty: 4,
    walkers: true,
    start: { x: 60, y: GROUND_TOP },
    finish: { x: 3900, y: GROUND_TOP },
    checkpoints: [{ x: 1240, y: GROUND_TOP }, { x: 3160, y: GROUND_TOP }],
    platforms: [
      ground(0, 380), ground(1200, 320), ground(2230, 300), ground(3120, 300), ground(3740, 260),
      ledge(440, 320, 70), ledge(580, 260, 60), ledge(710, 320, 60),
      mover(830, 300, 80, "x", 120, 0.025), ledge(1080, 280, 60),
      ledge(1580, 320, 60), ledge(1710, 250, 60), faller(1840, 300, 70), ledge(1980, 240, 60), ledge(2110, 300, 60),
      ledge(2590, 300, 60), mover(2710, 330, 80, "y", 130, 0.025), ledge(2860, 210, 60), ledge(3000, 290, 60),
      ledge(3480, 310, 60), ledge(3610, 250, 60),
      ledge(2300, 260, 70), secret(2360, 135, 80),
    ],
    enemies: [
      patrol(150, 360, GROUND_TOP, 1.8),
      patrol(1330, 1500, GROUND_TOP, 2.0),
      patrol(2280, 2510, GROUND_TOP, 2.0),
      patrol(3260, 3400, GROUND_TOP, 2.1),
      patrol(3760, 3880, GROUND_TOP, 2.1),
    ],
    coins: [
      ...coinsOn(120, GROUND_TOP, 1),
      ...coinsOn(460, 320, 2, 30),
      ...coinsOn(595, 260, 2, 30),
      ...coinsOn(725, 320, 2, 30),
      ...coinRow(850, 260, 4, 40),
      ...coinsOn(1095, 280, 2, 30),
      ...coinsOn(1595, 320, 2, 30),
      ...coinsOn(1725, 250, 2, 30),
      ...coinsOn(1860, 300, 2, 30),
      ...coinsOn(1995, 240, 2, 30),
      ...coinsOn(2125, 300, 2, 30),
      ...coinsOn(2320, 260, 1),
      ...coinRow(2375, 95, 3, 25),    // Hidden ledge
      ...coinsOn(2605, 300, 2, 30),
      ...coinRow(2735, 180, 2),
      ...coinsOn(2875, 210, 2, 30),
      ...coinsOn(3015, 290, 2, 30),
      ...coinsOn(3495, 310, 2, 30),
      ...coinsOn(3625, 250, 2, 30),
    ],
    spikes: [],
    lava: [],
  },

  // ---------------------------------------------------------------
  // LEVEL 9 - NINJA FORTRESS: every trap at once, many enemies
  // ---------------------------------------------------------------
  {
    name: "Ninja Fortress",
    theme: "fortress",
    width: 4200,
    difficulty: 5,
    walkers: true,
    start: { x: 60, y: GROUND_TOP },
    finish: { x: 4100, y: GROUND_TOP },
    checkpoints: [{ x: 1740, y: GROUND_TOP }, { x: 2600, y: GROUND_TOP }],
    platforms: [
      ground(0, 450), ground(780, 560), ground(1700, 460), ground(2560, 500), ground(3480, 720),
      ledge(510, 320, 60), faller(630, 280, 60),
      ledge(960, 300, 80), ledge(1100, 230, 80),
      mover(1400, 320, 80, "x", 140, 0.028),
      ledge(2220, 320, 50), ledge(2330, 260, 50), faller(2440, 300, 60),
      ledge(2780, 300, 90),
      faller(3120, 310, 60), ledge(3240, 250, 60), faller(3360, 300, 60),
      ledge(3640, 300, 90), ledge(3890, 300, 90),
      ledge(1880, 280, 80), secret(1120, 110, 80),
    ],
    enemies: [
      patrol(820, 940, GROUND_TOP, 2.0),
      patrol(1060, 1170, GROUND_TOP, 2.0),
      patrol(1100, 1180, 230, 1.5),
      patrol(1840, 1945, GROUND_TOP, 2.1),
      patrol(2040, 2150, GROUND_TOP, 2.1),
      patrol(2700, 2795, GROUND_TOP, 2.2),
      patrol(2900, 3050, GROUND_TOP, 2.2),
      patrol(3500, 3640, GROUND_TOP, 2.3),
      patrol(3750, 3890, GROUND_TOP, 2.3),
    ],
    coins: [
      ...coinsOn(120, GROUND_TOP, 2),
      ...coinsOn(525, 320, 1),
      ...coinsOn(645, 280, 1),
      ...coinsOn(985, 300, 2),
      ...coinsOn(1125, 230, 2),
      ...coinRow(1135, 70, 3, 25),    // Hidden ledge
      ...coinRow(1420, 280, 4, 40),
      ...coinsOn(1905, 280, 2),
      ...coinsOn(2230, 320, 1),
      ...coinsOn(2340, 260, 1),
      ...coinsOn(2455, 300, 1),
      ...coinsOn(2805, 300, 2),
      ...coinsOn(3135, 310, 1),
      ...coinsOn(3255, 250, 1),
      ...coinsOn(3375, 300, 1),
      ...coinsOn(3665, 300, 2),
      ...coinsOn(3915, 300, 2),
    ],
    spikes: [
      spikes(250, GROUND_TOP, 80),
      spikes(950, GROUND_TOP, 100), spikes(1180, GROUND_TOP, 90),
      spikes(1950, GROUND_TOP, 80),
      spikes(2800, GROUND_TOP, 90),
      spikes(3650, GROUND_TOP, 90), spikes(3900, GROUND_TOP, 90),
    ],
    lava: [lava(450, 330), lava(1340, 360), lava(3060, 420)],
  },

  // ---------------------------------------------------------------
  // LEVEL 10 - FINAL LEVEL: the longest and hardest run. No boss -
  // reach the last gate to complete Ninja Dash!
  // ---------------------------------------------------------------
  {
    name: "Final Level",
    theme: "final",
    width: 5000,
    difficulty: 6,
    walkers: true,
    start: { x: 60, y: GROUND_TOP },
    finish: { x: 4900, y: GROUND_TOP },
    checkpoints: [{ x: 1190, y: GROUND_TOP }, { x: 2540, y: GROUND_TOP }, { x: 3490, y: GROUND_TOP }],
    platforms: [
      ground(0, 400), ground(780, 470), ground(1650, 380), ground(2500, 500), ground(3450, 450), ground(4350, 650),
      // Section 1: lava crossing, then spikes
      ledge(460, 320, 60), faller(580, 270, 60), ledge(700, 320, 50),
      ledge(870, 300, 100), ledge(1030, 300, 100),
      // Section 2: lift up, narrow ledges, then lava with falling platforms
      mover(1310, 330, 80, "y", 140, 0.03), ledge(1450, 190, 50), ledge(1560, 280, 50),
      ledge(1720, 300, 70), ledge(1880, 230, 70),
      faller(2090, 320, 60), ledge(2210, 280, 60), mover(2330, 300, 70, "x", 100, 0.03),
      ledge(2690, 300, 120),
      // Section 3: tiny ledges over a bottomless pit
      ledge(3060, 320, 50), ledge(3170, 260, 50), faller(3280, 320, 50), ledge(3380, 280, 40),
      ledge(3640, 300, 90),
      // Section 4: last lava pit and the final spike run
      mover(3960, 320, 70, "x", 160, 0.03), faller(4240, 280, 50),
      ledge(4490, 300, 100), ledge(4690, 300, 100),
      secret(1900, 100, 70), secret(3660, 170, 70),
    ],
    enemies: [
      patrol(150, 380, GROUND_TOP, 2.0),
      patrol(965, 1035, GROUND_TOP, 2.2),
      patrol(1700, 2010, GROUND_TOP, 2.3),
      patrol(2690, 2810, 300, 1.8),
      patrol(2810, 2990, GROUND_TOP, 2.4),
      patrol(3585, 3645, GROUND_TOP, 2.4),
      patrol(4400, 4490, GROUND_TOP, 2.4),
      patrol(4590, 4690, GROUND_TOP, 2.5),
      patrol(4790, 4880, GROUND_TOP, 2.5),
    ],
    coins: [
      ...coinsOn(120, GROUND_TOP, 1),
      ...coinsOn(475, 320, 1),
      ...coinsOn(595, 270, 1),
      ...coinsOn(715, 320, 1),
      ...coinsOn(895, 300, 2),
      ...coinsOn(1055, 300, 2),
      ...coinRow(1335, 180, 2),
      ...coinsOn(1465, 190, 1),
      ...coinsOn(1575, 280, 1),
      ...coinsOn(1740, 300, 2, 30),
      ...coinsOn(1900, 230, 2, 30),
      ...coinRow(1915, 60, 2, 30),    // Hidden ledge
      ...coinsOn(2105, 320, 1),
      ...coinsOn(2225, 280, 1),
      ...coinRow(2345, 260, 3, 40),
      ...coinsOn(2720, 300, 2),
      ...coinsOn(3075, 320, 1),
      ...coinsOn(3185, 260, 1),
      ...coinsOn(3295, 320, 1),
      ...coinsOn(3400, 280, 1),
      ...coinsOn(3665, 300, 2),
      ...coinRow(3680, 130, 2, 30),   // Hidden ledge
      ...coinRow(3990, 280, 4, 45),
      ...coinsOn(4255, 280, 1),
      ...coinsOn(4515, 300, 2),
      ...coinsOn(4715, 300, 2),
    ],
    spikes: [
      spikes(880, GROUND_TOP, 80), spikes(1040, GROUND_TOP, 70),
      spikes(2700, GROUND_TOP, 100),
      spikes(3650, GROUND_TOP, 70), spikes(3800, GROUND_TOP, 60),
      spikes(4500, GROUND_TOP, 80), spikes(4700, GROUND_TOP, 80),
    ],
    lava: [lava(400, 380), lava(2030, 470), lava(3900, 450)],
  },
];
