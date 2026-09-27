// ===== Ninja Dash - Player =====
// The Player class describes our ninja: where it is, how big it is,
// how it moves, jumps and falls, and how to draw it.

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

    // Colors
    this.bodyColor = "#ff4757";
    this.headbandColor = "#1a1d27";

    // Position and physics state (set properly by reset)
    this.x = 0;
    this.y = 0;
    this.velocityY = 0;       // Vertical speed: negative = going up, positive = falling
    this.isOnGround = true;
    this.reset();
  }

  // Put the player back at the starting position, standing still on the ground
  reset() {
    this.x = this.startX;
    // Canvas y grows downward, so we subtract the height
    // to place the player's feet exactly on top of the ground
    this.y = this.groundY - this.height;
    this.velocityY = 0;
    this.isOnGround = true;
  }

  // Runs every frame: move, jump, fall and land
  update(input, canvasWidth) {
    this.moveHorizontally(input, canvasWidth);
    this.handleJump(input);
    this.applyGravity();
    this.checkGround();
  }

  // Left / right movement (from Stage 4)
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

  // Stop the player from falling through the ground
  checkGround() {
    const feetY = this.y + this.height; // Bottom of the player

    if (feetY >= this.groundY) {
      this.y = this.groundY - this.height; // Put feet exactly on the ground
      this.velocityY = 0;                  // Stop falling
      this.isOnGround = true;
    }
  }

  // Draw the player on the canvas
  draw(ctx) {
    // Body
    ctx.fillStyle = this.bodyColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Ninja headband near the top of the body
    ctx.fillStyle = this.headbandColor;
    ctx.fillRect(this.x, this.y + 10, this.width, 8);
  }
}
