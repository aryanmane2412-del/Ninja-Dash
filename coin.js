// ===== Ninja Dash - Coins =====
// A Coin is a small collectible. The player touches it, it disappears,
// and the score goes up. It spins and floats up and down.

// ----- Spin animation: 6 frames -----
// Each frame is how wide the coin looks (1 = full circle, 0.15 = edge-on).
// Going full → thin → full looks like a coin turning around.
const COIN_SPIN_FRAMES = [1, 0.8, 0.45, 0.15, 0.45, 0.8];

class Coin {
  // x, y = top-left corner of the coin's hit box
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;

    // Spin: frame-based animation, 0.09 seconds per frame
    this.spinAnimation = new Animation(COIN_SPIN_FRAMES, 0.09);

    // Float: smooth up-and-down, driven by its own timer
    this.floatTime = 0;

    // Start each coin at a different point (based on x),
    // so they don't all spin and float in perfect sync
    this.spinAnimation.timer = x * 0.004;
    this.floatTime = x * 0.05;

    // Colors
    this.fillColor = "#ffd166";
    this.edgeColor = "#e09f1f";
    this.shineColor = "#fff3c4";
  }

  // Move both animations forward by the time since the last frame
  update(deltaSeconds) {
    this.spinAnimation.update(deltaSeconds);
    this.floatTime = this.floatTime + deltaSeconds * 4.8;
  }

  // Draw a glowing, spinning, floating coin
  draw(ctx) {
    // Float: move up and down by up to 4px using a sine wave
    const floatOffset = Math.sin(this.floatTime) * 4;

    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2 + floatOffset;
    const radius = this.width / 2;

    // Soft glow behind the coin (a cached picture shared by all coins)
    ctx.globalAlpha = 0.55 + 0.25 * Math.sin(this.floatTime * 1.5);
    ctx.drawImage(getCoinGlow(), centerX - 22, centerY - 22, 44, 44);
    ctx.globalAlpha = 1;

    // Spin: the current frame says how wide to draw the coin
    const spinWidth = radius * this.spinAnimation.getFrame();
    const isEdgeOn = spinWidth < radius * 0.3;

    // Coin body: golden gradient, darker when edge-on (like real metal)
    if (isEdgeOn) {
      ctx.fillStyle = this.edgeColor;
    } else {
      const gold = ctx.createLinearGradient(centerX - spinWidth, centerY - radius, centerX + spinWidth, centerY + radius);
      gold.addColorStop(0, "#fff0a8");
      gold.addColorStop(0.5, this.fillColor);
      gold.addColorStop(1, "#e0a020");
      ctx.fillStyle = gold;
    }
    ctx.strokeStyle = this.edgeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, spinWidth, radius, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (!isEdgeOn) {
      // Inner ring
      ctx.strokeStyle = "rgba(224, 159, 31, 0.8)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, spinWidth * 0.68, radius * 0.68, 0, 0, Math.PI * 2);
      ctx.stroke();

      // A small star in the middle, squashed with the spin
      drawStar(ctx, centerX, centerY, radius * 0.4, spinWidth / radius, this.shineColor);
    }

    // Twinkle: a sparkle flashes on the coin once per spin
    if (this.spinAnimation.getFrameIndex() === 0) {
      drawSparkle(ctx, centerX + 5, centerY - 6, 5);
    }
  }
}

// ----- Shared coin art -----
let coinGlowImage = null;

// The glow is the same for every coin, so it's drawn once and reused
function getCoinGlow() {
  if (!coinGlowImage) {
    coinGlowImage = createLayer(44, 44, function (layerCtx) {
      const glow = layerCtx.createRadialGradient(22, 22, 4, 22, 22, 22);
      glow.addColorStop(0, "rgba(255, 209, 102, 0.6)");
      glow.addColorStop(1, "rgba(255, 209, 102, 0)");
      layerCtx.fillStyle = glow;
      layerCtx.fillRect(0, 0, 44, 44);
    });
  }
  return coinGlowImage;
}

// 5-pointed star; widthScale squashes it sideways to match the spin
function drawStar(ctx, centerX, centerY, size, widthScale, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const distance = i % 2 === 0 ? size : size * 0.45;
    const px = centerX + Math.cos(angle) * distance * widthScale;
    const py = centerY + Math.sin(angle) * distance;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.fill();
}

// A 4-pointed twinkle
function drawSparkle(ctx, x, y, size) {
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.25, y - size * 0.25);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size * 0.25, y + size * 0.25);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size * 0.25, y + size * 0.25);
  ctx.lineTo(x - size, y);
  ctx.lineTo(x - size * 0.25, y - size * 0.25);
  ctx.closePath();
  ctx.fill();
}
