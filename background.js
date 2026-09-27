// ===== Ninja Dash - Backgrounds and themes =====
// Each level has a theme: sky colors, moon or sun, scenery, weather and
// platform colors. The background has three layers:
//   1. Sky (stays still)          - drawn once into a cached picture
//   2. Far scenery (moves slowly) - cached, repeats sideways
//   3. Near scenery (moves faster)- cached, repeats sideways
// Moving the layers at different speeds as the camera scrolls ("parallax")
// makes the world look deep. Stars, clouds, embers, fireflies and
// lightning are small things drawn every frame.

const SCENERY_TILE = GAME_WIDTH; // Scenery pictures are 800 px wide and repeat
const FAR_PARALLAX = 0.15;       // Far layer moves at 15% of the camera speed
const NEAR_PARALLAX = 0.35;

// ----- Platform color sets -----
const PLATFORM_STYLES = {
  grass:    { body: ["#5a4a70", "#2f2544"], soil: ["#4a3a58", "#1f1729"], top: "#3f9e55", topLight: "#6fd680", tuft: "#5cc26b", drips: true },
  forest:   { body: ["#6b4a2e", "#3b2718"], soil: ["#3d2c1d", "#1c140c"], top: "#2f8f4a", topLight: "#63c27a", tuft: "#4caf64", drips: true },
  night:    { body: ["#3b4468", "#1e2440"], soil: ["#262c48", "#11142a"], top: "#2e6b73", topLight: "#58a8b0", tuft: "#3f8a92", drips: true },
  sand:     { body: ["#a08660", "#6b5538"], soil: ["#7a6242", "#3e2f1e"], top: "#c9ad7a", topLight: "#e9d3a4", tuft: "#b89a66", drips: false },
  snow:     { body: ["#6b7a94", "#3c4760"], soil: ["#4d5870", "#252c3d"], top: "#e8f1ff", topLight: "#ffffff", tuft: "#d2e2f7", drips: true },
  temple:   { body: ["#5c2a2a", "#2e1414"], soil: ["#3d1f1f", "#1c0d0d"], top: "#c0392b", topLight: "#e76a5c", tuft: "#a93226", drips: false },
  basalt:   { body: ["#3a2a2a", "#1a1111"], soil: ["#2b1d1d", "#120a0a"], top: "#ff6a1a", topLight: "#ffb347", tuft: "#e0501a", drips: false },
  shadow:   { body: ["#3a2350", "#1a0f26"], soil: ["#26173a", "#0e0718"], top: "#8e44ad", topLight: "#c39bd3", tuft: "#7d3c98", drips: true },
  fortress: { body: ["#5d6470", "#2f343c"], soil: ["#40454e", "#1c1f24"], top: "#8a94a3", topLight: "#b8c2d0", tuft: "#7a8494", drips: false },
  obsidian: { body: ["#2a1a2a", "#0e070e"], soil: ["#1f121f", "#080408"], top: "#b3122e", topLight: "#ff4757", tuft: "#8e0e24", drips: false },
};

// ----- The 10 themes -----
const THEMES = {
  training: {
    sky: ["#0b0f24", "#1f1d44", "#3a2552"], moon: { x: 560, y: 95, r: 34, color: "#fbeed3" },
    stars: 70, clouds: "rgba(170, 160, 220, 0.5)",
    far: { color: "#2c2a55", baseY: 280, bump: 60, seed: 11, deco: "pagoda" },
    near: { color: "#1d1b3d", baseY: 330, bump: 40, seed: 23, deco: null },
    mist: "120, 100, 170", platforms: PLATFORM_STYLES.grass,
  },
  forest: {
    sky: ["#081a14", "#123326", "#24503a"], moon: { x: 620, y: 80, r: 26, color: "#e9f5d0" },
    stars: 40, clouds: "rgba(150, 200, 170, 0.35)", fireflies: true,
    far: { color: "#15392a", baseY: 270, bump: 50, seed: 5, deco: "trees" },
    near: { color: "#0d2a1e", baseY: 320, bump: 30, seed: 9, deco: "trees" },
    mist: "90, 150, 110", platforms: PLATFORM_STYLES.forest,
  },
  night: {
    sky: ["#02030a", "#070b1c", "#10162e"], moon: { x: 640, y: 70, r: 22, color: "#dfe7ff", crescent: true },
    stars: 140, clouds: null, darkness: 0.5,
    far: { color: "#0c1128", baseY: 290, bump: 60, seed: 31, deco: null },
    near: { color: "#070a1a", baseY: 340, bump: 35, seed: 37, deco: "pagoda" },
    mist: "60, 70, 120", platforms: PLATFORM_STYLES.night,
  },
  ruins: {
    sky: ["#2a1633", "#7a3b3b", "#e08a4a"], moon: { x: 200, y: 250, r: 55, color: "#ffcf7a", sun: true },
    stars: 10, clouds: "rgba(255, 190, 150, 0.35)",
    far: { color: "#5a2f3a", baseY: 300, bump: 40, seed: 41, deco: "columns" },
    near: { color: "#3a1f2a", baseY: 350, bump: 25, seed: 43, deco: "columns" },
    mist: "230, 150, 100", platforms: PLATFORM_STYLES.sand,
  },
  mountain: {
    sky: ["#0f2240", "#355a86", "#9cc0e0"], moon: { x: 620, y: 90, r: 30, color: "#fffdf0", sun: true },
    stars: 0, clouds: "rgba(255, 255, 255, 0.6)",
    far: { color: "#5f7aa0", baseY: 270, bump: 60, seed: 51, deco: "snowcaps" },
    near: { color: "#34496b", baseY: 330, bump: 70, seed: 53, deco: null },
    mist: "220, 235, 255", platforms: PLATFORM_STYLES.snow,
  },
  temple: {
    sky: ["#1a0610", "#5a1424", "#c0482e"], moon: { x: 400, y: 170, r: 48, color: "#ffd9a0", sun: true },
    stars: 15, clouds: "rgba(255, 150, 120, 0.3)",
    far: { color: "#4a1420", baseY: 290, bump: 45, seed: 61, deco: "pagoda" },
    near: { color: "#2a0a12", baseY: 340, bump: 25, seed: 67, deco: "torii" },
    mist: "200, 80, 60", platforms: PLATFORM_STYLES.temple,
  },
  lava: {
    sky: ["#0c0202", "#3a0a05", "#8a2a0a"], moon: null,
    stars: 0, clouds: "rgba(60, 20, 20, 0.6)", embers: true,
    far: { color: "#2a0a08", baseY: 270, bump: 70, seed: 71, deco: "volcano" },
    near: { color: "#160404", baseY: 340, bump: 40, seed: 73, deco: null },
    mist: "255, 90, 30", platforms: PLATFORM_STYLES.basalt,
  },
  shadow: {
    sky: ["#030008", "#0d0420", "#1c0a33"], moon: { x: 150, y: 90, r: 20, color: "#c9a0ff", crescent: true },
    stars: 60, clouds: "rgba(90, 40, 140, 0.35)", darkness: 0.7,
    far: { color: "#140828", baseY: 290, bump: 60, seed: 81, deco: "crystals" },
    near: { color: "#0b0418", baseY: 345, bump: 30, seed: 83, deco: "crystals" },
    mist: "120, 50, 190", platforms: PLATFORM_STYLES.shadow,
  },
  fortress: {
    sky: ["#0a0d14", "#232b3a", "#4a5568"], moon: { x: 600, y: 85, r: 30, color: "#e8ecf2" },
    stars: 30, clouds: "rgba(120, 130, 150, 0.55)",
    far: { color: "#262d3b", baseY: 280, bump: 30, seed: 91, deco: "castle" },
    near: { color: "#161b25", baseY: 340, bump: 20, seed: 93, deco: "castle" },
    mist: "140, 150, 170", platforms: PLATFORM_STYLES.fortress,
  },
  final: {
    sky: ["#050005", "#200410", "#4a0a18"], moon: { x: 560, y: 110, r: 62, color: "#ff3b3b", blood: true },
    stars: 50, clouds: "rgba(80, 20, 30, 0.6)", embers: true, lightning: true,
    far: { color: "#1c0610", baseY: 280, bump: 80, seed: 101, deco: "castle" },
    near: { color: "#0e0308", baseY: 345, bump: 35, seed: 103, deco: "spires" },
    mist: "180, 30, 50", platforms: PLATFORM_STYLES.obsidian,
  },
};

class Background {
  constructor(themeName) {
    this.theme = THEMES[themeName] || THEMES.training;
    const theme = this.theme;

    // Cached layers (drawn once per level)
    this.skyLayer = createLayer(GAME_WIDTH, GAME_HEIGHT, (c) => drawSky(c, theme));
    this.farLayer = createLayer(SCENERY_TILE, GAME_HEIGHT, (c) => drawScenery(c, theme.far));
    this.nearLayer = createLayer(SCENERY_TILE, GAME_HEIGHT, (c) => drawScenery(c, theme.near));
    this.mistLayer = createLayer(GAME_WIDTH, 150, (c) => {
      const mist = c.createLinearGradient(0, 0, 0, 150);
      mist.addColorStop(0, "rgba(" + theme.mist + ", 0)");
      mist.addColorStop(1, "rgba(" + theme.mist + ", 0.25)");
      c.fillStyle = mist;
      c.fillRect(0, 0, GAME_WIDTH, 150);
    });

    // Stars: fixed positions, each twinkles at its own speed
    const random = makeRandom(7);
    this.stars = [];
    for (let i = 0; i < (theme.stars || 0); i++) {
      this.stars.push({
        x: random() * GAME_WIDTH, y: random() * 230,
        size: random() < 0.85 ? 1 : 2, speed: 1 + random() * 2, phase: random() * Math.PI * 2,
      });
    }

    // Clouds drift slowly to the left
    this.cloudImage = theme.clouds ? createLayer(160, 50, (c) => drawCloud(c, theme.clouds)) : null;
    this.clouds = [
      { x: 60, y: 60, speed: 6, scale: 1 },
      { x: 420, y: 120, speed: 4, scale: 0.7 },
      { x: 700, y: 40, speed: 8, scale: 0.85 },
    ];

    // Floating specks: embers rise (lava), fireflies wander (forest)
    this.specks = [];
    if (theme.embers || theme.fireflies) {
      for (let i = 0; i < 30; i++) {
        this.specks.push({
          x: random() * GAME_WIDTH, y: random() * GAME_HEIGHT,
          speed: 10 + random() * 30, size: 1 + random() * 2, phase: random() * Math.PI * 2,
        });
      }
    }

    // Lightning: a white flash now and then
    this.lightningTimer = 3;
    this.flash = 0;

    // Dark levels: a picture of darkness with a hole of light, drawn
    // around the ninja every frame (made once, only for dark themes)
    this.darknessLayer = null;
    if (theme.darkness) {
      this.darknessLayer = createLayer(GAME_WIDTH * 2, GAME_HEIGHT * 2, (c) => {
        const light = c.createRadialGradient(GAME_WIDTH, GAME_HEIGHT, 90, GAME_WIDTH, GAME_HEIGHT, 330);
        light.addColorStop(0, "rgba(0, 0, 0, 0)");
        light.addColorStop(1, "rgba(0, 0, 0, " + theme.darkness + ")");
        c.fillStyle = light;
        c.fillRect(0, 0, GAME_WIDTH * 2, GAME_HEIGHT * 2);
      });
    }

    this.time = 0;
  }

  update(deltaSeconds) {
    this.time = this.time + deltaSeconds;

    for (const cloud of this.clouds) {
      cloud.x = cloud.x - cloud.speed * deltaSeconds;
      if (cloud.x < -170) {
        cloud.x = GAME_WIDTH + 10; // Gone off the left edge? Come back on the right.
      }
    }

    for (const s of this.specks) {
      if (this.theme.embers) {
        s.y = s.y - s.speed * deltaSeconds;  // Embers float up
        if (s.y < -5) {
          s.y = GAME_HEIGHT + 5;
          s.x = visualRandom() * GAME_WIDTH;
        }
      } else {
        s.x = s.x + Math.sin(this.time * 0.8 + s.phase) * 12 * deltaSeconds; // Fireflies drift
        s.y = s.y + Math.cos(this.time * 0.6 + s.phase) * 10 * deltaSeconds;
      }
    }

    if (this.theme.lightning) {
      this.lightningTimer = this.lightningTimer - deltaSeconds;
      if (this.lightningTimer <= 0) {
        this.flash = 1;
        this.lightningTimer = randomBetween(4, 9);
      }
      this.flash = Math.max(0, this.flash - deltaSeconds * 3);
    }
  }

  // cameraX = how far the level has scrolled
  draw(ctx, cameraX) {
    ctx.drawImage(this.skyLayer, 0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Stars twinkle: brightness goes up and down with a sine wave
    ctx.fillStyle = "#ffffff";
    for (const star of this.stars) {
      ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(this.time * star.speed + star.phase));
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;

    // Lightning lights up the sky behind the scenery
    if (this.flash > 0) {
      ctx.fillStyle = "rgba(255, 220, 230, " + (this.flash * 0.35) + ")";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    if (this.cloudImage) {
      ctx.globalAlpha = 0.5;
      for (const cloud of this.clouds) {
        ctx.drawImage(this.cloudImage, cloud.x, cloud.y, 160 * cloud.scale, 50 * cloud.scale);
      }
      ctx.globalAlpha = 1;
    }

    this.drawRepeating(ctx, this.farLayer, cameraX * FAR_PARALLAX);
    this.drawRepeating(ctx, this.nearLayer, cameraX * NEAR_PARALLAX);
    ctx.drawImage(this.mistLayer, 0, GAME_HEIGHT - 150, GAME_WIDTH, 150);

    // Embers (orange) or fireflies (green)
    if (this.specks.length > 0) {
      ctx.fillStyle = this.theme.embers ? "#ff9a3c" : "#c8ff7a";
      for (const s of this.specks) {
        ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(this.time * 2 + s.phase));
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
      ctx.globalAlpha = 1;
    }
  }

  // Draw a scenery picture twice side by side so it fills the screen
  // however far it has scrolled
  drawRepeating(ctx, layer, offset) {
    const x = -(offset % SCENERY_TILE);
    ctx.drawImage(layer, x, 0, SCENERY_TILE, GAME_HEIGHT);
    ctx.drawImage(layer, x + SCENERY_TILE, 0, SCENERY_TILE, GAME_HEIGHT);
  }

  // Dark levels: darkness everywhere except a circle of light around the ninja
  drawDarkness(ctx, lightX, lightY) {
    if (this.darknessLayer) {
      ctx.drawImage(this.darknessLayer, lightX - GAME_WIDTH, lightY - GAME_HEIGHT, GAME_WIDTH * 2, GAME_HEIGHT * 2);
    }
  }
}

// ----- Sky, moon or sun (drawn once) -----
function drawSky(ctx, theme) {
  const sky = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  sky.addColorStop(0, theme.sky[0]);
  sky.addColorStop(0.55, theme.sky[1]);
  sky.addColorStop(1, theme.sky[2]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  const moon = theme.moon;
  if (!moon) {
    return;
  }

  // Glow
  const glowSize = moon.r * 4;
  const glow = ctx.createRadialGradient(moon.x, moon.y, moon.r * 0.5, moon.x, moon.y, glowSize);
  glow.addColorStop(0, hexToRgba(moon.color, moon.blood ? 0.5 : 0.35));
  glow.addColorStop(1, hexToRgba(moon.color, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(moon.x - glowSize, moon.y - glowSize, glowSize * 2, glowSize * 2);

  ctx.save();
  ctx.fillStyle = moon.color;
  ctx.beginPath();
  ctx.arc(moon.x, moon.y, moon.r, 0, Math.PI * 2);
  ctx.fill();

  if (moon.crescent) {
    // Cut a circle out of the moon to make a crescent
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(moon.x + moon.r * 0.45, moon.y - moon.r * 0.2, moon.r * 0.9, 0, Math.PI * 2);
    ctx.fill();
  } else if (!moon.sun) {
    // Craters (each gets its own path so they aren't joined together)
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    for (const [dx, dy, size] of [[-0.3, -0.25, 0.2], [0.35, 0.3, 0.15], [0.1, -0.45, 0.09], [-0.2, 0.4, 0.12]]) {
      ctx.beginPath();
      ctx.arc(moon.x + dx * moon.r, moon.y + dy * moon.r, size * moon.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

// ----- Scenery layer (drawn once, repeats every 800 px) -----
function drawScenery(ctx, layer) {
  drawMountainRange(ctx, layer.baseY, layer.bump, layer.seed, layer.color);

  const random = makeRandom(layer.seed * 7 + 3);
  ctx.fillStyle = shadeColor(layer.color, -12);

  switch (layer.deco) {
    case "pagoda":
      drawPagoda(ctx, 520, layer.baseY - layer.bump * 0.3, layer.color);
      break;
    case "trees":
      for (let x = 20; x < SCENERY_TILE - 20; x += 35 + random() * 40) {
        drawPineTree(ctx, x, layer.baseY + 10 - random() * 30, 40 + random() * 50, layer.color);
      }
      break;
    case "columns":
      for (let x = 60; x < SCENERY_TILE - 60; x += 110 + random() * 90) {
        drawColumn(ctx, x, layer.baseY + 20, 60 + random() * 90, random() < 0.5, layer.color);
      }
      break;
    case "snowcaps":
      drawSnowCaps(ctx, layer);
      break;
    case "torii":
      drawTorii(ctx, 250, layer.baseY + 15, 70, layer.color);
      drawTorii(ctx, 610, layer.baseY + 20, 50, layer.color);
      break;
    case "volcano":
      drawVolcano(ctx, 420, layer.baseY + 30, layer.color);
      break;
    case "crystals":
      for (let x = 40; x < SCENERY_TILE - 40; x += 70 + random() * 90) {
        drawCrystal(ctx, x, layer.baseY + 20, 30 + random() * 60, layer.color);
      }
      break;
    case "castle":
      drawCastle(ctx, 180, layer.baseY + 10, layer.color);
      drawCastle(ctx, 560, layer.baseY + 20, layer.color);
      break;
    case "spires":
      for (let x = 30; x < SCENERY_TILE - 30; x += 60 + random() * 70) {
        const h = 60 + random() * 90;
        ctx.fillStyle = layer.color;
        ctx.beginPath();
        ctx.moveTo(x - 12, layer.baseY + 20);
        ctx.lineTo(x - 3, layer.baseY + 20 - h);
        ctx.lineTo(x + 2, layer.baseY + 20 - h * 0.7);
        ctx.lineTo(x + 12, layer.baseY + 20);
        ctx.fill();
      }
      break;
  }
}

// Bumpy mountain outline that repeats seamlessly every 800 px.
// |sin(x / length)| repeats every PI * length pixels, so each length is
// chosen so that a whole number of bumps fits into 800 px.
function drawMountainRange(ctx, baseY, bumpHeight, seed, color) {
  const random = makeRandom(seed);
  const waves = [];
  for (let i = 0; i < 3; i++) {
    const bumpsPerTile = 1 + Math.floor(random() * 4);
    waves.push({
      length: SCENERY_TILE / (Math.PI * bumpsPerTile),
      offset: random() * SCENERY_TILE,
      height: bumpHeight * (0.4 + random() * 0.6),
    });
  }

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, GAME_HEIGHT);
  for (let x = 0; x <= SCENERY_TILE; x += 8) {
    ctx.lineTo(x, mountainHeightAt(x, baseY, waves));
  }
  ctx.lineTo(SCENERY_TILE, GAME_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function mountainHeightAt(x, baseY, waves) {
  let y = baseY;
  for (const wave of waves) {
    y = y - Math.abs(Math.sin((x + wave.offset) / wave.length)) * wave.height;
  }
  return y;
}

// ----- Scenery shapes -----
function drawPagoda(ctx, x, groundY, color) {
  ctx.fillStyle = shadeColor(color, -10);
  const floors = [{ width: 46, height: 14 }, { width: 38, height: 12 }, { width: 30, height: 11 }];
  let y = groundY;
  ctx.fillRect(x - 30, groundY, 60, GAME_HEIGHT - groundY); // Hill under it
  for (const floor of floors) {
    ctx.fillRect(x - floor.width / 2 + 7, y - floor.height, floor.width - 14, floor.height);
    y = y - floor.height;
    ctx.beginPath();
    ctx.moveTo(x - floor.width / 2 - 6, y + 2);
    ctx.quadraticCurveTo(x, y - 12, x + floor.width / 2 + 6, y + 2);
    ctx.lineTo(x + floor.width / 2 - 4, y - 3);
    ctx.lineTo(x - floor.width / 2 + 4, y - 3);
    ctx.closePath();
    ctx.fill();
    y = y - 4;
  }
  ctx.fillRect(x - 1, y - 12, 2, 12);
  ctx.fillStyle = "rgba(255, 190, 110, 0.8)"; // One warm lit window
  ctx.fillRect(x - 2, groundY - 10, 4, 5);
}

function drawPineTree(ctx, x, baseY, height, color) {
  ctx.fillStyle = shadeColor(color, -8);
  ctx.fillRect(x - 2, baseY - height * 0.2, 4, height * 0.2 + GAME_HEIGHT);
  for (let i = 0; i < 3; i++) {
    const layerY = baseY - height * 0.2 - i * height * 0.25;
    const width = height * (0.45 - i * 0.1);
    ctx.beginPath();
    ctx.moveTo(x - width / 2, layerY);
    ctx.lineTo(x, layerY - height * 0.4);
    ctx.lineTo(x + width / 2, layerY);
    ctx.closePath();
    ctx.fill();
  }
}

function drawColumn(ctx, x, baseY, height, isBroken, color) {
  ctx.fillStyle = shadeColor(color, 12);
  ctx.fillRect(x - 9, baseY - height, 18, height + GAME_HEIGHT);
  if (isBroken) {
    // Jagged broken top
    ctx.fillStyle = shadeColor(color, 12);
    ctx.beginPath();
    ctx.moveTo(x - 9, baseY - height);
    ctx.lineTo(x - 3, baseY - height - 8);
    ctx.lineTo(x + 2, baseY - height - 2);
    ctx.lineTo(x + 9, baseY - height - 10);
    ctx.lineTo(x + 9, baseY - height);
    ctx.fill();
  } else {
    ctx.fillRect(x - 14, baseY - height - 6, 28, 6); // Capital on top
  }
}

function drawSnowCaps(ctx, layer) {
  // Re-trace the mountain and paint the top 25 px of it white
  const random = makeRandom(layer.seed);
  const waves = [];
  for (let i = 0; i < 3; i++) {
    const bumpsPerTile = 1 + Math.floor(random() * 4);
    waves.push({ length: SCENERY_TILE / (Math.PI * bumpsPerTile), offset: random() * SCENERY_TILE, height: layer.bump * (0.4 + random() * 0.6) });
  }
  let highest = GAME_HEIGHT;
  for (let x = 0; x <= SCENERY_TILE; x += 8) {
    highest = Math.min(highest, mountainHeightAt(x, layer.baseY, waves));
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, SCENERY_TILE, highest + 45);
  ctx.clip();
  ctx.fillStyle = "rgba(240, 248, 255, 0.85)";
  ctx.beginPath();
  ctx.moveTo(0, GAME_HEIGHT);
  for (let x = 0; x <= SCENERY_TILE; x += 8) {
    ctx.lineTo(x, mountainHeightAt(x, layer.baseY, waves));
  }
  ctx.lineTo(SCENERY_TILE, GAME_HEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTorii(ctx, x, baseY, height, color) {
  ctx.fillStyle = shadeColor(color, 20);
  const width = height * 1.2;
  ctx.fillRect(x - width / 2 + 8, baseY - height, 7, height + GAME_HEIGHT);  // Left post
  ctx.fillRect(x + width / 2 - 15, baseY - height, 7, height + GAME_HEIGHT); // Right post
  ctx.fillRect(x - width / 2, baseY - height * 0.75, width, 5);              // Lower beam
  ctx.beginPath();                                                            // Curved top beam
  ctx.moveTo(x - width / 2 - 10, baseY - height - 4);
  ctx.quadraticCurveTo(x, baseY - height + 4, x + width / 2 + 10, baseY - height - 4);
  ctx.lineTo(x + width / 2 + 6, baseY - height + 4);
  ctx.quadraticCurveTo(x, baseY - height + 10, x - width / 2 - 6, baseY - height + 4);
  ctx.closePath();
  ctx.fill();
}

function drawVolcano(ctx, x, baseY, color) {
  ctx.fillStyle = shadeColor(color, 8);
  ctx.beginPath();
  ctx.moveTo(x - 220, baseY + 40);
  ctx.lineTo(x - 40, baseY - 150);
  ctx.lineTo(x + 40, baseY - 150);
  ctx.lineTo(x + 220, baseY + 40);
  ctx.closePath();
  ctx.fill();
  // Glowing crater and lava streams
  const glow = ctx.createRadialGradient(x, baseY - 150, 5, x, baseY - 150, 90);
  glow.addColorStop(0, "rgba(255, 140, 40, 0.8)");
  glow.addColorStop(1, "rgba(255, 60, 20, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x - 90, baseY - 240, 180, 180);
  ctx.strokeStyle = "rgba(255, 110, 30, 0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 10, baseY - 148);
  ctx.quadraticCurveTo(x - 30, baseY - 80, x - 70, baseY);
  ctx.moveTo(x + 15, baseY - 148);
  ctx.quadraticCurveTo(x + 25, baseY - 70, x + 60, baseY + 10);
  ctx.stroke();
}

function drawCrystal(ctx, x, baseY, height, color) {
  ctx.fillStyle = shadeColor(color, 25);
  ctx.beginPath();
  ctx.moveTo(x - 10, baseY);
  ctx.lineTo(x - 4, baseY - height);
  ctx.lineTo(x + 6, baseY - height * 0.8);
  ctx.lineTo(x + 10, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(200, 150, 255, 0.25)"; // Faint shine
  ctx.fillRect(x - 3, baseY - height * 0.8, 2, height * 0.6);
}

function drawCastle(ctx, x, baseY, color) {
  ctx.fillStyle = shadeColor(color, 10);
  ctx.fillRect(x - 70, baseY - 50, 140, 60 + GAME_HEIGHT);       // Wall
  for (let i = -70; i < 70; i += 14) {
    ctx.fillRect(x + i, baseY - 58, 8, 8);                     // Battlements
  }
  for (const towerX of [x - 80, x + 60]) {
    ctx.fillRect(towerX, baseY - 100, 22, 110 + GAME_HEIGHT);  // Towers
    ctx.beginPath();
    ctx.moveTo(towerX - 4, baseY - 100);
    ctx.lineTo(towerX + 11, baseY - 125);
    ctx.lineTo(towerX + 26, baseY - 100);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255, 190, 110, 0.7)"; // Lit windows
  ctx.fillRect(x - 74, baseY - 80, 4, 6);
  ctx.fillRect(x + 66, baseY - 70, 4, 6);
  ctx.fillRect(x - 10, baseY - 30, 5, 7);
}

// A soft cloud made of overlapping circles
function drawCloud(ctx, color) {
  ctx.fillStyle = color;
  for (const [x, y, radius] of [[40, 32, 18], [65, 24, 22], [95, 28, 20], [120, 34, 15], [80, 38, 18]]) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ----- Color helpers -----
// "#rrggbb" → "rgba(r, g, b, alpha)"
function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return "rgba(" + (n >> 16) + ", " + ((n >> 8) & 255) + ", " + (n & 255) + ", " + alpha + ")";
}

// Make a "#rrggbb" color lighter (+) or darker (-)
function shadeColor(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amount);
  const g = clamp(((n >> 8) & 255) + amount);
  const b = clamp((n & 255) + amount);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
