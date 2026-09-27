// ===== Ninja Dash - Enemies =====
// Two kinds of enemy:
//  - Patrollers walk back and forth between two points.
//  - Walkers (patrolLeft = null) walk straight across the screen and leave.

// ----- Walk animation: 2 frames -----
//   bodyLift  = raise the body (bounce)
//   frontFoot / backFoot = slide each foot forward (+) or back (-)
const ENEMY_WALK_FRAMES = [
  { bodyLift: 0, frontFoot: 3, backFoot: -3 },
  { bodyLift: 2, frontFoot: -3, backFoot: 3 },
];

// ----- Color sets -----
const ENEMY_COLORS = {
  patroller: { body: "#8e44ad", light: "#a864c4", belly: "#b98bd0", feet: "#5e2d73", horn: "#e8d5f5", dark: "#1a1026" },
  walker:    { body: "#e67e22", light: "#f39c4a", belly: "#f7c08a", feet: "#a84f0f", horn: "#fff1dc", dark: "#2a1405" },
};

class Enemy {
  // x, y        = starting position (top-left corner)
  // speed       = pixels moved each frame at difficulty level 1
  // patrolLeft  = the furthest left the enemy walks (null = no patrol)
  // patrolRight = the furthest right the enemy walks (null = no patrol)
  constructor(x, y, speed, patrolLeft, patrolRight) {
    this.x = x;
    this.y = y;
    this.width = 36;
    this.height = 30;

    this.baseSpeed = speed; // Never changes
    this.speed = speed;     // baseSpeed x difficulty multiplier
    this.direction = 1;     // 1 = moving right, -1 = moving left

    this.patrolLeft = patrolLeft;
    this.patrolRight = patrolRight;
    this.isPatrolling = patrolLeft !== null;

    // Colors: purple for patrollers, orange for walkers
    this.colors = this.isPatrolling ? ENEMY_COLORS.patroller : ENEMY_COLORS.walker;

    // Blinking: counts down to the next blink
    this.blinkTimer = randomBetween(1, 4);

    // Walk animation. Each enemy starts at a slightly different time
    // (based on x) so they don't all step in sync.
    this.walkAnimation = new Animation(ENEMY_WALK_FRAMES, 0.2);
    this.walkAnimation.timer = x * 0.003;
  }

  // Faster enemies take quicker steps: frame time = 0.5 / speed
  // speed 1 → 0.5s per step, speed 2 → 0.25s, speed 4 → 0.125s
  updateAnimation(deltaSeconds) {
    const stepTime = 0.5 / this.speed;
    this.walkAnimation.frameDuration = Math.min(Math.max(stepTime, 0.08), 0.4);
    this.walkAnimation.update(deltaSeconds);

    // Blink for 0.12s every 2-5 seconds
    this.blinkTimer = this.blinkTimer - deltaSeconds;
    if (this.blinkTimer < -0.12) {
      this.blinkTimer = randomBetween(2, 5);
    }
  }

  // Difficulty makes enemies faster: 1 = normal, 1.5 = 50% faster
  setSpeedMultiplier(multiplier) {
    this.speed = this.baseSpeed * multiplier;
  }

  // Has a walker left the screen completely?
  isOffScreen(canvasWidth) {
    return this.x + this.width < 0 || this.x > canvasWidth;
  }

  // Move, and turn around at the ends of the patrol
  update() {
    this.x = this.x + this.speed * this.direction;

    // Walkers never turn around
    if (!this.isPatrolling) {
      return;
    }

    // Reached the right end? Stop there and turn left
    if (this.x + this.width >= this.patrolRight) {
      this.x = this.patrolRight - this.width;
      this.direction = -1;
    }

    // Reached the left end? Stop there and turn right
    if (this.x <= this.patrolLeft) {
      this.x = this.patrolLeft;
      this.direction = 1;
    }
  }

  // Draw a round horned monster that bounces and steps as it walks
  draw(ctx) {
    const c = this.colors;
    const frame = this.walkAnimation.getFrame();
    const bodyTop = this.y + 3 - frame.bodyLift; // Body bounces up and down
    const bodyHeight = 23;                       // Leaves room for feet below
    const feetY = this.y + this.height - 5;      // Feet always touch the ground
    const dir = this.direction;

    // Feet (drawn first, the body overlaps them a little).
    // "Front" is the side the enemy is walking toward.
    const frontFootX = dir === 1 ? this.x + 21 : this.x + 5;
    const backFootX = dir === 1 ? this.x + 5 : this.x + 21;
    fillRoundedRect(ctx, frontFootX + frame.frontFoot * dir, feetY, 10, 5, 2.5, c.feet);
    fillRoundedRect(ctx, backFootX + frame.backFoot * dir, feetY, 10, 5, 2.5, c.feet);

    // Horns
    ctx.fillStyle = c.horn;
    ctx.beginPath();
    if (this.isPatrolling) {
      // Two curved horns
      ctx.moveTo(this.x + 6, bodyTop + 4);
      ctx.quadraticCurveTo(this.x + 2, bodyTop - 6, this.x + 7, bodyTop - 10);
      ctx.lineTo(this.x + 13, bodyTop + 2);
      ctx.moveTo(this.x + 30, bodyTop + 4);
      ctx.quadraticCurveTo(this.x + 34, bodyTop - 6, this.x + 29, bodyTop - 10);
      ctx.lineTo(this.x + 23, bodyTop + 2);
    } else {
      // Row of spikes along the back
      for (let i = 0; i < 4; i++) {
        const spikeX = this.x + 5 + i * 8;
        ctx.moveTo(spikeX, bodyTop + 3);
        ctx.lineTo(spikeX + 4, bodyTop - 7 + (i % 2) * 3);
        ctx.lineTo(spikeX + 8, bodyTop + 3);
      }
    }
    ctx.fill();

    // Body with a lighter top and belly
    fillRoundedRect(ctx, this.x, bodyTop, this.width, bodyHeight, 10, c.body);
    fillRoundedRect(ctx, this.x + 3, bodyTop + 2, this.width - 6, 7, 4, c.light);
    ctx.fillStyle = c.belly;
    ctx.beginPath();
    ctx.ellipse(this.x + 18, bodyTop + 18, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (closed for a moment when blinking)
    const eyeY = bodyTop + 8;
    if (this.blinkTimer < 0) {
      ctx.fillStyle = c.dark;
      ctx.fillRect(this.x + 7, eyeY + 4, 8, 2);
      ctx.fillRect(this.x + 21, eyeY + 4, 8, 2);
    } else {
      ctx.fillStyle = "#ffffff";
      fillRoundedRect(ctx, this.x + 7, eyeY, 8, 9, 3, "#ffffff");
      fillRoundedRect(ctx, this.x + 21, eyeY, 8, 9, 3, "#ffffff");
      // Pupils look where the enemy is walking
      const pupilShift = dir === 1 ? 4 : 0;
      ctx.fillStyle = c.dark;
      ctx.fillRect(this.x + 7 + pupilShift, eyeY + 3, 4, 5);
      ctx.fillRect(this.x + 21 + pupilShift, eyeY + 3, 4, 5);
    }

    // Angry eyebrows
    ctx.strokeStyle = c.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x + 6, eyeY - 3);
    ctx.lineTo(this.x + 15, eyeY);
    ctx.moveTo(this.x + 30, eyeY - 3);
    ctx.lineTo(this.x + 21, eyeY);
    ctx.stroke();

    // Two little fangs
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(this.x + 13, bodyTop + 18);
    ctx.lineTo(this.x + 15, bodyTop + 22);
    ctx.lineTo(this.x + 17, bodyTop + 18);
    ctx.moveTo(this.x + 19, bodyTop + 18);
    ctx.lineTo(this.x + 21, bodyTop + 22);
    ctx.lineTo(this.x + 23, bodyTop + 18);
    ctx.fill();
  }
}
