// ===== Ninja Dash - Level objects =====
// Things placed in levels besides platforms, enemies and coins:
//   Spikes     - hurt like an enemy (lose 1 heart)
//   LavaPool   - fills a pit; touching it is like falling into the pit
//   Checkpoint - a lantern that saves your progress when you pass it
//   FinishGate - a torii gate at the end of the level

const SPIKE_HEIGHT = 12;
const LAVA_SURFACE = 410; // Lava's top edge (the ground's top is 390)

// ----- Spikes -----
class Spikes {
  constructor(x, surfaceY, width) {
    // The hitbox is the spikes themselves, sitting on the surface
    this.x = x;
    this.y = surfaceY - SPIKE_HEIGHT;
    this.width = width;
    this.height = SPIKE_HEIGHT;
    this.image = null;
  }

  draw(ctx) {
    if (!this.image) {
      const width = this.width;
      this.image = createLayer(width, SPIKE_HEIGHT, function (c) {
        const count = Math.max(1, Math.round(width / 10));
        const spikeWidth = width / count;
        for (let i = 0; i < count; i++) {
          const left = i * spikeWidth;
          const metal = c.createLinearGradient(left, 0, left + spikeWidth, 0);
          metal.addColorStop(0, "#dfe4ee");
          metal.addColorStop(1, "#7d8597");
          c.fillStyle = metal;
          c.beginPath();
          c.moveTo(left, SPIKE_HEIGHT);
          c.lineTo(left + spikeWidth / 2, 0);
          c.lineTo(left + spikeWidth, SPIKE_HEIGHT);
          c.closePath();
          c.fill();
        }
      });
    }
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

// ----- Lava -----
class LavaPool {
  constructor(x, width) {
    this.x = x;
    this.width = width;
    this.y = LAVA_SURFACE;
    this.height = GAME_HEIGHT - LAVA_SURFACE;
    this.glowGradient = null; // Made once on the first draw, then reused
    this.lavaGradient = null;
  }

  // Is this rectangle (the player) touching the lava?
  isTouching(rect) {
    return rect.y + rect.height > this.y + 4 && rect.x + rect.width > this.x && rect.x < this.x + this.width;
  }

  draw(ctx, time) {
    // Gradients never change, so they are made once and reused
    if (!this.glowGradient) {
      this.glowGradient = ctx.createLinearGradient(0, this.y - 50, 0, this.y);
      this.glowGradient.addColorStop(0, "rgba(255, 90, 20, 0)");
      this.glowGradient.addColorStop(1, "rgba(255, 90, 20, 0.35)");
      this.lavaGradient = ctx.createLinearGradient(0, this.y, 0, GAME_HEIGHT);
      this.lavaGradient.addColorStop(0, "#ffb347");
      this.lavaGradient.addColorStop(0.3, "#ff5e1a");
      this.lavaGradient.addColorStop(1, "#8a1a05");
    }

    // Glow above the lava
    ctx.fillStyle = this.glowGradient;
    ctx.fillRect(this.x, this.y - 50, this.width, 50);

    // Wavy surface
    ctx.fillStyle = this.lavaGradient;
    ctx.beginPath();
    ctx.moveTo(this.x, GAME_HEIGHT);
    for (let x = this.x; x <= this.x + this.width; x += 10) {
      ctx.lineTo(x, this.y + Math.sin(x * 0.05 + time * 3) * 3);
    }
    ctx.lineTo(this.x + this.width, GAME_HEIGHT);
    ctx.closePath();
    ctx.fill();

    // Bright bubbles
    ctx.fillStyle = "rgba(255, 230, 150, 0.8)";
    for (let x = this.x + 20; x < this.x + this.width - 10; x += 55) {
      const bob = Math.sin(time * 2 + x) * 4;
      ctx.beginPath();
      ctx.arc(x, this.y + 14 + bob, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ----- Checkpoint lantern -----
class Checkpoint {
  constructor(x, surfaceY) {
    this.x = x;
    this.surfaceY = surfaceY;
    // Touch area: the post and the air above it
    this.triggerBox = { x: x - 5, y: surfaceY - 130, width: 40, height: 130 };
    this.isActive = false;
    this.glowGradient = null;
  }

  draw(ctx, time) {
    const postX = this.x + 13;
    const top = this.surfaceY - 70;

    // Wooden post
    fillRoundedRect(ctx, postX, top, 5, 70, 2, "#5a3e2b");
    ctx.fillRect(postX - 6, top, 20, 3);

    // Paper lantern hanging from it, lit when active
    const swing = Math.sin(time * 2 + this.x) * 2;
    const lanternX = postX + 12 + swing;
    const lanternY = top + 12;
    if (this.isActive) {
      if (!this.glowGradient) {
        const cx = postX + 12;
        this.glowGradient = ctx.createRadialGradient(cx, lanternY, 2, cx, lanternY, 45);
        this.glowGradient.addColorStop(0, "rgba(255, 190, 90, 0.55)");
        this.glowGradient.addColorStop(1, "rgba(255, 190, 90, 0)");
      }
      ctx.fillStyle = this.glowGradient;
      ctx.fillRect(postX + 12 - 45, lanternY - 45, 90, 90);
    }
    ctx.strokeStyle = "#2a1e14";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(postX + 12, top + 3);
    ctx.lineTo(lanternX, lanternY - 9);
    ctx.stroke();
    fillRoundedRect(ctx, lanternX - 8, lanternY - 9, 16, 20, 6, this.isActive ? "#ff9f43" : "#6b6f80");
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(lanternX - 8, lanternY - 2, 16, 2);
    ctx.fillRect(lanternX - 8, lanternY + 4, 16, 2);
  }
}

// ----- Finish gate -----
class FinishGate {
  constructor(x, surfaceY) {
    this.x = x;
    this.surfaceY = surfaceY;
    this.triggerBox = { x: x + 10, y: surfaceY - 120, width: 50, height: 120 };
    this.lightGradient = null;
  }

  draw(ctx, time) {
    const x = this.x;
    const base = this.surfaceY;

    // Shimmering light between the posts
    if (!this.lightGradient) {
      this.lightGradient = ctx.createLinearGradient(0, base - 100, 0, base);
      this.lightGradient.addColorStop(0, "rgba(255, 230, 150, 0)");
      this.lightGradient.addColorStop(1, "rgba(255, 230, 150, 1)");
    }
    ctx.globalAlpha = 0.25 + 0.15 * Math.sin(time * 3);
    ctx.fillStyle = this.lightGradient;
    ctx.fillRect(x + 12, base - 100, 46, 100);
    ctx.globalAlpha = 1;

    // Red torii gate
    ctx.fillStyle = "#d63031";
    ctx.fillRect(x + 6, base - 100, 7, 100);  // Left post
    ctx.fillRect(x + 57, base - 100, 7, 100); // Right post
    ctx.fillRect(x, base - 82, 70, 6);        // Lower beam
    ctx.fillStyle = "#1a1d27";
    ctx.beginPath();                          // Curved black top beam
    ctx.moveTo(x - 10, base - 108);
    ctx.quadraticCurveTo(x + 35, base - 98, x + 80, base - 108);
    ctx.lineTo(x + 76, base - 99);
    ctx.quadraticCurveTo(x + 35, base - 92, x - 6, base - 99);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#d63031";
    ctx.fillRect(x - 4, base - 98, 78, 5);

    // Hanging sign
    fillRoundedRect(ctx, x + 26, base - 76, 18, 22, 2, "#1a1d27");
    ctx.fillStyle = "#ffd166";
    ctx.font = "bold 12px Segoe UI, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("★", x + 35, base - 65);
  }
}
