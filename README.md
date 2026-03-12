# Math Mini-Game

A small browser-based math quiz game built with HTML, CSS, and JavaScript.

## ✅ Gameplay
- The game asks **random basic arithmetic questions** (add, subtract, multiply).
- You must answer **5 questions correctly** to win.
- The game tracks a **streak** (consecutive wins) and a **best time** (fastest win).

## 🎮 Features
- ✅ Tracks current streak and best streak across browser sessions (via `localStorage`)
- ✅ Stores fastest win time (best time)
- ✅ Logs longest streak history to the browser console (`streakLogger.js`)
- ✅ Reset stats button to clear streak and best time

## 📦 Files
- `index.html` – game UI
- `styles.css` – styles
- `game.js` – game logic
- `streakLogger.js` – logs longest streaks to console and stores history

## 🚀 Run locally
1. Open `index.html` in your browser.
2. Answer the questions.

## 🛠️ Notes
- This is a purely client-side app; everything runs in the browser.
- Stats are stored using browser `localStorage`.
