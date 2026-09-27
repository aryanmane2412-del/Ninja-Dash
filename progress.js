// ===== Ninja Dash - Level progress =====
// Remembers which levels are unlocked and completed, and the result of
// each completed level. Saved in localStorage, so it survives closing
// the browser. (Same idea as highScore.js, but for a bigger object.)

const PROGRESS_KEY = "ninjaDash.progress";

// progress = {
//   unlocked: 3,                         // Highest level you may play
//   levels: {
//     1: { completed: true, bestScore: 420, lastScore: 400, lastCoins: 30, lastTime: 71.5, bestTime: 65.2 },
//     2: { ... },
//   }
// }
let progress = loadProgress();

function emptyProgress() {
  return { unlocked: 1, levels: {} };
}

// ----- Load and check the saved data -----
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));

    // Anything missing or strange? Start fresh instead of crashing.
    if (!saved || typeof saved !== "object" || typeof saved.levels !== "object" || saved.levels === null) {
      return emptyProgress();
    }
    const unlocked = Math.floor(Number(saved.unlocked));
    saved.unlocked = Number.isFinite(unlocked) ? Math.min(Math.max(unlocked, 1), LEVELS.length) : 1;
    return saved;
  } catch (error) {
    return emptyProgress(); // Storage blocked, or the saved text wasn't valid JSON
  }
}

function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("Could not save level progress in this browser.");
  }
}

// ----- Questions the game asks -----
function isLevelUnlocked(levelNumber) {
  return levelNumber <= progress.unlocked;
}

function isLevelCompleted(levelNumber) {
  const record = progress.levels[levelNumber];
  return Boolean(record && record.completed);
}

function getLevelRecord(levelNumber) {
  return progress.levels[levelNumber] || null;
}

// The level "Start Game" should open: the first unlocked level not yet
// completed (or the last level if everything is done)
function getNextLevelToPlay() {
  for (let n = 1; n <= progress.unlocked; n++) {
    if (!isLevelCompleted(n)) {
      return n;
    }
  }
  return progress.unlocked;
}

// ----- Called when a level is finished -----
function recordLevelComplete(levelNumber, result) {
  const old = progress.levels[levelNumber] || {};
  progress.levels[levelNumber] = {
    completed: true,
    bestScore: Math.max(old.bestScore || 0, result.score),
    bestTime: old.bestTime ? Math.min(old.bestTime, result.time) : result.time,
    lastScore: result.score,
    lastCoins: result.coins,
    lastTime: result.time,
  };

  // Completing a level unlocks the next one
  if (levelNumber < LEVELS.length && progress.unlocked < levelNumber + 1) {
    progress.unlocked = levelNumber + 1;
  }
  saveProgress();
}

// Totals across every completed level (for the "Game Completed" screen).
// Uses each level's most recent completion.
function getProgressTotals() {
  const totals = { score: 0, coins: 0, levelsCompleted: 0, time: 0 };
  for (let n = 1; n <= LEVELS.length; n++) {
    const record = progress.levels[n];
    if (record && record.completed) {
      totals.score += record.lastScore || 0;
      totals.coins += record.lastCoins || 0;
      totals.time += record.lastTime || 0;
      totals.levelsCompleted += 1;
    }
  }
  return totals;
}

function resetProgress() {
  progress = emptyProgress();
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch (error) {
    // Nothing to remove if storage is blocked
  }
}
