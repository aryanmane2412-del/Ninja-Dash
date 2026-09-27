# 🥷 Ninja Dash

A 2D platform game that runs in the browser. Run, jump and dodge monsters
across moonlit platforms, collect coins, and survive as the game speeds up.

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

Move left and right, jump between platforms and collect the gold coins.
Enemies patrol the platforms, and more of them walk in along the ground over time.
Touching an enemy costs a heart. Lose all **3 hearts** and the game is over.

Every **30 seconds** the difficulty goes up (up to level 10): enemies move
faster and new ones appear more often. Try to beat your high score!

| | |
|---|---|
| 🪙 Coin | **+10 points** |
| ❤️ Hearts | You start with **3**. After a hit you blink and are safe for about 1.5 seconds. |
| 🟣 Purple enemies | Patrol back and forth on a platform |
| 🟠 Orange enemies | Walk across the ground and leave the screen |

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
- **Main menu:** Start Game, Sound on/off, Music on/off, Reset high score
- **Pause:** Resume, Restart, Main Menu, Sound on/off, Music on/off
- **Game Over:** final score, time survived, difficulty reached, best score, Restart, Main Menu

The game **pauses automatically** if you switch tabs or minimize the browser.

---

## ✨ Features

- Smooth movement, gravity, jumping and one-way platforms (jump up through them, land on top)
- Patrolling and walking enemies, with rectangle collision detection
- 3-heart health system with temporary invincibility after a hit
- Spinning collectible coins and a score counter
- Difficulty that rises every 30 seconds (faster enemies, more spawns)
- Game states: Menu, Playing, Paused, Game Over
- **High score** saved in the browser, so it's still there after you close it
- Sound effects and looping background music, each with an on/off switch
- Touch controls for phones and tablets, with a responsive layout
- Animated ninja (idle, run, jump, fall, hurt), with squash and stretch
- Night scene with a moon, twinkling stars, drifting clouds and a pagoda
- Particle effects: jump and landing dust, coin sparkles, hit sparks, a game-over burst, screen shake
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
│   ├── platform.js       Platforms and rectangle collision
│   ├── player.js         The ninja: movement, physics, health, animation, drawing
│   ├── enemy.js          Enemies: patrol, walk, animation, drawing
│   ├── coin.js           Coins: spin, float, glow
│   ├── difficulty.js     Difficulty level over time
│   ├── background.js     Night-sky background
│   ├── effects.js        Particles, floating text, screen shake
│   ├── hud.js            Score, hearts, difficulty and time display
│   ├── gameState.js      Menu / Playing / Paused / Game Over screens
│   ├── audio.js          Sound effects, music, on/off switches
│   ├── highScore.js      Saving the high score
│   └── game.js           Main file: sets up the level and runs the game loop
├── assets/
│   ├── audio/            click, coin, damage, gameover, jump, music (.wav)
│   └── images/           favicon.svg, shuriken.svg
└── tools/
    └── generate-sounds.js   Optional: re-creates the sound files (needs Node.js)
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

The main settings are named constants near the top of each file:

| What | Where |
|---|---|
| Run speed, jump height, gravity, hearts | `js/player.js` (`speed`, `jumpStrength`, `gravity`, `maxHealth`) |
| Points per coin, walker speed | `js/game.js` (`COIN_POINTS`, `WALKER_SPEED`) |
| Level layout (platforms, enemies, coins) | `js/game.js` (`platforms`, `createEnemies()`, `createCoins()`) |
| How fast it gets harder | `js/difficulty.js` (all `DIFFICULTY_…`, `SPEED_…` and `SPAWN_…` constants) |
| Volume | `js/audio.js` (`SOUND_VOLUME`, `MUSIC_VOLUME`) |

**Re-creating the sounds (optional):** with [Node.js](https://nodejs.org)
installed, run `node tools/generate-sounds.js` from the project folder. The
game itself never needs Node.js.

---

## 🔒 Privacy and offline use

- No internet connection, server, database, accounts, tracking or API keys.
- Everything the game uses (scripts, styles, images and sounds) is inside this folder.
- The browser's `localStorage` on your own device keeps only three values:
  `ninjaDash.highScore`, `ninjaDash.soundOn` and `ninjaDash.musicOn`.
  Clearing your browser's site data resets them.
- If a sound file is missing, or saving is blocked (for example in a private
  window), the game keeps working. It just goes silent or doesn't remember the setting.

---

## 🙌 Credits

Code, graphics (drawn with code) and sound effects/music (generated by
`tools/generate-sounds.js`) were all made for this project.
