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

// ----- Touch button states -----
// The on-screen buttons (phones/tablets) set these to true while held.
const touchPressed = {
  left: false,
  right: false,
  jump: false,
};

// Connect one on-screen button to one touchPressed action.
// Pointer events work for fingers, mouse and pen, and each finger is
// tracked separately - so you can hold Right and tap Jump at the same time.
function connectTouchButton(button, action) {
  function press(event) {
    event.preventDefault(); // No scrolling, zooming or text selection
    touchPressed[action] = true;
    button.classList.add("is-pressed");
  }
  function release() {
    touchPressed[action] = false;
    button.classList.remove("is-pressed");
  }

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release); // e.g. a phone call interrupts
  button.addEventListener("pointerleave", release);  // finger slid off the button
  button.addEventListener("contextmenu", function (event) {
    event.preventDefault(); // Long-press shouldn't open a menu
  });
}

// Let go of every touch button (used when the game is paused or ends)
function releaseTouchButtons() {
  for (const action in touchPressed) {
    touchPressed[action] = false;
  }
  for (const button of document.querySelectorAll(".touch-hold")) {
    button.classList.remove("is-pressed");
  }
}

// Also release touch buttons when the window loses focus
window.addEventListener("blur", releaseTouchButtons);

// ----- Helper functions the game can ask -----
// Keyboard OR touch - the player code doesn't need to know which one.
const input = {
  isMoveLeftPressed: function () {
    return keysPressed["KeyA"] === true || keysPressed["ArrowLeft"] === true || touchPressed.left;
  },

  isMoveRightPressed: function () {
    return keysPressed["KeyD"] === true || keysPressed["ArrowRight"] === true || touchPressed.right;
  },

  isJumpPressed: function () {
    return keysPressed["Space"] === true || touchPressed.jump;
  },
};
