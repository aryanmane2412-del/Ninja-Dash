// ===== Ninja Dash - Difficulty =====
// Tracks how long the game has been played and turns that into a
// difficulty level. The level controls enemy speed and spawn frequency.

// ----- Difficulty settings (change these to tune the game) -----
const DIFFICULTY_LEVEL_DURATION = 30; // Seconds per level
const DIFFICULTY_MAX_LEVEL = 10;      // Stops getting harder after this

const SPEED_INCREASE_PER_LEVEL = 0.12; // +12% enemy speed each level

const SPAWN_INTERVAL_START = 8;        // Seconds between new enemies at level 1
const SPAWN_INTERVAL_DECREASE = 0.6;   // Spawn this many seconds sooner each level
const SPAWN_INTERVAL_MIN = 2.5;        // Never spawn faster than this

class Difficulty {
  constructor() {
    this.reset();
  }

  // Back to level 1 for a new game
  reset() {
    this.level = 1;
    this.elapsedSeconds = 0; // Time played this game
  }

  // Add the time since the last frame. Returns true if the level went up.
  update(deltaSeconds) {
    this.elapsedSeconds = this.elapsedSeconds + deltaSeconds;

    // Every 30 seconds = 1 more level, starting at level 1
    let newLevel = 1 + Math.floor(this.elapsedSeconds / DIFFICULTY_LEVEL_DURATION);
    if (newLevel > DIFFICULTY_MAX_LEVEL) {
      newLevel = DIFFICULTY_MAX_LEVEL;
    }

    const didLevelUp = newLevel > this.level;
    this.level = newLevel;
    return didLevelUp;
  }

  // How much faster enemies move than at level 1
  // Level 1 = 1.00, level 2 = 1.12, level 3 = 1.24 ... level 10 = 2.08
  getSpeedMultiplier() {
    return 1 + (this.level - 1) * SPEED_INCREASE_PER_LEVEL;
  }

  // Seconds between enemy spawns
  // Level 1 = 8.0, level 2 = 7.4, level 3 = 6.8 ... level 10 = 2.6
  getSpawnInterval() {
    const interval = SPAWN_INTERVAL_START - (this.level - 1) * SPAWN_INTERVAL_DECREASE;
    return Math.max(interval, SPAWN_INTERVAL_MIN);
  }

  // How far through the current level we are: 0 = just started, 1 = about to level up
  getLevelProgress() {
    if (this.level >= DIFFICULTY_MAX_LEVEL) {
      return 1;
    }
    const secondsIntoLevel = this.elapsedSeconds - (this.level - 1) * DIFFICULTY_LEVEL_DURATION;
    return secondsIntoLevel / DIFFICULTY_LEVEL_DURATION;
  }
}
