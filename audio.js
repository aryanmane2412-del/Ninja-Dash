// ===== Ninja Dash - Audio =====
// Loads the local sound files and plays them.
// If a file is missing or can't play, the game simply stays silent
// for that sound - it never crashes.

// ----- Local audio files (no internet needed) -----
const SOUND_FILES = {
  jump: "assets/audio/jump.wav",
  coin: "assets/audio/coin.wav",
  damage: "assets/audio/damage.wav",
  gameOver: "assets/audio/gameover.wav",
  click: "assets/audio/click.wav",
};
const MUSIC_FILE = "assets/audio/music.wav";

const SOUND_VOLUME = 0.5; // 0 = silent, 1 = full
const MUSIC_VOLUME = 0.35;

// ----- Settings (remembered between visits) -----
let isSoundOn = loadSetting("ninjaDash.soundOn", true);
let isMusicOn = loadSetting("ninjaDash.musicOn", true);

// ----- Loaded audio -----
const sounds = {};            // name → Audio element (or null if missing)
let music = null;             // Audio element for the background music
let musicShouldPlay = false;  // Does the GAME want music right now? (e.g. PLAYING)

// ----- Load every sound once, when the page opens -----
function loadAudio() {
  for (const name in SOUND_FILES) {
    sounds[name] = createAudio(SOUND_FILES[name], SOUND_VOLUME);
  }
  music = createAudio(MUSIC_FILE, MUSIC_VOLUME);
  if (music) {
    music.loop = true;
  }
  updateAudioButtons();
}

// Create one Audio element. Returns null if the browser can't play audio at all.
function createAudio(filePath, volume) {
  try {
    const audio = new Audio(filePath);
    audio.volume = volume;
    audio.preload = "auto";

    // If the file is missing or broken, remember that and warn once
    audio.addEventListener("error", function () {
      audio.isBroken = true;
      console.warn("Sound file could not be loaded, it will be skipped:", filePath);
    });
    return audio;
  } catch (error) {
    console.warn("Audio is not supported in this browser.");
    return null;
  }
}

// ----- Sound effects -----
function playSound(name) {
  const sound = sounds[name];
  if (!isSoundOn || !sound || sound.isBroken) {
    return;
  }

  // A copy lets the same sound overlap (e.g. two coins quickly)
  const copy = sound.cloneNode();
  copy.volume = sound.volume;

  // play() can fail (file missing, browser blocked it) - ignore quietly
  const playing = copy.play();
  if (playing) {
    playing.catch(function () {});
  }
}

// ----- Music -----
// The game calls these when its state changes.

// Start the music. fromBeginning = true restarts the song.
function startMusic(fromBeginning) {
  musicShouldPlay = true;
  if (fromBeginning && music) {
    music.currentTime = 0;
  }
  playMusicIfAllowed();
}

// Pause, keeping our place in the song (used when the game is paused)
function pauseMusic() {
  musicShouldPlay = false;
  if (music) {
    music.pause();
  }
}

// Stop and go back to the start of the song
function stopMusic() {
  pauseMusic();
  if (music) {
    music.currentTime = 0;
  }
}

// Only actually play if the game wants music AND the player has music on
function playMusicIfAllowed() {
  if (!musicShouldPlay || !isMusicOn || !music || music.isBroken) {
    return;
  }
  const playing = music.play();
  if (playing) {
    playing.catch(function () {});
  }
}

// ----- On/off switches -----
function toggleSound() {
  isSoundOn = !isSoundOn;
  saveSetting("ninjaDash.soundOn", isSoundOn);
  updateAudioButtons();
}

function toggleMusic() {
  isMusicOn = !isMusicOn;
  saveSetting("ninjaDash.musicOn", isMusicOn);

  if (isMusicOn) {
    playMusicIfAllowed(); // Only starts if the game is being played
  } else if (music) {
    music.pause();
  }
  updateAudioButtons();
}

// Update the text on every Sound / Music button (there is one set on the
// main menu and one on the pause screen)
function updateAudioButtons() {
  for (const button of document.querySelectorAll(".sound-toggle")) {
    button.textContent = isSoundOn ? "🔊 Sound: On" : "🔇 Sound: Off";
    button.classList.toggle("is-off", !isSoundOn);
  }
  for (const button of document.querySelectorAll(".music-toggle")) {
    button.textContent = isMusicOn ? "🎵 Music: On" : "🎵 Music: Off";
    button.classList.toggle("is-off", !isMusicOn);
  }
}

// ----- Saving settings -----
// localStorage can be blocked (private mode, strict settings), so every
// read and write is wrapped in try/catch and falls back to the default.
function loadSetting(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? defaultValue : saved === "true";
  } catch (error) {
    return defaultValue;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (error) {
    // Can't save - the setting still works until the page is closed
  }
}
