// ===== Ninja Dash - HUD =====
// The HUD (Heads-Up Display) shows score, health, difficulty and time.
// It is made of HTML elements on top of the canvas, not drawn on the canvas.

// ----- Get the HUD elements -----
const hudHearts = document.getElementById("hud-hearts");
const hudScore = document.getElementById("hud-score");
const hudDifficulty = document.getElementById("hud-difficulty");
const hudProgressFill = document.getElementById("hud-progress-fill");
const hudTime = document.getElementById("hud-time");
const levelUpMessage = document.getElementById("level-up-message");

// ----- Remember what is currently shown -----
// Changing the page is slower than drawing on the canvas, so we only
// touch an element when its value is different from last frame.
const hudShown = {
  score: null,
  health: null,
  level: null,
  time: null,
  progress: null,
};

// Get the HUD ready for a new game: one heart per max health.
// (Showing and hiding the HUD is handled by gameState.js.)
function resetHUD(maxHealth) {
  hudHearts.innerHTML = "";
  for (let i = 0; i < maxHealth; i++) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "♥";
    hudHearts.appendChild(heart);
  }

  // Forget old values so everything is shown fresh
  hudShown.score = null;
  hudShown.health = null;
  hudShown.level = null;
  hudShown.time = null;
  hudShown.progress = null;
}

// Called every frame. Only updates the parts that changed.
function updateHUD(score, health, level, elapsedSeconds, levelProgress) {
  // Score
  if (score !== hudShown.score) {
    // Went up? Replay the "bump" animation (remove the class, force the
    // browser to notice, then add it back)
    if (hudShown.score !== null && score > hudShown.score) {
      hudScore.classList.remove("bump");
      void hudScore.offsetWidth;
      hudScore.classList.add("bump");
    }
    hudScore.textContent = score;
    hudShown.score = score;
  }

  // Health: grey out the hearts that are lost
  if (health !== hudShown.health) {
    const hearts = hudHearts.children;
    for (let i = 0; i < hearts.length; i++) {
      hearts[i].classList.toggle("lost", i >= health);
    }
    hudHearts.setAttribute("aria-label", "Health: " + health);
    hudShown.health = health;
  }

  // Difficulty level
  if (level !== hudShown.level) {
    hudDifficulty.textContent = level;
    hudShown.level = level;
  }

  // Time as minutes:seconds, e.g. 1:05
  const time = formatTime(elapsedSeconds);
  if (time !== hudShown.time) {
    hudTime.textContent = time;
    hudShown.time = time;
  }

  // Progress bar (whole percent is smooth enough)
  const progress = Math.floor(levelProgress * 100);
  if (progress !== hudShown.progress) {
    hudProgressFill.style.width = progress + "%";
    hudShown.progress = progress;
  }
}

// Turn seconds into "m:ss"
function formatTime(totalSeconds) {
  const wholeSeconds = Math.floor(totalSeconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const seconds = wholeSeconds % 60;
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// ----- Level-up message -----
function showLevelUpMessage(level) {
  levelUpMessage.textContent = "Difficulty " + level + "!";
  levelUpMessage.classList.remove("hidden"); // Also restarts the pop animation
}

function hideLevelUpMessage() {
  levelUpMessage.classList.add("hidden");
}
