// ===== Ninja Dash - Visual effects =====
// Particles (dust, sparkles, sparks), floating text ("+10") and screen shake.
// Effects are ONLY for looks - they never change the gameplay.

const MAX_PARTICLES = 250; // Hard limit, so effects can never slow the game down

class Effects {
  constructor() {
    this.particles = [];
    this.texts = [];
    this.shakeTime = 0;     // Seconds of shaking left
    this.shakeDuration = 0;
    this.shakeStrength = 0; // Pixels
  }

  // Remove everything (new game)
  clear() {
    this.particles = [];
    this.texts = [];
    this.shakeTime = 0;
  }

  // ----- The basic building block: a burst of particles -----
  // options: count, colors, speed [min, max], angle [min, max] in radians,
  //          life [min, max] in seconds, size [min, max], gravity, shape
  burst(x, y, options) {
    for (let i = 0; i < options.count; i++) {
      if (this.particles.length >= MAX_PARTICLES) {
        return; // Too many already - skip the rest
      }
      const angle = randomBetween(options.angle[0], options.angle[1]);
      const speed = randomBetween(options.speed[0], options.speed[1]);
      const life = randomBetween(options.life[0], options.life[1]);

      this.particles.push({
        x: x,
        y: y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        gravity: options.gravity || 0,
        life: life,       // Seconds left
        maxLife: life,
        size: randomBetween(options.size[0], options.size[1]),
        color: randomItem(options.colors),
        shape: options.shape || "circle",
      });
    }
  }

  // ----- Ready-made effects -----
  // Angles: 0 = right, PI/2 = down, PI = left, -PI/2 = up

  // Small puff of dust at the feet when jumping
  jumpDust(x, y) {
    this.burst(x, y, {
      count: 10, colors: ["#b7a7d9", "#8e82b3"], speed: [30, 90],
      angle: [Math.PI * 0.85, Math.PI * 1.15], life: [0.25, 0.45], size: [2, 4], gravity: -40,
    });
    this.burst(x, y, {
      count: 10, colors: ["#b7a7d9", "#8e82b3"], speed: [30, 90],
      angle: [-Math.PI * 0.15, Math.PI * 0.15], life: [0.25, 0.45], size: [2, 4], gravity: -40,
    });
    this.ring(x, y, "#d9ccff");
  }

  // Dust when landing - bigger for harder landings
  landDust(x, y, fallSpeed) {
    const amount = Math.min(16, Math.round(fallSpeed * 1.2));
    if (amount < 3) {
      return;
    }
    this.burst(x, y, {
      count: amount, colors: ["#b7a7d9", "#8e82b3", "#6f6696"], speed: [20, 40 + fallSpeed * 6],
      angle: [Math.PI * 1.05, Math.PI * 1.95], life: [0.2, 0.4], size: [2, 3.5], gravity: 200,
    });
  }

  // A little dust behind the feet while running
  runDust(x, y, facing) {
    const backwards = facing === 1 ? Math.PI : 0; // Kick dust away from the direction we run
    this.burst(x, y, {
      count: 2, colors: ["#8e82b3", "#6f6696"], speed: [20, 50],
      angle: [backwards - 0.5, backwards + 0.1], life: [0.2, 0.35], size: [1.5, 3], gravity: -20,
    });
  }

  // Gold sparkles and "+10" when a coin is collected
  coinSparkle(x, y, points) {
    this.burst(x, y, {
      count: 14, colors: ["#ffd166", "#fff3c4", "#ffb703"], speed: [60, 160],
      angle: [0, Math.PI * 2], life: [0.3, 0.6], size: [1.5, 3], gravity: 120, shape: "spark",
    });
    this.ring(x, y, "#ffd166");
    this.floatingText(x, y - 10, "+" + points, "#ffd166");
  }

  // Sparks and a shake when the player gets hit
  hit(x, y) {
    this.burst(x, y, {
      count: 18, colors: ["#ffffff", "#ff4757", "#ff8a94"], speed: [100, 260],
      angle: [0, Math.PI * 2], life: [0.2, 0.45], size: [1.5, 3], gravity: 300, shape: "spark",
    });
    this.ring(x, y, "#ff8a94");
    this.shake(6, 0.25);
  }

  // The ninja bursts into pieces at game over
  death(x, y) {
    this.burst(x, y, {
      count: 60, colors: ["#ff4757", "#d63447", "#1a1d27", "#ff8a94"], speed: [80, 320],
      angle: [0, Math.PI * 2], life: [0.7, 1.3], size: [3, 6], gravity: 420, shape: "square",
    });
    this.burst(x, y, {
      count: 25, colors: ["#ffffff", "#fff3c4"], speed: [40, 200],
      angle: [0, Math.PI * 2], life: [0.4, 0.9], size: [1, 2.5], gravity: -30, shape: "spark",
    });
    this.ring(x, y, "#ffffff");
    this.shake(12, 0.6);
  }

  // An expanding circle outline
  ring(x, y, color) {
    if (this.particles.length >= MAX_PARTICLES) {
      return;
    }
    this.particles.push({
      x: x, y: y, velocityX: 0, velocityY: 0, gravity: 0,
      life: 0.35, maxLife: 0.35, size: 26, color: color, shape: "ring",
    });
  }

  floatingText(x, y, text, color) {
    this.texts.push({ x: x, y: y, text: text, color: color, life: 0.8, maxLife: 0.8 });
  }

  shake(strength, duration) {
    // A new, stronger shake replaces a weaker one
    if (strength >= this.shakeStrength || this.shakeTime <= 0) {
      this.shakeStrength = strength;
      this.shakeDuration = duration;
      this.shakeTime = duration;
    }
  }

  // ----- Move everything forward in time -----
  update(deltaSeconds) {
    // Loop backwards so removing dead particles is safe
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life = p.life - deltaSeconds;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.velocityY = p.velocityY + p.gravity * deltaSeconds;
      p.x = p.x + p.velocityX * deltaSeconds;
      p.y = p.y + p.velocityY * deltaSeconds;
    }

    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i];
      t.life = t.life - deltaSeconds;
      t.y = t.y - 40 * deltaSeconds; // Float upward
      if (t.life <= 0) {
        this.texts.splice(i, 1);
      }
    }

    if (this.shakeTime > 0) {
      this.shakeTime = this.shakeTime - deltaSeconds;
    }
  }

  // ----- Screen shake -----
  // Returns how far to move the whole scene this frame (fades out over time)
  getShakeOffset() {
    if (this.shakeTime <= 0) {
      return { x: 0, y: 0 };
    }
    const strength = this.shakeStrength * (this.shakeTime / this.shakeDuration);
    return {
      x: randomBetween(-strength, strength),
      y: randomBetween(-strength, strength),
    };
  }

  // ----- Draw -----
  draw(ctx) {
    for (const p of this.particles) {
      const lifeLeft = p.life / p.maxLife; // 1 = just born, 0 = about to vanish
      ctx.globalAlpha = lifeLeft;

      if (p.shape === "ring") {
        // Grows from small to big while fading
        const radius = p.size * (1 - lifeLeft) + 4;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2 * lifeLeft + 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.shape === "spark") {
        // A short line pointing the way it flies
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * 0.7;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.velocityX * 0.03, p.y - p.velocityY * 0.03);
        ctx.stroke();
      } else if (p.shape === "square") {
        ctx.fillStyle = p.color;
        const size = p.size * (0.5 + 0.5 * lifeLeft);
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.4 + 0.6 * lifeLeft), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.font = "800 17px Segoe UI, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#2a1a05";
    for (const t of this.texts) {
      ctx.globalAlpha = Math.min(1, (t.life / t.maxLife) * 2);
      ctx.strokeText(t.text, t.x, t.y); // Dark outline so it reads on any background
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
    }

    ctx.globalAlpha = 1;
  }
}
