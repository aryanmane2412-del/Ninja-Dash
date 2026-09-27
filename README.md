# 🥷 Ninja Dash

A 2D platform game that runs in the browser, with **10 levels**. Run, jump and
dodge monsters from the Training grounds to the Final Level. On the way you'll
cross forests, dark nights, ruins, snowy mountains, a spike-trapped temple, lava
fields, the Shadow Realm and a Ninja Fortress. Reach the last gate to complete the game.

Ninja Dash is built with plain **HTML, CSS and JavaScript** on the Canvas API.
It has no frameworks, no installs, no internet connection, no backend and no accounts.

---

## ▶️ How to run

1. Download or copy the whole **`Ninja Dash`** folder.
2. Double-click **`index.html`**.
3. It opens in your browser. Click **Start Game**.

That's it. There's nothing to install and no server is needed. The game works
completely offline.

**Browsers:** current Chrome, Edge, Firefox or Safari, on desktop, phone or tablet.

> **On a phone:** copy the folder to the phone and open `index.html` in its
> browser, or use one of the hosting options under
> [Packaging and sharing](#-packaging-and-sharing).

---

## 🎮 How to play

Get from the start of each level to the **red torii gate** at the end.

| | |
|---|---|
| 🪙 Coin | **+10 points** |
| ⛩️ Finish gate | Completes the level: **+100 points**, plus **+50 for each heart** you still have |
| 🏮 Lantern | A **checkpoint**. It lights up when you pass it and saves your progress in the level. |
| ❤️ Hearts | You have **3**. After a hit you blink and are safe for about 1.5 seconds. |
| 🟣 Purple enemies | Patrol back and forth |
| 🟠 Orange enemies | Walk in along the ground (from Level 3 on) |
| ⚠️ Spikes | Cost a heart, like an enemy |
| 🕳️ Pits and 🔥 lava | Cost a heart and send you back to your last checkpoint (or the start) |
| Moving platforms | Carry you along. Stand still and ride. |
| Cracked platforms | Shake, then **fall**, half a second after you land. Keep moving! |
| Hidden platforms | Almost invisible until you get close. Look high up for secret coins. |

**Losing all your hearts** shows the Game Over screen. From there you can
**Continue from Checkpoint** (full hearts, back at the last lantern you lit),
**Restart Level**, go to **Level Select** or return to the **Main Menu**.

Inside each level the difficulty still rises every **30 seconds**: enemies get
faster and walkers appear more often.

### The 10 levels

| # | Level | What's new |
|---|---|---|
| 1 | Training | Easy jumps, few enemies, lots of coins |
| 2 | Forest | More platforms and enemies, longer gaps, first checkpoint |
| 3 | Night | Darkness with light only around you, stepping stones, faster enemies |
| 4 | Ruins | Narrow pillars and moving platforms |
| 5 | Mountain | Big gaps and hard jumps |
| 6 | Temple | Spike traps, more enemies, hidden coin rooms |
| 7 | Lava Zone | Lava pits and falling platforms |
| 8 | Shadow Realm | Very dark, few safe places, mostly small platforms |
| 9 | Ninja Fortress | Every trap together, lots of enemies |
| 10 | Final Level | The longest and hardest run. Finish it to **complete the game**! (No boss.) |

**Unlocking:** Level 1 is open from the start. Finishing a level unlocks the
next one. Your progress is saved in the browser, so it's still there after you
close it. You can replay any unlocked level from **Level Select**.

---

## ⌨️ Controls

### Keyboard

| Action | Keys |
|---|---|
| Move left | **A** or **←** |
| Move right | **D** or **→** |
| Jump | **Space** |
| Pause / Resume | **P** or **Esc** |

### Touch screens (phones and tablets)

On-screen buttons appear automatically on touch screens, outside the game area.

| Button | Action |
|---|---|
| **◀** / **▶** | Hold to move |
| **JUMP** | Jump (you can hold ▶ and tap JUMP at the same time) |
| **❚❚** | Pause |

- **Portrait:** the buttons are in a bar below the game.
- **Landscape:** ◀ ▶ are on the left, and ❚❚ and JUMP are on the right, under your thumbs.

### Menus
- **Main menu:** Start Game (or *Continue · Level N*), Level Select, high score, Sound on/off, Music on/off
- **Level Select:** all 10 levels. ✓ = completed (with your best score), ▶ = unlocked, 🔒 = locked. Also *Reset progress*.
- **Pause:** Resume, Restart Level, Main Menu, Sound on/off, Music on/off
- **Level Complete:** level name, score, coins, time and hearts left, then Next Level, Replay Level, Level Select or Main Menu
- **Game Over:** Continue from Checkpoint, Restart Level, Level Select, Main Menu
- **Game Completed** (after Level 10): total score, total coins, levels completed, total time, then Play Again, Level Select or Main Menu

The game **pauses automatically** if you switch tabs or minimize the browser.

---

## ✨ Features

- 10 hand-designed levels with a scrolling camera, each with its own look
- Checkpoints, pits, lava, spikes, moving, falling and hidden platforms
- Level unlocking and saved progress, Level Select, Level Complete and Game Completed screens
- Smooth movement, gravity, jumping and one-way platforms (jump up through them, land on top)
- Patrolling and walking enemies, with rectangle collision detection
- 3-heart health system with temporary invincibility after a hit
- Coins, score, a finish bonus and a **high score** saved in the browser
- Difficulty that rises every 30 seconds within each level
- Sound effects and looping background music, each with an on/off switch
- Touch controls for phones and tablets, with a responsive layout
- Animated ninja (idle, run, jump, fall, hurt), particle effects and screen shake
- Sharp graphics on high-resolution screens

---

## 📁 Project structure

```
Ninja Dash/
├── index.html            The page: menus, HUD, canvas, touch buttons
├── style.css             All styling and the responsive layout
├── README.md             This file
├── js/
│   ├── graphics.js       Game size, sharp rendering, drawing helpers
│   ├── input.js          Keyboard and touch input
│   ├── animation.js      Animation class (frames + timer)
│   ├── levels.js         ★ The 10 levels, as plain data (edit levels here)
│   ├── platform.js       Platforms (normal, moving, falling, hidden) and collision
│   ├── player.js         The ninja: movement, physics, health, animation, drawing
│   ├── enemy.js          Enemies: patrol, walk, animation, drawing
│   ├── coin.js           Coins: spin, float, glow
│   ├── difficulty.js     Difficulty over time
│   ├── background.js     The 10 visual themes and scrolling backgrounds
│   ├── effects.js        Particles, confetti, floating text, screen shake
│   ├── levelObjects.js   Spikes, lava, checkpoint lanterns, finish gate
│   ├── hud.js            Score, coins, hearts, level, difficulty and time display
│   ├── gameState.js      Which screen shows in each state; fills the menus
│   ├── audio.js          Sound effects, music, on/off switches
│   ├── highScore.js      Saving the high score
│   ├── progress.js       Saving unlocked and completed levels
│   └── game.js           Main file: builds levels, runs the game loop, handles screens
├── assets/
│   ├── audio/            click, coin, damage, gameover, jump, checkpoint,
│   │                     levelcomplete, music (.wav)
│   └── images/           favicon.svg, shuriken.svg
└── tools/                Optional helpers for developers (need Node.js)
    ├── generate-sounds.js   Re-creates the sound files
    └── check-levels.js      Proves every level can be finished
```

The scripts must load in the order listed in `index.html`, with `game.js` last.

---

## 📦 Packaging and sharing

The game is a folder of static files, so there's no build step.

**Share as a ZIP.** Zip the `Ninja Dash` folder. Whoever receives it unzips it
and opens `index.html`. You can leave out `tools/` and `README.md` if you like.

**Put it online (optional, still no backend):**
- **itch.io:** zip the folder so `index.html` is at the top level of the zip,
  upload it as an *HTML* game and tick "This file will be played in the browser".
- **GitHub Pages / Netlify:** upload the folder. `index.html` is the start page.

---

## 🔧 Customizing

| What | Where |
|---|---|
| **Level layouts** (platforms, coins, enemies, spikes, lava, checkpoints, finish) | `js/levels.js`. Each level is a list of simple entries like `ledge(260, 320, 140)`. |
| Level colors and scenery | `js/background.js` (`THEMES`) |
| Run speed, jump height, gravity, hearts | `js/player.js` (`speed`, `jumpStrength`, `gravity`, `maxHealth`) |
| Points per coin, finish bonus | `js/game.js` (`COIN_POINTS`, `LEVEL_BONUS`, `HEART_BONUS`) |
| How fast it gets harder | `js/difficulty.js` |
| Volume | `js/audio.js` (`SOUND_VOLUME`, `MUSIC_VOLUME`) |

**After editing a level**, check it's still possible with
[Node.js](https://nodejs.org):

```
node tools/check-levels.js
```

It uses the game's real jump physics to test thousands of jumps. It reports
whether the finish, every checkpoint and every coin can be reached, and it warns
about enemies or spikes placed on a checkpoint. `node tools/check-levels.js 5`
checks only Level 5.

**Re-creating the sounds (optional):** `node tools/generate-sounds.js`.
The game itself never needs Node.js.

---

## 🔒 Privacy and offline use

- No internet connection, server, database, accounts, tracking or API keys.
- Everything the game uses (scripts, styles, images and sounds) is inside this folder.
- The browser's `localStorage` on your own device keeps only four values:
  `ninjaDash.highScore`, `ninjaDash.progress` (unlocked and completed levels),
  `ninjaDash.soundOn` and `ninjaDash.musicOn`. Clearing your browser's site
  data resets them, and so does *Reset progress* in Level Select.
- If a sound file is missing, or saving is blocked (for example in a private
  window), the game keeps working. It just goes silent or doesn't remember progress.

---

## 🙌 Credits

Code, graphics (drawn with code), level designs and sound effects/music
(generated by `tools/generate-sounds.js`) were all made for this project.
