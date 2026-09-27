// ===== Ninja Dash - Game States =====
// The game is always in exactly ONE of these states.
// This file stores the current state and shows the right screens for it.
// game.js decides WHEN to change state; this file handles WHAT that looks like.

// ----- The four states -----
// Using named constants instead of typing "PLAYING" everywhere means a typo
// becomes an error (GAME_STATES.PLAYNG is undefined) instead of a silent bug.
const GAME_STATES = Object.freeze({
  MENU: "MENU",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  GAME_OVER: "GAME_OVER",
});

let currentGameState = GAME_STATES.MENU;

// ----- The screens each state can show or hide -----
const stateScreens = {
  menu: document.getElementById("start-screen"),
  canvas: document.getElementById("game-canvas"),
  hud: document.getElementById("hud"),
  pauseButton: document.getElementById("pause-button"),
  pauseScreen: document.getElementById("pause-screen"),
  gameOverScreen: document.getElementById("game-over-screen"),
};

// ----- Which screens are visible in each state -----
// Reading across a row tells you exactly what the player sees.
const SCREENS_FOR_STATE = {
  //                     menu   canvas  hud    pauseButton  pauseScreen  gameOverScreen
  MENU:      { menu: true,  canvas: true,  hud: false, pauseButton: false, pauseScreen: false, gameOverScreen: false },
  PLAYING:   { menu: false, canvas: true,  hud: true,  pauseButton: true,  pauseScreen: false, gameOverScreen: false },
  PAUSED:    { menu: false, canvas: true,  hud: true,  pauseButton: false, pauseScreen: true,  gameOverScreen: false },
  GAME_OVER: { menu: false, canvas: true,  hud: true,  pauseButton: false, pauseScreen: false, gameOverScreen: true  },
};

// ----- Change state -----
// The ONLY place currentGameState is changed.
function setGameState(newState) {
  currentGameState = newState;

  // Show or hide every screen according to the table above
  const visibility = SCREENS_FOR_STATE[newState];
  for (const name in stateScreens) {
    stateScreens[name].classList.toggle("hidden", !visibility[name]);
  }

  // Let CSS know the state too (e.g. touch controls only show while PLAYING)
  document.body.dataset.state = newState;

  // Let go of any touch buttons, so nothing stays "held" after a pause
  releaseTouchButtons();

  // Take keyboard focus off any button that was just clicked,
  // so pressing Space to jump doesn't "click" it again
  if (document.activeElement) {
    document.activeElement.blur();
  }
}

// Small helper so the code reads like a sentence: if (isGameState(GAME_STATES.PLAYING))
function isGameState(state) {
  return currentGameState === state;
}

// ----- Game Over screen -----
function showFinalStats(finalScore, secondsSurvived, difficultyReached, bestScore, isNewRecord) {
  document.getElementById("final-score").textContent = finalScore;
  document.getElementById("final-time").textContent = formatTime(secondsSurvived); // from hud.js
  document.getElementById("final-difficulty").textContent = difficultyReached;
  document.getElementById("final-high-score").textContent = bestScore;

  // A new record replaces the "Final Score" label with a gold message
  const label = document.getElementById("final-score-label");
  label.textContent = isNewRecord ? "🏆 New High Score!" : "Final Score";
  label.classList.toggle("new-record", isNewRecord);
}

// ----- Main menu -----
function showMenuHighScore(bestScore) {
  document.getElementById("menu-high-score").textContent = bestScore;

  // Nothing to reset when the high score is 0
  document.getElementById("reset-high-score-button").disabled = bestScore === 0;
}
