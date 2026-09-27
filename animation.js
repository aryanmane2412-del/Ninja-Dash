// ===== Ninja Dash - Animation =====
// An Animation is a list of frames plus a timer.
// The timer counts up in seconds, and the timer decides which frame to show.
//
// A "frame" can be anything: an image from a sprite sheet, or (like here)
// a small object describing a pose, e.g. { bob: -2, frontFoot: 7 }.

class Animation {
  // frames        = array of frames, played in order and then looping
  // frameDuration = how many seconds each frame stays on screen
  constructor(frames, frameDuration) {
    this.frames = frames;
    this.frameDuration = frameDuration;
    this.timer = 0; // Seconds since this animation started
  }

  // Start again from the first frame
  reset() {
    this.timer = 0;
  }

  // Move the timer forward by the time since the last game frame
  update(deltaSeconds) {
    this.timer = this.timer + deltaSeconds;
  }

  // Which frame number should be shown right now?
  // Example: frameDuration 0.1s, 4 frames, timer 0.35s
  //   0.35 / 0.1 = 3.5  →  floor = 3  →  3 % 4 = 3  →  frame 3
  //   at 0.45s: floor(4.5) = 4 → 4 % 4 = 0 → back to frame 0 (loop)
  getFrameIndex() {
    const framesPassed = Math.floor(this.timer / this.frameDuration);
    return framesPassed % this.frames.length;
  }

  // The current frame itself
  getFrame() {
    return this.frames[this.getFrameIndex()];
  }
}
