// Logs longest streaks to the console and keeps a small history in localStorage.
// This module is intentionally small and non-invasive: it simply records
// best-streak updates so you can later view them in the console.

const STREAK_HISTORY_KEY = "mathMiniGame:streakHistory";

function loadHistory() {
  try {
    const raw = localStorage.getItem(STREAK_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STREAK_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore failures (e.g. storage disabled)
  }
}

function addToHistory(streak) {
  const history = loadHistory();
  history.push({ streak, at: new Date().toISOString() });
  // Keep only the last 20 entries.
  if (history.length > 20) history.splice(0, history.length - 20);
  saveHistory(history);
  return history;
}

function getHistory() {
  return loadHistory();
}

function logLongestStreak(bestStreak) {
  const history = addToHistory(bestStreak);
  console.log(
    `%cNew longest streak: ${bestStreak} ✅`,
    "color: #0b752e; font-weight: 700;"
  );
  console.log("Recent longest-streak history:", history);
}

window.logLongestStreak = logLongestStreak;
window.getLongestStreakHistory = getHistory;
