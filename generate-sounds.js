// ===== Ninja Dash - Sound generator =====
// Creates the game's retro sound effects and music as .wav files in
// assets/audio/. You only need this if you want to re-make the sounds.
//
// Run it with Node.js from the project folder:
//   node tools/generate-sounds.js
//
// Each sound is built from simple waves (square, triangle, noise),
// the same way old game consoles made sound.

const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 22050; // Samples per second (enough for retro sounds)
const OUTPUT_FOLDER = path.join(__dirname, "..", "assets", "audio");

// ----- Wave shapes: phase goes 0..1 through one cycle -----
function squareWave(phase) {
  return phase % 1 < 0.5 ? 1 : -1;
}
function triangleWave(phase) {
  const p = phase % 1;
  return p < 0.5 ? 4 * p - 1 : 3 - 4 * p;
}
function noise() {
  return Math.random() * 2 - 1;
}

// Make an empty sound of a given length, in seconds
function createBuffer(seconds) {
  return new Float32Array(Math.ceil(seconds * SAMPLE_RATE));
}

// Add a tone to the buffer.
//   startFreq/endFreq  = pitch slides from start to end (same = steady note)
//   wave               = squareWave, triangleWave or "noise"
//   volume             = 0..1
// The volume fades out over the note so it doesn't click.
function addTone(buffer, startTime, duration, startFreq, endFreq, wave, volume) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  let phase = 0;

  for (let i = 0; i < length && startSample + i < buffer.length; i++) {
    const progress = i / length;                      // 0 → 1 through the note
    const freq = startFreq + (endFreq - startFreq) * progress;
    phase = phase + freq / SAMPLE_RATE;

    const attack = Math.min(1, i / (0.005 * SAMPLE_RATE)); // Quick fade in (5ms)
    const release = 1 - progress;                          // Fade out
    const sample = wave === "noise" ? noise() : wave(phase);

    buffer[startSample + i] += sample * volume * attack * release;
  }
}

// Save a buffer as a 16-bit mono .wav file
function saveWav(fileName, buffer) {
  const dataSize = buffer.length * 2;
  const file = Buffer.alloc(44 + dataSize);

  // WAV header
  file.write("RIFF", 0);
  file.writeUInt32LE(36 + dataSize, 4);
  file.write("WAVE", 8);
  file.write("fmt ", 12);
  file.writeUInt32LE(16, 16);             // Header chunk size
  file.writeUInt16LE(1, 20);              // Format: PCM
  file.writeUInt16LE(1, 22);              // Channels: mono
  file.writeUInt32LE(SAMPLE_RATE, 24);
  file.writeUInt32LE(SAMPLE_RATE * 2, 28); // Bytes per second
  file.writeUInt16LE(2, 32);              // Bytes per sample
  file.writeUInt16LE(16, 34);             // Bits per sample
  file.write("data", 36);
  file.writeUInt32LE(dataSize, 40);

  // Sound data: turn -1..1 into -32767..32767
  for (let i = 0; i < buffer.length; i++) {
    const clamped = Math.max(-1, Math.min(1, buffer[i]));
    file.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  fs.writeFileSync(path.join(OUTPUT_FOLDER, fileName), file);
  console.log("Created", fileName, "(" + Math.round(file.length / 1024) + " KB)");
}

// Musical note name → frequency in Hz
const NOTES = {
  A2: 110.0, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0,
  A3: 220.0, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
  G5: 783.99, B5: 987.77, E6: 1318.51,
};

fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });

// ----- Jump: quick rising "boing" -----
{
  const b = createBuffer(0.18);
  addTone(b, 0, 0.18, 280, 720, squareWave, 0.35);
  saveWav("jump.wav", b);
}

// ----- Coin: bright two-note "ding-ding" -----
{
  const b = createBuffer(0.3);
  addTone(b, 0, 0.07, NOTES.B5, NOTES.B5, squareWave, 0.3);
  addTone(b, 0.07, 0.23, NOTES.E6, NOTES.E6, squareWave, 0.3);
  saveWav("coin.wav", b);
}

// ----- Damage: low crunchy drop -----
{
  const b = createBuffer(0.3);
  addTone(b, 0, 0.3, 220, 70, squareWave, 0.35);
  addTone(b, 0, 0.15, 0, 0, "noise", 0.3);
  saveWav("damage.wav", b);
}

// ----- Game over: sad falling notes -----
{
  const b = createBuffer(1.4);
  const melody = [NOTES.C5, NOTES.G4, NOTES.E4, NOTES.C4];
  melody.forEach(function (freq, i) {
    const isLast = i === melody.length - 1;
    addTone(b, i * 0.22, isLast ? 0.7 : 0.22, freq, isLast ? freq * 0.97 : freq, triangleWave, 0.5);
    addTone(b, i * 0.22, isLast ? 0.7 : 0.22, freq / 2, freq / 2, squareWave, 0.12);
  });
  saveWav("gameover.wav", b);
}

// ----- Button click: tiny blip -----
{
  const b = createBuffer(0.05);
  addTone(b, 0, 0.05, 900, 700, squareWave, 0.25);
  saveWav("click.wav", b);
}

// ----- Background music: loops seamlessly -----
// 4 chords (Am, F, C, G), 1 bar each, played twice with a small change.
{
  const BEAT = 60 / 140;      // 140 beats per minute
  const BARS = 8;
  const b = createBuffer(BARS * 4 * BEAT);

  const chords = [
    { bass: NOTES.A2, arp: [NOTES.A3, NOTES.C4, NOTES.E4, NOTES.A4] },
    { bass: NOTES.F3 / 2, arp: [NOTES.F3, NOTES.A3, NOTES.C4, NOTES.F4] },
    { bass: NOTES.C3, arp: [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5] },
    { bass: NOTES.G3 / 2, arp: [NOTES.G3, NOTES.B3, NOTES.D4, NOTES.G4] },
  ];
  // Lead melody: one note per beat, 0 = rest
  const melody = [
    NOTES.E5, 0, NOTES.D5, NOTES.C5,   NOTES.A4, 0, NOTES.C5, 0,
    NOTES.G4, 0, NOTES.C5, NOTES.E5,   NOTES.D5, 0, NOTES.B4, 0,
    NOTES.E5, 0, NOTES.G5, NOTES.E5,   NOTES.C5, 0, NOTES.A4, 0,
    NOTES.C5, NOTES.D5, NOTES.E5, 0,   NOTES.D5, 0, NOTES.B4, 0,
  ];

  for (let bar = 0; bar < BARS; bar++) {
    const chord = chords[bar % 4];
    const barStart = bar * 4 * BEAT;

    for (let beat = 0; beat < 4; beat++) {
      const t = barStart + beat * BEAT;
      // Bass: one note per beat
      addTone(b, t, BEAT * 0.9, chord.bass, chord.bass, triangleWave, 0.35);
      // Arpeggio: two quick chord notes per beat
      addTone(b, t, BEAT / 2, chord.arp[beat], chord.arp[beat], squareWave, 0.06);
      addTone(b, t + BEAT / 2, BEAT / 2, chord.arp[(beat + 2) % 4], chord.arp[(beat + 2) % 4], squareWave, 0.06);
      // Hi-hat tick
      addTone(b, t + BEAT / 2, 0.03, 0, 0, "noise", 0.05);
    }

    // Melody plays in the second half (bars 4-7)
    if (bar >= 4) {
      for (let beat = 0; beat < 4; beat++) {
        const note = melody[(bar - 4) * 8 + beat * 2];
        if (note > 0) {
          addTone(b, barStart + beat * BEAT, BEAT * 0.95, note, note, squareWave, 0.09);
        }
      }
    }
  }
  saveWav("music.wav", b);
}
