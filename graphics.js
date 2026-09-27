// ===== Ninja Dash - Graphics helpers =====
// Shared drawing tools used by the background, platforms, player, enemies,
// coins and effects.

// ----- Game world size -----
// The game is always 800 x 450 "game pixels", whatever the screen size.
const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;

// ----- Sharp graphics on phones and high-resolution screens -----
// Many screens have 2 or 3 real pixels per CSS pixel. We draw the canvas
// that much bigger so it isn't blurry. Capped at 2 to stay fast.
const RENDER_SCALE = Math.min(window.devicePixelRatio || 1, 2);

// ----- Cached layers -----
// Drawing something complicated every frame is slow. For things that never
// change (sky, mountains, platforms, glows) we draw them ONCE onto a hidden
// canvas, then copy that picture each frame with drawImage - which is fast.
function createLayer(width, height, drawFunction) {
  const layer = document.createElement("canvas");
  layer.width = Math.ceil(width * RENDER_SCALE);
  layer.height = Math.ceil(height * RENDER_SCALE);

  const layerCtx = layer.getContext("2d");
  layerCtx.scale(RENDER_SCALE, RENDER_SCALE);
  drawFunction(layerCtx);
  return layer;
}

// ----- Rounded rectangle path -----
// (Built by hand so it works in every browser.)
function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function fillRoundedRect(ctx, x, y, width, height, radius, color) {
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = color;
  ctx.fill();
}

// ----- Soft shadow on the ground -----
// heightAboveGround makes the shadow smaller and fainter as things jump.
function drawGroundShadow(ctx, centerX, groundY, width, heightAboveGround) {
  const fade = Math.max(0, 1 - heightAboveGround / 160);
  if (fade <= 0) {
    return;
  }
  ctx.fillStyle = "rgba(0, 0, 0, " + (0.35 * fade) + ")";
  ctx.beginPath();
  ctx.ellipse(centerX, groundY, (width / 2) * (0.5 + 0.5 * fade), 4 * fade + 1, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ----- Random numbers for visuals only -----
// Particles, stars and grass use THIS instead of Math.random(), so the
// gameplay's random choices (like which side walkers come from) are not
// affected by how many particles were drawn.
// makeRandom(seed) always gives the same sequence for the same seed.
function makeRandom(seed) {
  let state = seed % 2147483647;
  if (state <= 0) {
    state = state + 2147483646;
  }
  return function () {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646; // 0 up to (but not including) 1
  };
}

const visualRandom = makeRandom(20240927);

// Random number between min and max
function randomBetween(min, max) {
  return min + visualRandom() * (max - min);
}

// Pick a random item from an array
function randomItem(items) {
  return items[Math.floor(visualRandom() * items.length)];
}
