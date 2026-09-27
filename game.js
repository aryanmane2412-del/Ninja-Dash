// ===== Ninja Dash - Main game =====
// This file sets up the game, runs the game loop and handles
// moving between states (menu, playing, paused, game over).
// Gameplay is drawn on the canvas; the HUD and menus are HTML.

// ----- Get the HTML elements we need -----
const gameCanvas = document.getElementById("game-canvas");

// The "2d" context is the tool we use to draw on the canvas
const ctx = gameCanvas.getContext("2d");

// Make the canvas's real pixel size match the screen, so graphics are sharp.
// The game still thinks in 800 x 450 "game pixels" (GAME_WIDTH x GAME_HEIGHT);
// draw() scales everything up by RENDER_SCALE.
gameCanvas.width = GAME_WIDTH * RENDER_SCALE;
gameCanvas.height = GAME_HEIGHT * RENDER_SCALE;

// ----- Game settings -----
const GROUND_HEIGHT = 60; // How tall the ground is, in pixels

const PLAYER_START_X = 100; // How far from the left edge the player starts

const DAMAGE_FLASH_DURATION = 12; // Frames the red screen flash lasts
const COIN_POINTS = 10;           // Score for each coin collected

const WALKER_SPEED = 2.5;             // Speed of spawned enemies at level 1
const LEVEL_UP_MESSAGE_DURATION = 2;  // Seconds the "Difficulty 2!" message shows

const RUN_DUST_INTERVAL = 0.12;       // Seconds between dust puffs while running

// ----- Game data -----
// (Which state the game is in lives in gameState.js)
let damageFlashTimer = 0;   // Above 0 = show the red damage flash
let score = 0;

// ----- Time and difficulty -----
let lastTimestamp = null;      // Time of the previous frame (from requestAnimationFrame)
const difficulty = new Difficulty();
let spawnTimer = 0;            // Seconds since the last enemy was spawned
let levelUpMessageTimer = 0;   // Above 0 = show the level-up message

// ----- Visuals (looks only - never change gameplay) -----
const background = new Background();
const effects = new Effects();
let runDustTimer = 0;
let gameOverTime = 0;          // Seconds since game over, for the fade effect
let damageVignette = null;     // Cached red edge glow, made the first time it's needed

// ----- Create the player -----
// The top of the ground is the canvas height minus the ground height
const groundY = GAME_HEIGHT - GROUND_HEIGHT;
const player = new Player(PLAYER_START_X, groundY);

// ----- Create the platforms -----
// new Platform(x, y, width, height)
// The player can jump about 130px high, so each platform is within reach.
const platforms = [
  new Platform(0, groundY, GAME_WIDTH, GROUND_HEIGHT), // The ground
  new Platform(220, 300, 140, 20), // Low platform
  new Platform(430, 220, 130, 20), // Middle platform
  new Platform(620, 150, 140, 20), // High platform (right)
  new Platform(40, 200, 110, 20),  // High platform (left)
];

// ----- Create the enemies -----
// new Enemy(x, y, speed, patrolLeft, patrolRight)
// Enemies are 30px tall, so y = platform top - 30 puts them on the platform.
// This is a function so resetGame() can remove spawned enemies for a new game.
function createEnemies() {
  return [
    new Enemy(400, groundY - 30, 2, 300, GAME_WIDTH),       // Walks the right half of the ground
    new Enemy(450, 220 - 30, 1, 430, 560),                  // Patrols the middle platform
    new Enemy(700, 150 - 30, 1.5, 620, 760),                // Patrols the high right platform
  ];
}

let enemies = createEnemies();

// Create a walker that enters from a random side and crosses the ground
function spawnWalker() {
  const enemy = new Enemy(0, groundY - 30, WALKER_SPEED, null, null); // Orange (see enemy.js)

  if (Math.random() < 0.5) {
    enemy.x = -enemy.width;      // Just off the left edge
    enemy.direction = 1;         // Walk right
  } else {
    enemy.x = GAME_WIDTH;        // Just off the right edge
    enemy.direction = -1;        // Walk left
  }

  // New enemies move at the current difficulty's speed
  enemy.setSpeedMultiplier(difficulty.getSpeedMultiplier());
  enemies.push(enemy);
}

// ----- Create the coins -----
// Each coin is placed 50px above a platform top, at the ninja's chest height.
// This is a function so resetGame() can rebuild all coins for a new game.
function createCoins() {
  return [
    // On the ground (top = 390)
    new Coin(160, 340), new Coin(240, 340), new Coin(450, 340),
    new Coin(600, 340), new Coin(740, 340),
    // Low platform (top = 300)
    new Coin(250, 250), new Coin(320, 250),
    // Middle platform (top = 220)
    new Coin(465, 170), new Coin(520, 170),
    // High right platform (top = 150)
    new Coin(660, 100), new Coin(720, 100),
    // High left platform (top = 200)
    new Coin(60, 150), new Coin(115, 150),
    // In the air between the low and middle platforms - grab it mid-jump!
    new Coin(395, 190),
  ];
}

let coins = createCoins();

// ===== State changes =====
// Every button and key that changes the state calls one of these functions.

// MENU or GAME_OVER or PAUSED  →  PLAYING (fresh game)
function startNewGame() {
  resetGame();
  setGameState(GAME_STATES.PLAYING);
  startMusic(true); // Song from the beginning
}

// PLAYING  →  PAUSED
function pauseGame() {
  if (isGameState(GAME_STATES.PLAYING)) {
    setGameState(GAME_STATES.PAUSED);
    pauseMusic();
  }
}

// PAUSED  →  PLAYING (carry on where we left off)
function resumeGame() {
  if (isGameState(GAME_STATES.PAUSED)) {
    setGameState(GAME_STATES.PLAYING);
    startMusic(false); // Carry on from where the song was paused
  }
}

// P / Esc switch between playing and paused
function togglePause() {
  if (isGameState(GAME_STATES.PLAYING)) {
    pauseGame();
  } else if (isGameState(GAME_STATES.PAUSED)) {
    resumeGame();
  }
}

// PLAYING  →  GAME_OVER
function endGame() {
  damageFlashTimer = 0; // Don't leave the red flash frozen behind the screen

  // The ninja bursts into pieces
  effects.death(player.x + player.width / 2, player.y + player.height / 2);
  gameOverTime = 0;

  // Save the score if it beats the high score
  const isNewRecord = submitScore(score);
  showFinalStats(score, difficulty.elapsedSeconds, difficulty.level, getHighScore(), isNewRecord);
  hideLevelUpMessage();
  setGameState(GAME_STATES.GAME_OVER);
  stopMusic();
  playSound("gameOver");
}

// PAUSED or GAME_OVER  →  MENU
function goToMainMenu() {
  hideLevelUpMessage();
  showMenuHighScore(getHighScore()); // May have changed during the last game
  setGameState(GAME_STATES.MENU);
  stopMusic();
}

// ----- Reset everything for a new game -----
function resetGame() {
  // Player back at the start with full health
  player.reset();
  damageFlashTimer = 0;
  score = 0;
  coins = createCoins();

  // Back to difficulty level 1 with only the starting enemies
  difficulty.reset();
  enemies = createEnemies();
  spawnTimer = 0;
  levelUpMessageTimer = 0;

  // No leftover particles from the last game
  effects.clear();

  // Fresh HUD
  resetHUD(player.maxHealth);
  hideLevelUpMessage();
}

// ----- Update: change the game's data (no drawing here) -----
// deltaSeconds = real time since the last frame (about 0.016 at 60 FPS)
function update(deltaSeconds) {
  // Only move the game forward while PLAYING.
  // In MENU, PAUSED and GAME_OVER everything stays frozen.
  if (!isGameState(GAME_STATES.PLAYING)) {
    return;
  }

  // Count down the red damage flash
  if (damageFlashTimer > 0) {
    damageFlashTimer--;
  }

  // Make the game harder over time, and spawn new enemies
  updateDifficulty(deltaSeconds);
  updateSpawning(deltaSeconds);

  // Let the player move based on keyboard input, and land on platforms
  const wasOnGround = player.isOnGround;
  const fallSpeedBefore = player.velocityY; // For the landing dust
  const xBefore = player.x;                 // For the running dust
  player.update(input, GAME_WIDTH, platforms);

  const feetX = player.x + player.width / 2;
  const feetY = player.y + player.height;

  // Just left the ground while moving UP = a jump (walking off an edge moves down)
  if (wasOnGround && player.velocityY < 0) {
    playSound("jump");
    effects.jumpDust(feetX, feetY);
  }

  // Just landed: puff of dust (bigger for harder landings)
  if (!wasOnGround && player.isOnGround) {
    effects.landDust(feetX, feetY, fallSpeedBefore);
  }

  // Running on the ground: small puffs behind the feet
  if (player.isOnGround && player.x !== xBefore) {
    runDustTimer = runDustTimer - deltaSeconds;
    if (runDustTimer <= 0) {
      effects.runDust(feetX, feetY, player.facing);
      runDustTimer = RUN_DUST_INTERVAL;
    }
  }
  player.updateAnimation(deltaSeconds); // Pick idle/run/jump/fall/hurt

  // Move every enemy. Loop backwards so removing one is safe.
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].updateAnimation(deltaSeconds);

    // Remove walkers that have left the screen
    if (!enemies[i].isPatrolling && enemies[i].isOffScreen(GAME_WIDTH)) {
      enemies.splice(i, 1);
    }
  }

  // Animate the coins
  for (const coin of coins) {
    coin.update(deltaSeconds);
  }

  // Check if the player is touching any enemy
  checkEnemyCollisions();

  // Check if the player picked up any coins
  checkCoinCollisions();
}

// ----- Difficulty -----
function updateDifficulty(deltaSeconds) {
  const didLevelUp = difficulty.update(deltaSeconds);

  if (didLevelUp) {
    // Speed up every enemy already on screen
    const multiplier = difficulty.getSpeedMultiplier();
    for (const enemy of enemies) {
      enemy.setSpeedMultiplier(multiplier);
    }
    levelUpMessageTimer = LEVEL_UP_MESSAGE_DURATION;
    showLevelUpMessage(difficulty.level);
  }

  // Count down, then hide the level-up message
  if (levelUpMessageTimer > 0) {
    levelUpMessageTimer = levelUpMessageTimer - deltaSeconds;
    if (levelUpMessageTimer <= 0) {
      hideLevelUpMessage();
    }
  }
}

// ----- Enemy spawning -----
// Count up; when the timer reaches the current interval, spawn a walker.
function updateSpawning(deltaSeconds) {
  spawnTimer = spawnTimer + deltaSeconds;

  if (spawnTimer >= difficulty.getSpawnInterval()) {
    spawnWalker();
    spawnTimer = 0;
  }
}

// ----- Player / coin collision -----
// Collect every coin the player touches: add points, then remove it.
function checkCoinCollisions() {
  // Loop BACKWARDS so removing a coin doesn't make us skip the next one
  for (let i = coins.length - 1; i >= 0; i--) {
    if (isRectangleColliding(player, coins[i])) {
      score = score + COIN_POINTS;
      playSound("coin");
      effects.coinSparkle(coins[i].x + coins[i].width / 2, coins[i].y + coins[i].height / 2, COIN_POINTS);
      coins.splice(i, 1); // Remove 1 coin at position i
    }
  }
}

// ----- Player / enemy collision -----
// Touching an enemy removes 1 health (unless the player is invincible).
function checkEnemyCollisions() {
  for (const enemy of enemies) {
    if (isRectangleColliding(player, enemy)) {
      const wasHurt = player.takeDamage();

      if (wasHurt) {
        damageFlashTimer = DAMAGE_FLASH_DURATION;

        // Sparks where the two touched (halfway between their centers)
        const hitX = (player.x + player.width / 2 + enemy.x + enemy.width / 2) / 2;
        const hitY = (player.y + player.height / 2 + enemy.y + enemy.height / 2) / 2;
        effects.hit(hitX, hitY);

        if (player.health <= 0) {
          endGame(); // Plays the game over sound
        } else {
          playSound("damage");
        }
      }
      return; // Only one hit per frame, even if touching two enemies
    }
  }
}

// ----- Visual updates -----
// Things that only change how the game LOOKS. These keep moving on the main
// menu and the Game Over screen, but freeze while PAUSED.
function updateVisuals(deltaSeconds) {
  if (isGameState(GAME_STATES.PAUSED)) {
    return;
  }

  background.update(deltaSeconds);
  effects.update(deltaSeconds);

  // While PLAYING, update() already animates these
  if (!isGameState(GAME_STATES.PLAYING)) {
    for (const coin of coins) {
      coin.update(deltaSeconds);
    }
    player.updateAnimation(deltaSeconds); // Breathing on the main menu
  }

  if (isGameState(GAME_STATES.GAME_OVER)) {
    gameOverTime = gameOverTime + deltaSeconds;
  }
}

// ----- Draw: paint the current frame on the canvas -----
function draw() {
  // Work in game pixels (800 x 450), scaled up to the canvas's real size
  ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Screen shake: move the whole scene a little
  const shake = effects.getShakeOffset();
  ctx.save();
  ctx.translate(shake.x, shake.y);

  // 1. Background: sky, moon, stars, clouds, mountains
  background.draw(ctx);

  // 2. Platforms (including the ground)
  for (const platform of platforms) {
    platform.draw(ctx);
  }

  // 3. Shadows under enemies and the player
  drawShadows();

  // 4. Coins
  for (const coin of coins) {
    coin.draw(ctx);
  }

  // 5. Enemies
  for (const enemy of enemies) {
    enemy.draw(ctx);
  }

  // 6. The player (gone at game over - it burst into particles)
  if (!isGameState(GAME_STATES.GAME_OVER)) {
    player.draw(ctx);
  }

  // 7. Particles and floating text on top
  effects.draw(ctx);

  ctx.restore(); // End of shake

  // 8. Red glow around the edges when hurt, and darkening at game over
  drawDamageVignette();
  drawGameOverFade();

  // 9. Update the HTML HUD (score, health, difficulty, time)
  updateHUD(
    score,
    player.health,
    difficulty.level,
    difficulty.elapsedSeconds,
    difficulty.getLevelProgress()
  );
}

// Soft shadows on whatever platform is below each character
function drawShadows() {
  for (const enemy of enemies) {
    drawGroundShadow(ctx, enemy.x + enemy.width / 2, enemy.y + enemy.height, enemy.width, 0);
  }

  if (!isGameState(GAME_STATES.GAME_OVER)) {
    const feetY = player.y + player.height;
    const surfaceY = findSurfaceBelow(player.x, player.width, feetY);
    if (surfaceY !== null) {
      drawGroundShadow(ctx, player.x + player.width / 2, surfaceY, player.width, surfaceY - feetY);
    }
  }
}

// The top of the highest platform under something (or null if none)
function findSurfaceBelow(x, width, feetY) {
  let surfaceY = null;
  for (const platform of platforms) {
    const isUnder = platform.x < x + width && platform.x + platform.width > x;
    const isBelowFeet = platform.y >= feetY - 1;
    if (isUnder && isBelowFeet && (surfaceY === null || platform.y < surfaceY)) {
      surfaceY = platform.y;
    }
  }
  return surfaceY;
}

// Red glow around the screen edges, fading out after a hit
function drawDamageVignette() {
  if (damageFlashTimer <= 0) {
    return;
  }
  if (!damageVignette) {
    damageVignette = createLayer(GAME_WIDTH, GAME_HEIGHT, function (layerCtx) {
      const glow = layerCtx.createRadialGradient(400, 225, 220, 400, 225, 470);
      glow.addColorStop(0, "rgba(255, 0, 40, 0)");
      glow.addColorStop(1, "rgba(255, 0, 40, 0.5)");
      layerCtx.fillStyle = glow;
      layerCtx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    });
  }
  ctx.globalAlpha = damageFlashTimer / DAMAGE_FLASH_DURATION;
  ctx.drawImage(damageVignette, 0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.globalAlpha = 1;
}

// At game over the scene slowly darkens behind the Game Over screen
function drawGameOverFade() {
  if (!isGameState(GAME_STATES.GAME_OVER)) {
    return;
  }
  const strength = Math.min(gameOverTime / 1.2, 1); // 0 → 1 over 1.2 seconds
  ctx.fillStyle = "rgba(40, 0, 10, " + (0.45 * strength) + ")";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

// ----- Game loop: runs once per frame, forever -----
// requestAnimationFrame gives us "timestamp": milliseconds since the page loaded
function gameLoop(timestamp) {
  // Work out how many seconds passed since the last frame
  if (lastTimestamp === null) {
    lastTimestamp = timestamp; // First frame: no time has passed yet
  }
  let deltaSeconds = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  // If the tab was hidden, the browser pauses the loop. When it comes back,
  // don't count that whole break as play time.
  if (deltaSeconds > 0.1) {
    deltaSeconds = 0.1;
  }

  update(deltaSeconds);        // Change the game data (only while PLAYING)
  updateVisuals(deltaSeconds); // Background, particles, menu animations

  // Always draw. On the menu, pause and game over screens the scene
  // shows behind the see-through overlay.
  draw();

  // Ask the browser to call gameLoop again before the next screen refresh
  requestAnimationFrame(gameLoop);
}

// ===== Buttons =====
// Sound and Music switches (on the main menu and the pause screen)
for (const button of document.querySelectorAll(".sound-toggle")) {
  button.addEventListener("click", toggleSound);
}
for (const button of document.querySelectorAll(".music-toggle")) {
  button.addEventListener("click", toggleMusic);
}

// Reset High Score (asks first, because it can't be undone)
document.getElementById("reset-high-score-button").addEventListener("click", function () {
  const isSure = window.confirm("Reset your high score to 0? This can't be undone.");
  if (isSure) {
    resetHighScore();
    showMenuHighScore(getHighScore());
  }
});

// Every button in the game makes a click sound.
// One listener on the whole page catches clicks on any button.
// (Not the touch Left/Right/Jump buttons - they are held, not clicked.)
document.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (button && !button.classList.contains("touch-hold")) {
    playSound("click");
  }
});

// ===== Touch controls =====
for (const button of document.querySelectorAll(".touch-hold")) {
  connectTouchButton(button, button.dataset.action); // "left", "right" or "jump"
}
document.getElementById("touch-pause-button").addEventListener("click", pauseGame);

document.getElementById("start-button").addEventListener("click", startNewGame);
document.getElementById("pause-button").addEventListener("click", pauseGame);
document.getElementById("resume-button").addEventListener("click", resumeGame);

// Restart and Main Menu appear on both the Pause and Game Over screens,
// so they use a class and we connect every button that has it
for (const button of document.querySelectorAll(".restart-button")) {
  button.addEventListener("click", startNewGame);
}
for (const button of document.querySelectorAll(".main-menu-button")) {
  button.addEventListener("click", goToMainMenu);
}

// ===== Keyboard shortcuts for pausing =====
window.addEventListener("keydown", function (event) {
  // Ignore the automatic repeats while a key is held down
  if (event.repeat) {
    return;
  }
  if (event.code === "KeyP" || event.code === "Escape") {
    togglePause();
  }
});

// ===== Auto-pause when the player switches tabs or minimizes =====
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    pauseGame(); // Does nothing unless we are PLAYING
  }
});

// ===== Start =====
loadAudio();                     // Load the sound files (missing ones are skipped)
showMenuHighScore(getHighScore());
setGameState(GAME_STATES.MENU);  // Show the main menu
requestAnimationFrame(gameLoop); // Start the loop once; it runs for the whole visit
