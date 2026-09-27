// ===== Ninja Dash - High Score =====
// Saves the best score in the browser's localStorage.
// localStorage keeps data after the browser is closed, and it lives on
// this computer only - no server or database needed.

const HIGH_SCORE_KEY = "ninjaDash.highScore";

// The high score is loaded once when the page opens, then kept here
let highScore = loadHighScore();

// ----- Read the saved high score -----
function loadHighScore() {
  try {
    const saved = localStorage.getItem(HIGH_SCORE_KEY); // Always a string, or null
    const number = parseInt(saved, 10);

    // Nothing saved yet, or something that isn't a sensible score? Use 0.
    if (!Number.isFinite(number) || number < 0) {
      return 0;
    }
    return number;
  } catch (error) {
    // localStorage is blocked (e.g. some private windows)
    return 0;
  }
}

// ----- Write the high score -----
function saveHighScore(value) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(value));
  } catch (error) {
    // Can't save. The high score still works until the page is closed.
    console.warn("Could not save the high score in this browser.");
  }
}

// ----- Call at game over. Returns true if this score is a new record. -----
function submitScore(score) {
  if (score > highScore) {
    highScore = score;
    saveHighScore(highScore);
    return true;
  }
  return false; // Equal or lower is not a new record
}

// ----- Start over from 0 -----
function resetHighScore() {
  highScore = 0;
  try {
    localStorage.removeItem(HIGH_SCORE_KEY);
  } catch (error) {
    // Nothing to remove if storage is blocked
  }
}

function getHighScore() {
  return highScore;
}
