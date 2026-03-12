const MAX_CORRECT = 5;
const STORAGE_KEY = "mathMiniGame:stats";

const questionEl = document.getElementById("question");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const bestEl = document.getElementById("best");
const feedbackEl = document.getElementById("feedback");
const form = document.getElementById("answer-form");
const answerInput = document.getElementById("answer");
const controls = document.getElementById("controls");
const restartButton = document.getElementById("restart");
const resetStatsButton = document.getElementById("reset-stats");

let currentAnswer = null;
let correctCount = 0;
let runStart = null;
let currentStreak = 0;
let bestStreak = 0;
let bestTime = null;
let previousBestStreak = 0;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickQuestion() {
  const operations = [
    { symbol: "+", fn: (a, b) => a + b },
    { symbol: "-", fn: (a, b) => a - b },
    { symbol: "×", fn: (a, b) => a * b },
  ];

  const op = operations[randomInt(0, operations.length - 1)];

  // Keep numbers small so folks can compute without a calculator.
  const a = randomInt(1, 12);
  const b = randomInt(1, 12);
  const questionText = `${a} ${op.symbol} ${b} = ?`;
  const answer = op.fn(a, b);

  return { questionText, answer };
}

function formatTime(ms) {
  if (ms == null) return "—";
  const seconds = ms / 1000;
  return seconds < 10 ? `${seconds.toFixed(1)}s` : `${seconds.toFixed(0)}s`;
}

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    currentStreak = typeof parsed.currentStreak === "number" ? parsed.currentStreak : 0;
    bestStreak = parsed.bestStreak || 0;
    bestTime = typeof parsed.bestTime === "number" ? parsed.bestTime : null;
  } catch {
    currentStreak = 0;
    bestStreak = 0;
    bestTime = null;
  }
  previousBestStreak = bestStreak;
}

function saveStats() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ currentStreak, bestStreak, bestTime })
  );
}

function maybeLogNewBestStreak() {
  if (typeof window.logLongestStreak !== "function") return;
  if (bestStreak > previousBestStreak) {
    window.logLongestStreak(bestStreak);
    previousBestStreak = bestStreak;
  }
}

function resetStats() {
  currentStreak = 0;
  bestStreak = 0;
  bestTime = null;
  previousBestStreak = 0;
  saveStats();
  updateStreaks();
  feedbackEl.textContent = "Stats cleared!";
  feedbackEl.className = "feedback";
}

function updateScore() {
  scoreEl.textContent = `Correct: ${correctCount} / ${MAX_CORRECT}`;
}

function updateStreaks() {
  streakEl.textContent = `Streak: ${currentStreak}`;
  bestEl.textContent = `Best: ${bestStreak} win${bestStreak === 1 ? "" : "s"} • ${formatTime(bestTime)}`;
}

function setQuestion() {
  const { questionText, answer } = pickQuestion();
  currentAnswer = answer;
  questionEl.textContent = questionText;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  answerInput.value = "";
  answerInput.focus();
}

function celebrateWin() {
  const elapsed = Date.now() - runStart;
  const timeString = formatTime(elapsed);

  currentStreak += 1;
  bestStreak = Math.max(bestStreak, currentStreak);
  bestTime = bestTime == null ? elapsed : Math.min(bestTime, elapsed);
  saveStats();
  maybeLogNewBestStreak();
  updateStreaks();

  feedbackEl.textContent = `🎉 You won! Time: ${timeString}`;
  feedbackEl.className = "feedback success";
  controls.hidden = false;
  form.querySelector("button").disabled = true;
  answerInput.disabled = true;
}

function resetGame() {
  correctCount = 0;
  updateScore();
  updateStreaks();
  runStart = Date.now();
  controls.hidden = true;
  form.querySelector("button").disabled = false;
  answerInput.disabled = false;
  setQuestion();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const raw = answerInput.value.trim();
  if (!raw) {
    return;
  }

  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    feedbackEl.textContent = "Please enter a valid number.";
    feedbackEl.className = "feedback error";
    return;
  }

  if (parsed === currentAnswer) {
    correctCount += 1;
    updateScore();

    if (correctCount >= MAX_CORRECT) {
      celebrateWin();
      return;
    }

    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.className = "feedback success";
    setTimeout(() => {
      setQuestion();
    }, 700);
  } else {
    feedbackEl.textContent = "❌ Not quite — try again.";
    feedbackEl.className = "feedback error";
    answerInput.select();
    currentStreak = 0;
    saveStats();
    updateStreaks();
  }
});

restartButton.addEventListener("click", resetGame);
resetStatsButton.addEventListener("click", () => {
  resetStats();
  resetGame();
});

// Initialize game on first load.
loadStats();
resetGame();
