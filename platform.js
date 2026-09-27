// ===== Ninja Dash - Platforms =====
// A Platform is a solid rectangle the player can stand on.
// The ground is also a platform - just a very wide one.

const GRASS_OVERHANG = 8; // Grass tufts poke this many pixels above the platform

class Platform {
  constructor(x, y, width, height) {
    this.x = x;           // Left edge
    this.y = y;           // Top edge (where the player stands)
    this.width = width;
    this.height = height;

    this.isGround = height > 30; // The ground gets a different look
    this.image = null;           // Cached picture, made the first time we draw
  }

  // Draw the platform on the canvas.
  // The detailed picture is made once, then copied every frame.
  draw(ctx) {
    if (!this.image) {
      const self = this;
      this.image = createLayer(this.width, this.height + GRASS_OVERHANG, function (layerCtx) {
        layerCtx.translate(0, GRASS_OVERHANG);
        if (self.isGround) {
          drawGroundArt(layerCtx, self.width, self.height, self.x + self.y);
        } else {
          drawFloatingPlatformArt(layerCtx, self.width, self.height, self.x + self.y);
        }
      });
    }
    ctx.drawImage(this.image, this.x, this.y - GRASS_OVERHANG, this.width, this.height + GRASS_OVERHANG);
  }
}

// ----- Platform art (drawn once per platform) -----
// Positions are relative: (0, 0) is the platform's top-left corner.

// Floating stone slab with grass on top
function drawFloatingPlatformArt(ctx, width, height, seed) {
  const random = makeRandom(seed);

  // Stone body, rounded at the bottom
  const stone = ctx.createLinearGradient(0, 0, 0, height);
  stone.addColorStop(0, "#5a4a70");
  stone.addColorStop(1, "#2f2544");
  roundedRectPath(ctx, 0, 0, width, height, 6);
  ctx.fillStyle = stone;
  ctx.fill();

  // Stone block lines
  ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 18 + random() * 12; x < width - 8; x += 22 + random() * 14) {
    ctx.moveTo(x, 7);
    ctx.lineTo(x, height - 2);
  }
  ctx.stroke();

  drawGrassTop(ctx, width, 6, random, true);
}

// The ground: dark soil with pebbles and grass on top
function drawGroundArt(ctx, width, height, seed) {
  const random = makeRandom(seed);

  const soil = ctx.createLinearGradient(0, 0, 0, height);
  soil.addColorStop(0, "#4a3a58");
  soil.addColorStop(1, "#1f1729");
  ctx.fillStyle = soil;
  ctx.fillRect(0, 0, width, height);

  // Pebbles
  for (let i = 0; i < 40; i++) {
    const shade = random() < 0.5 ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.2)";
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.ellipse(random() * width, 14 + random() * (height - 18), 2 + random() * 5, 1.5 + random() * 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawGrassTop(ctx, width, 8, random, false);
}

// Grass strip along the top, with tufts sticking up and (optionally)
// drips hanging over the edge
function drawGrassTop(ctx, width, thickness, random, hasDrips) {
  ctx.fillStyle = "#3f9e55";
  ctx.fillRect(0, 0, width, thickness);

  // Grass hanging down over the front edge
  if (hasDrips) {
    for (let x = 4; x < width - 6; x += 7 + random() * 10) {
      const length = 3 + random() * 6;
      fillRoundedRect(ctx, x, thickness - 2, 4, length, 2, "#3f9e55");
    }
  }

  // Light edge along the very top
  ctx.fillStyle = "#6fd680";
  ctx.fillRect(0, 0, width, 2);

  // Little tufts poking up
  ctx.fillStyle = "#5cc26b";
  for (let x = 3; x < width - 3; x += 5 + random() * 12) {
    const tuftHeight = 2 + random() * (GRASS_OVERHANG - 3);
    ctx.beginPath();
    ctx.moveTo(x - 2, 1);
    ctx.lineTo(x, -tuftHeight);
    ctx.lineTo(x + 2, 1);
    ctx.closePath();
    ctx.fill();
  }
}

// ----- Rectangle collision detection -----
// Returns true if rectangle a and rectangle b overlap.
// Works with anything that has x, y, width and height (player, platform...).
function isRectangleColliding(a, b) {
  return (
    a.x < b.x + b.width &&   // a's left side is left of b's right side
    a.x + a.width > b.x &&   // a's right side is right of b's left side
    a.y < b.y + b.height &&  // a's top is above b's bottom
    a.y + a.height > b.y     // a's bottom is below b's top
  );
}
