// ===== Ninja Dash - Background =====
// A night scene: sky, moon, twinkling stars, drifting clouds and
// mountains with a pagoda. The parts that never move are drawn once
// into a cached layer; only stars and clouds are drawn every frame.

class Background {
  constructor() {
    // Everything that never changes: drawn once
    this.staticLayer = createLayer(GAME_WIDTH, GAME_HEIGHT, drawStaticBackground);

    // Stars: fixed positions, each twinkles at its own speed
    const random = makeRandom(7);
    this.stars = [];
    for (let i = 0; i < 70; i++) {
      this.stars.push({
        x: random() * GAME_WIDTH,
        y: random() * 230,
        size: random() < 0.85 ? 1 : 2,
        speed: 1 + random() * 2,
        phase: random() * Math.PI * 2,
      });
    }

    // Clouds: a few soft shapes drifting slowly to the left
    this.cloudImage = createLayer(160, 50, drawCloud);
    this.clouds = [
      { x: 60, y: 60, speed: 6, scale: 1 },
      { x: 420, y: 120, speed: 4, scale: 0.7 },
      { x: 700, y: 40, speed: 8, scale: 0.85 },
    ];

    this.time = 0;
  }

  update(deltaSeconds) {
    this.time = this.time + deltaSeconds;

    for (const cloud of this.clouds) {
      cloud.x = cloud.x - cloud.speed * deltaSeconds;
      // Gone off the left edge? Come back on the right.
      if (cloud.x < -170) {
        cloud.x = GAME_WIDTH + 10;
      }
    }
  }

  draw(ctx) {
    ctx.drawImage(this.staticLayer, 0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Stars twinkle: brightness goes up and down with a sine wave
    ctx.fillStyle = "#ffffff";
    for (const star of this.stars) {
      ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(this.time * star.speed + star.phase));
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;

    for (const cloud of this.clouds) {
      ctx.globalAlpha = 0.5;
      ctx.drawImage(this.cloudImage, cloud.x, cloud.y, 160 * cloud.scale, 50 * cloud.scale);
    }
    ctx.globalAlpha = 1;
  }
}

// ----- The parts that never change -----
function drawStaticBackground(ctx) {
  // Sky: deep blue at the top, purple near the horizon
  const sky = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  sky.addColorStop(0, "#0b0f24");
  sky.addColorStop(0.55, "#1f1d44");
  sky.addColorStop(1, "#3a2552");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Moon glow, then the moon itself
  const moonX = 560;
  const moonY = 95;
  const glow = ctx.createRadialGradient(moonX, moonY, 20, moonX, moonY, 140);
  glow.addColorStop(0, "rgba(255, 236, 200, 0.35)");
  glow.addColorStop(1, "rgba(255, 236, 200, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(moonX - 140, moonY - 140, 280, 280);

  ctx.fillStyle = "#fbeed3";
  ctx.beginPath();
  ctx.arc(moonX, moonY, 34, 0, Math.PI * 2);
  ctx.fill();

  // A few darker craters
  ctx.fillStyle = "rgba(200, 180, 150, 0.45)";
  const craters = [[-10, -8, 7], [12, 10, 5], [4, -16, 3], [-6, 14, 4]];
  for (const [offsetX, offsetY, radius] of craters) {
    ctx.beginPath(); // A new path for each crater, so they aren't joined together
    ctx.arc(moonX + offsetX, moonY + offsetY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Far mountains (lighter, hazy), then near mountains (darker)
  drawMountainRange(ctx, 280, 60, 11, "#2c2a55");
  drawPagoda(ctx, 690, 262);
  drawMountainRange(ctx, 330, 40, 23, "#1d1b3d");

  // Mist near the ground
  const mist = ctx.createLinearGradient(0, 300, 0, GAME_HEIGHT);
  mist.addColorStop(0, "rgba(120, 100, 170, 0)");
  mist.addColorStop(1, "rgba(120, 100, 170, 0.25)");
  ctx.fillStyle = mist;
  ctx.fillRect(0, 300, GAME_WIDTH, GAME_HEIGHT - 300);
}

// Bumpy mountain outline made by adding together a few sine waves
function drawMountainRange(ctx, baseY, bumpHeight, seed, color) {
  const random = makeRandom(seed);
  const waves = [];
  for (let i = 0; i < 3; i++) {
    waves.push({ length: 80 + random() * 200, offset: random() * 1000, height: bumpHeight * (0.4 + random() * 0.6) });
  }

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, GAME_HEIGHT);
  for (let x = 0; x <= GAME_WIDTH; x += 8) {
    let y = baseY;
    for (const wave of waves) {
      y = y - Math.abs(Math.sin((x + wave.offset) / wave.length)) * wave.height;
    }
    ctx.lineTo(x, y);
  }
  ctx.lineTo(GAME_WIDTH, GAME_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

// Small silhouette of a Japanese pagoda on a hill
function drawPagoda(ctx, x, groundY) {
  ctx.fillStyle = "#23214a";
  const floors = [
    { width: 46, height: 14 },
    { width: 38, height: 12 },
    { width: 30, height: 11 },
  ];
  let y = groundY;
  for (const floor of floors) {
    // Wall
    ctx.fillRect(x - floor.width / 2 + 7, y - floor.height, floor.width - 14, floor.height);
    y = y - floor.height;
    // Curved roof
    ctx.beginPath();
    ctx.moveTo(x - floor.width / 2 - 6, y + 2);
    ctx.quadraticCurveTo(x, y - 12, x + floor.width / 2 + 6, y + 2);
    ctx.lineTo(x + floor.width / 2 - 4, y - 3);
    ctx.lineTo(x - floor.width / 2 + 4, y - 3);
    ctx.closePath();
    ctx.fill();
    y = y - 4;
  }
  // Spire
  ctx.fillRect(x - 1, y - 12, 2, 12);

  // One warm lit window
  ctx.fillStyle = "rgba(255, 190, 110, 0.8)";
  ctx.fillRect(x - 2, groundY - 10, 4, 5);
}

// A soft cloud made of overlapping circles
function drawCloud(ctx) {
  ctx.fillStyle = "rgba(170, 160, 220, 0.5)";
  const puffs = [
    [40, 32, 18], [65, 24, 22], [95, 28, 20], [120, 34, 15], [80, 38, 18],
  ];
  for (const [x, y, radius] of puffs) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
