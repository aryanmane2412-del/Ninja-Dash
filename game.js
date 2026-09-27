// ===== Ninja Dash - Stage 5 =====
// This file sets up the canvas and runs the game loop.
// The player can move, jump and fall. No enemies or coins yet.

// ----- Get the HTML elements we need -----
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const gameCanvas = document.getElementById("game-canvas");

// The "2d" context is the tool we use to draw on the canvas
const ctx = gameCanvas.getContext("2d");

// ----- Game settings -----
const GROUND_HEIGHT = 60; // How tall the ground is, in pixels

const PLAYER_START_X = 100; // How far from the left edge the player starts

// ----- Game state -----
let isGameRunning = false; // Stops the loop from being started twice
let frameCount = 0;        // Counts frames so we can see the loop is running

// ----- Create the player -----
// The top of the ground is the canvas height minus the ground height
const groundY = gameCanvas.height - GROUND_HEIGHT;
const player = new Player(PLAYER_START_X, groundY);

// ----- Start the game -----
function startGame() {
  // Hide the start screen and show the canvas
  startScreen.classList.add("hidden");
  gameCanvas.classList.remove("hidden");

  // Remove keyboard focus from the button, so Space doesn't "click" it again
  startButton.blur();

  // Put the player at the starting position
  player.reset();

  // Start the game loop only once
  if (!isGameRunning) {
    isGameRunning = true;
    requestAnimationFrame(gameLoop);
  }
}

// ----- Update: change the game's data (no drawing here) -----
function update() {
  frameCount++;

  // Let the player move based on keyboard input
  player.update(input, gameCanvas.width);
}

// ----- Draw: paint the current frame on the canvas -----
function draw() {
  // 1. Clear everything from the previous frame
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // 2. Draw the background
  drawBackground();

  // 3. Draw the ground
  drawGround();

  // 4. Draw the player (after the ground, so it appears on top)
  player.draw(ctx);

  // 5. Draw the text on top
  drawText();
}

// Sky background with a simple top-to-bottom color fade
function drawBackground() {
  const skyGradient = ctx.createLinearGradient(0, 0, 0, gameCanvas.height);
  skyGradient.addColorStop(0, "#141824");
  skyGradient.addColorStop(1, "#2a3050");

  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// Ground platform at the bottom of the canvas
function drawGround() {
  // Main ground block
  ctx.fillStyle = "#3b2f2f";
  ctx.fillRect(0, groundY, gameCanvas.width, GROUND_HEIGHT);

  // Thin grass strip on top of the ground
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(0, groundY, gameCanvas.width, 8);
}

// Title text and frame counter
function drawText() {
  ctx.fillStyle = "#e6e6e6";
  ctx.font = "20px Segoe UI, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Ninja Dash - Stage 5", 16, 16);

  // Frame counter proves the loop is running
  ctx.fillStyle = "#9aa0b0";
  ctx.font = "14px Segoe UI, Arial, sans-serif";
  ctx.fillText("Frame: " + frameCount, 16, 44);
}

// ----- Game loop: runs once per frame, forever -----
function gameLoop() {
  update(); // Change the data
  draw();   // Show the data on screen

  // Ask the browser to call gameLoop again before the next screen refresh
  requestAnimationFrame(gameLoop);
}

// ----- Connect the button to the startGame function -----
startButton.addEventListener("click", startGame);
