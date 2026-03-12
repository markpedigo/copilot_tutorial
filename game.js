const MAX_CORRECT = 5;

const questionEl = document.getElementById("question");
const scoreEl = document.getElementById("score");
const feedbackEl = document.getElementById("feedback");
const form = document.getElementById("answer-form");
const answerInput = document.getElementById("answer");
const controls = document.getElementById("controls");
const restartButton = document.getElementById("restart");

let currentAnswer = null;
let correctCount = 0;

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

function updateScore() {
  scoreEl.textContent = `Correct: ${correctCount} / ${MAX_CORRECT}`;
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
  feedbackEl.textContent = "🎉 You won! Great work!";
  feedbackEl.className = "feedback success";
  controls.hidden = false;
  form.querySelector("button").disabled = true;
  answerInput.disabled = true;
}

function resetGame() {
  correctCount = 0;
  updateScore();
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
  }
});

restartButton.addEventListener("click", resetGame);

// Initialize game on first load.
resetGame();
