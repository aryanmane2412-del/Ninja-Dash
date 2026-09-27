// ===== Ninja Dash - Player =====
// The Player class describes our ninja: where it is, how big it is,
// how it moves, jumps, falls and lands on platforms, its health,
// and how to animate and draw it.

// ----- Animation poses -----
// Each frame is a pose: small pixel offsets for the ninja's body parts.
// All poses are drawn facing RIGHT; facing left is done by mirroring.
//   bob         = move head + body down (+) or up (-)
//   frontFoot   = front foot forward (+) or back (-)
//   backFoot    = back foot forward (+) or back (-)
//   frontLift   = raise the front foot off the ground
//   backLift    = raise the back foot off the ground
//   frontHand   = swing the front arm forward (+) or back (-)
//   backHand    = swing the back arm forward (+) or back (-)
//   handsUp     = raise both arms
const POSE_DEFAULTS = { bob: 0, frontFoot: 0, backFoot: 0, frontLift: 0, backLift: 0, frontHand: 0, backHand: 0, handsUp: 0 };

function pose(changes) {
  // Start from the defaults and change only what this pose needs
  return Object.assign({}, POSE_DEFAULTS, changes);
}

const PLAYER_POSES = {
  // Idle: slow breathing, 2 frames
  idle: [
    pose({}),
    pose({ bob: 1, handsUp: -1 }),
  ],
  // Run: 4 frames - legs apart, legs passing, legs apart the other way, passing
  run: [
    pose({ frontFoot: 7, backFoot: -7, backLift: 2, frontHand: -5, backHand: 5 }),
    pose({ bob: -2, frontFoot: 1, backFoot: -1, backLift: 7 }),
    pose({ frontFoot: -7, backFoot: 7, frontLift: 2, frontHand: 5, backHand: -5 }),
    pose({ bob: -2, frontFoot: -1, backFoot: 1, frontLift: 7 }),
  ],
  // Jump: knees tucked, arms up - 1 frame
  jump: [
    pose({ bob: -1, frontFoot: 4, backFoot: -3, frontLift: 9, backLift: 5, frontHand: 3, backHand: -3, handsUp: 6 }),
  ],
  // Fall: legs stretched down, arms out for balance - 1 frame
  fall: [
    pose({ frontFoot: 5, backFoot: -5, backLift: 1, frontHand: 7, backHand: -7, handsUp: 10 }),
  ],
  // Hurt: knocked back - 1 frame
  hurt: [
    pose({ bob: 2, frontFoot: -4, backFoot: -7, frontLift: 3, frontHand: -7, backHand: -9, handsUp: 4 }),
  ],
};

const HURT_POSE_DURATION = 0.35; // Seconds the hurt pose shows after a hit
const HURT_FLASH_DURATION = 0.1; // Seconds the ninja flashes white after a hit
const SQUASH_DURATION = 0.14;    // Seconds a squash or stretch lasts

class Player {
  // The constructor runs once when we write "new Player(...)"
  constructor(startX, groundY) {
    // Remember where the player should start
    this.startX = startX;
    this.groundY = groundY; // The y position of the top of the ground

    // Size of the player, in pixels
    this.width = 40;
    this.height = 60;

    // Movement speed: how many pixels the player moves each frame
    this.speed = 5;

    // ----- Physics settings -----
    this.gravity = 0.6;       // How much the downward speed grows each frame
    this.jumpStrength = 13;   // How fast the player shoots upward when jumping

    // ----- Health settings -----
    this.maxHealth = 3;
    this.invincibleDuration = 90; // Frames of safety after a hit (90 frames ≈ 1.5 seconds)

    // Colors
    this.colors = {
      suit: "#ff4757",      // Head and body
      suitShade: "#c9303f", // Darker side of the body
      limbs: "#d63447",     // Arms and legs
      mask: "#1a1d27",      // Eye band, belt, shoes
      tails: "#ff8a94",     // Headband tails (lighter, so they show on the dark sky)
      eyes: "#ffffff",
      pupils: "#1a1d27",
      sword: "#9aa0b0",     // Katana handle on the back
    };
    this.flashColors = {
      suit: "#ffffff", suitShade: "#ffe0e3", limbs: "#ffffff", mask: "#ffb3ba",
      tails: "#ffffff", eyes: "#ff4757", pupils: "#ff4757", sword: "#ffffff",
    };

    // ----- Animations -----
    // One Animation per movement type. Only one plays at a time.
    this.animations = {
      idle: new Animation(PLAYER_POSES.idle, 0.5),  // Slow: 0.5s per frame
      run: new Animation(PLAYER_POSES.run, 0.09),   // Fast: 0.09s per frame
      jump: new Animation(PLAYER_POSES.jump, 1),
      fall: new Animation(PLAYER_POSES.fall, 1),
      hurt: new Animation(PLAYER_POSES.hurt, 1),
    };
    this.currentAnimation = "idle";
    this.facing = 1;       // 1 = facing right, -1 = facing left
    this.hurtTimer = 0;    // Seconds left to show the hurt pose
    this.tailTime = 0;     // Keeps the headband tails waving
    this.lastX = 0;        // Used to see if we moved this frame
    this.lastHealth = 0;   // Used to see if we just got hurt

    // Squash & stretch: the ninja stretches tall when jumping and
    // squashes flat when landing, for a moment. Looks only.
    this.squashTimer = 0;
    this.squashAmount = 0;     // + = stretch tall, - = squash flat
    this.lastOnGround = true;

    // Position and physics state (set properly by reset)
    this.x = 0;
    this.y = 0;
    this.velocityY = 0;       // Vertical speed: negative = going up, positive = falling
    this.isOnGround = true;
    this.health = 0;          // Set properly by reset
    this.invincibleTimer = 0; // Counts down each frame. Above 0 = can't be hurt
    this.reset();
  }

  // Put the player back at the start: on the ground, full health
  reset() {
    this.x = this.startX;
    // Canvas y grows downward, so we subtract the height
    // to place the player's feet exactly on top of the ground
    this.y = this.groundY - this.height;
    this.velocityY = 0;
    this.isOnGround = true;
    this.health = this.maxHealth;
    this.invincibleTimer = 0;

    // Animation back to standing still, facing right
    this.facing = 1;
    this.hurtTimer = 0;
    this.lastX = this.x;
    this.lastHealth = this.health;
    this.setAnimation("idle");
    this.squashTimer = 0;
    this.lastOnGround = true;
  }

  // ----- Health -----

  // Is the player still in the safe period after a hit?
  isInvincible() {
    return this.invincibleTimer > 0;
  }

  // Try to hurt the player. Returns true if damage was taken.
  takeDamage() {
    // Still invincible from the last hit? Ignore this one.
    if (this.isInvincible()) {
      return false;
    }

    this.health = this.health - 1;
    this.invincibleTimer = this.invincibleDuration; // Start the safe period
    return true;
  }

  // Runs every frame: move, jump, fall and land
  update(input, canvasWidth, platforms) {
    // Count down the invincibility timer
    if (this.invincibleTimer > 0) {
      this.invincibleTimer = this.invincibleTimer - 1;
    }

    this.moveHorizontally(input, canvasWidth);
    this.handleJump(input);

    // Remember where the feet were BEFORE falling this frame
    const previousFeetY = this.y + this.height;

    this.applyGravity();
    this.checkPlatforms(platforms, previousFeetY);
  }

  // Left / right movement
  moveHorizontally(input, canvasWidth) {
    if (input.isMoveLeftPressed()) {
      this.x = this.x - this.speed;
    }
    if (input.isMoveRightPressed()) {
      this.x = this.x + this.speed;
    }

    // Keep the player inside the canvas
    if (this.x < 0) {
      this.x = 0; // Left edge
    }
    if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width; // Right edge
    }
  }

  // Start a jump, but only when standing on the ground
  handleJump(input) {
    if (input.isJumpPressed() && this.isOnGround) {
      this.velocityY = -this.jumpStrength; // Negative = upward
      this.isOnGround = false;
    }
  }

  // Gravity pulls the player down a little more every frame
  applyGravity() {
    this.velocityY = this.velocityY + this.gravity; // Speed changes
    this.y = this.y + this.velocityY;               // Position changes
  }

  // Land on a platform if we are falling onto one
  checkPlatforms(platforms, previousFeetY) {
    // Assume we are in the air until we find a platform under our feet.
    // This is what makes the player fall after walking off an edge.
    this.isOnGround = false;

    // Going up? Then we can't land - we pass through platforms from below.
    if (this.velocityY < 0) {
      return;
    }

    for (const platform of platforms) {
      const isTouching = isRectangleColliding(this, platform);
      const wasAbove = previousFeetY <= platform.y; // Feet were on/above its top last frame

      if (isTouching && wasAbove) {
        this.y = platform.y - this.height; // Put feet exactly on top
        this.velocityY = 0;                // Stop falling
        this.isOnGround = true;            // Allowed to jump again
        return;
      }
    }
  }

  // ----- Animation -----
  // This only WATCHES what the movement code did and picks an animation.
  // It never changes position, speed or health, so gameplay is unchanged.

  // Switch to another animation. Start it from frame 0 if it's a new one.
  setAnimation(name) {
    if (name !== this.currentAnimation) {
      this.currentAnimation = name;
      this.animations[name].reset();
    }
  }

  // Runs every frame after update()
  updateAnimation(deltaSeconds) {
    // Did we move left or right this frame? (Standing against a wall = not moving)
    const movedX = this.x - this.lastX;
    this.lastX = this.x;
    if (movedX > 0) {
      this.facing = 1;
    } else if (movedX < 0) {
      this.facing = -1;
    }

    // Did we just lose health? Start the hurt pose.
    if (this.health < this.lastHealth) {
      this.hurtTimer = HURT_POSE_DURATION;
    }
    this.lastHealth = this.health;
    if (this.hurtTimer > 0) {
      this.hurtTimer = this.hurtTimer - deltaSeconds;
    }

    // Pick the animation. Order matters: the first match wins.
    if (this.hurtTimer > 0) {
      this.setAnimation("hurt");
    } else if (!this.isOnGround && this.velocityY < 0) {
      this.setAnimation("jump");  // In the air, going up
    } else if (!this.isOnGround) {
      this.setAnimation("fall");  // In the air, coming down
    } else if (movedX !== 0) {
      this.setAnimation("run");
    } else {
      this.setAnimation("idle");
    }

    // Move the current animation's timer forward
    this.animations[this.currentAnimation].update(deltaSeconds);
    this.tailTime = this.tailTime + deltaSeconds;

    // Squash & stretch when leaving or touching the ground
    if (this.lastOnGround && !this.isOnGround && this.velocityY < 0) {
      this.startSquash(0.18);   // Jump: stretch
    } else if (!this.lastOnGround && this.isOnGround) {
      this.startSquash(-0.22);  // Land: squash
    }
    this.lastOnGround = this.isOnGround;
    if (this.squashTimer > 0) {
      this.squashTimer = this.squashTimer - deltaSeconds;
    }
  }

  startSquash(amount) {
    this.squashAmount = amount;
    this.squashTimer = SQUASH_DURATION;
  }

  // Draw the player on the canvas
  draw(ctx) {
    // Damage effect: while invincible, blink by skipping drawing
    // for 5 frames, then drawing for 5 frames, and so on
    if (this.isInvincible() && Math.floor(this.invincibleTimer / 5) % 2 === 0) {
      return;
    }

    const p = this.animations[this.currentAnimation].getFrame(); // Current pose
    const isFlashing = this.hurtTimer > HURT_POSE_DURATION - HURT_FLASH_DURATION;
    const c = isFlashing ? this.flashColors : this.colors;
    const isHurt = this.currentAnimation === "hurt";

    const centerX = this.x + this.width / 2;
    const feetY = this.y + this.height;

    ctx.save();

    // Squash & stretch around the feet (fades out over SQUASH_DURATION)
    if (this.squashTimer > 0) {
      const amount = this.squashAmount * (this.squashTimer / SQUASH_DURATION);
      ctx.translate(centerX, feetY);
      ctx.scale(1 - amount * 0.6, 1 + amount);
      ctx.translate(-centerX, -feetY);
    }

    // Everything below is drawn facing right. To face left we mirror the
    // canvas around the ninja's center line, draw, then undo the mirror.
    ctx.translate(centerX, 0);
    ctx.scale(this.facing, 1);
    ctx.translate(-centerX, 0);

    const top = this.y + p.bob; // Top of head, moved by the pose

    // Headband tails flutter behind the head. They wave faster while running.
    const waveSpeed = this.currentAnimation === "run" ? 18 : 5;
    const wave = Math.sin(this.tailTime * waveSpeed) * 3;
    ctx.strokeStyle = c.tails;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(centerX - 10, top + 11);
    ctx.quadraticCurveTo(centerX - 17, top + 8 + wave, centerX - 23, top + 9 + wave * 1.4);
    ctx.moveTo(centerX - 10, top + 13);
    ctx.quadraticCurveTo(centerX - 16, top + 15 + wave * 0.6, centerX - 21, top + 18 + wave);
    ctx.stroke();

    // Katana on the back (handle sticks up behind the shoulder)
    ctx.strokeStyle = c.sword;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 12, top + 20);
    ctx.lineTo(centerX - 4, top + 36);
    ctx.stroke();
    ctx.fillStyle = c.mask;
    ctx.fillRect(centerX - 14, top + 18, 5, 3); // Handle guard

    // Back arm and back leg first, so the body covers them
    this.drawArm(ctx, c.suitShade, centerX - 6 + p.backHand, top + 25 - p.handsUp);
    this.drawLeg(ctx, c, c.suitShade, centerX - 8, top + 42, p.backFoot, feetY - p.backLift);

    // Body: lighter front, darker back for a rounded look
    fillRoundedRect(ctx, centerX - 10, top + 21, 20, 23, 5, c.suitShade);
    fillRoundedRect(ctx, centerX - 7, top + 21, 17, 23, 5, c.suit);
    ctx.fillStyle = c.mask;
    ctx.fillRect(centerX - 10, top + 36, 20, 4); // Belt
    ctx.fillStyle = c.tails;
    ctx.fillRect(centerX + 3, top + 36, 3, 4);   // Belt knot

    // Head
    fillRoundedRect(ctx, centerX - 12, top, 24, 23, 8, c.suit);
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.fillRect(centerX - 7, top + 2, 10, 3); // Shine on top of the head

    // Eye band
    ctx.fillStyle = c.mask;
    ctx.fillRect(centerX - 12, top + 8, 24, 8);

    // Eyes on the side we're facing. Squinting lines when hurt.
    ctx.fillStyle = c.eyes;
    if (isHurt) {
      ctx.fillRect(centerX + 1, top + 11, 5, 2);
      ctx.fillRect(centerX + 7, top + 11, 4, 2);
    } else {
      ctx.fillRect(centerX + 1, top + 10, 5, 4);
      ctx.fillRect(centerX + 7, top + 10, 4, 4);
      // Pupils look forward
      ctx.fillStyle = c.pupils;
      ctx.fillRect(centerX + 4, top + 11, 2, 2);
      ctx.fillRect(centerX + 9, top + 11, 2, 2);
    }

    // Front leg and front arm last, so they're in front of the body
    this.drawLeg(ctx, c, c.limbs, centerX + 1, top + 42, p.frontFoot, feetY - p.frontLift);
    this.drawArm(ctx, c.limbs, centerX + 1 + p.frontHand, top + 25 - p.handsUp);

    ctx.restore(); // Undo the squash and the mirroring
  }

  // A leg is a slanted shape from the hip down to the foot, plus a shoe
  drawLeg(ctx, c, legColor, hipX, hipY, footOffset, footY) {
    const legWidth = 7;
    const footX = hipX + footOffset;

    ctx.fillStyle = legColor;
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(hipX + legWidth, hipY);
    ctx.lineTo(footX + legWidth, footY - 3);
    ctx.lineTo(footX, footY - 3);
    ctx.closePath();
    ctx.fill();

    fillRoundedRect(ctx, footX - 1, footY - 4, legWidth + 4, 4, 2, c.mask); // Shoe
  }

  // An arm with a round fist at the end
  drawArm(ctx, color, x, y) {
    fillRoundedRect(ctx, x, y, 6, 12, 3, color);
    ctx.beginPath();
    ctx.arc(x + 3, y + 12, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
