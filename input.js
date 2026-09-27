// ===== Ninja Dash - Input =====
// This file listens to the keyboard and remembers which keys are held down.
// Other files ask this file questions like "is move left pressed?"

// ----- Key states -----
// An object that stores true/false for each key.
// Example: { KeyA: true, ArrowRight: false }
const keysPressed = {};

// Keys that should not scroll the page while playing
const GAME_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"];

// ----- keydown: a key was pressed -----
window.addEventListener("keydown", function (event) {
  keysPressed[event.code] = true;

  // Stop arrow keys from scrolling the browser page
  if (GAME_KEYS.includes(event.code)) {
    event.preventDefault();
  }
});

// ----- keyup: a key was released -----
window.addEventListener("keyup", function (event) {
  keysPressed[event.code] = false;
});

// ----- Safety: if the window loses focus, release all keys -----
// Without this, switching tabs while holding a key could leave it "stuck".
window.addEventListener("blur", function () {
  for (const key in keysPressed) {
    keysPressed[key] = false;
  }
});

// ----- Helper functions the game can ask -----
const input = {
  isMoveLeftPressed: function () {
    return keysPressed["KeyA"] === true || keysPressed["ArrowLeft"] === true;
  },

  isMoveRightPressed: function () {
    return keysPressed["KeyD"] === true || keysPressed["ArrowRight"] === true;
  },

  isJumpPressed: function () {
    return keysPressed["Space"] === true;
  },
};
