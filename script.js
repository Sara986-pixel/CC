// =====================================================
// 1. YOUR QUESTIONS  ✏️  (these are placeholders, edit them!)
// -----------------------------------------------------
// question : the question text
// options  : exactly 4 choices
// answer   : index of the CORRECT option, counting from 0
//            (0 = first option, 1 = second, 2 = third, 3 = fourth)
// =====================================================
const questions = [
  {
    question: "What's my all-time favourite food?",
    options: ["Pizza", "Biryani", "Pasta", "Chocolate"],
    answer: 3
  },
  {
    question: "Where would I fly off to tomorrow if I could?",
    options: ["Paris", "Tokyo", "Maldives", "Switzerland"],
    answer: 3
  },
  {
    question: "What's my go-to way to relax?",
    options: ["Binge a series", "Listen to music", "Sleep", "Scroll reels"],
    answer: 1
  },
  {
    question: "Am I a morning person or a night owl?",
    options: ["Early bird 🐦", "Night owl 🦉", "Depends on the exam", "Whenever there's food"],
    answer: 1
  },
  {
    question: "My favourite colour is...",
    options: ["Pink", "Purple", "Blue", "Black"],
    answer: 0
  },
  {
    question: "What's my biggest pet peeve?",
    options: ["Slow wifi", "Loud chewing", "Being late", "Unread messages"],
    answer: 0
  },
  {
    question: "What music vibe is on repeat for me?",
    options: ["Pop", "Lo-fi", "Bollywood", "K-pop"],
    answer: 2
  },
  {
    question: "My dream job would be...",
    options: ["Game developer", "Data scientist", "Travel vlogger", "Startup founder"],
    answer: 3
  },
  {
    question: "If I had one superpower, I'd pick...",
    options: ["Teleportation", "Invisibility", "Mind reading", "Time travel"],
    answer: 2
  },
  {
    question: "What's my most-used emoji?",
    options: ["😂", "😭", "✨", "💖"],
    answer: 2
  }
];

// =====================================================
// 2. FUN TEXT  ✏️  (change the messages if you like)
// =====================================================
const SHARE_TITLE = "How well do you know me ft. The one and only Sara";

const correctLines = [
  "Yesss! You really know me! 💖",
  "Okay wow, who told you?! ✨",
  "Correct! Bestie behaviour 😌",
  "You're good at this 🎉"
];
const wrongLines = [
  "Oop... not quite 🥺",
  "Nooo, that's not me! 😭",
  "Wrong! Did we even meet? 😤",
  "Ouch. Try harder next time 💔"
];

// Verdicts: checked from the top, first one that fits wins
const verdicts = [
  { min: 10, mood: "happy",   title: "Certified Bestie 👑",       text: "Perfect score! You know me better than I know myself." },
  { min: 8,  mood: "happy",   title: "Almost Sara's Twin 💜",     text: "Super impressive. Just a couple of slip-ups!" },
  { min: 5,  mood: "neutral", title: "Good Friend, Needs Homework 📚", text: "Not bad, but we need to hang out more." },
  { min: 2,  mood: "sad",     title: "Acquaintance Energy 😬",     text: "We should definitely get chai soon." },
  { min: 0,  mood: "sad",     title: "Who Even Are You? 😭",       text: "Have we met? Please introduce yourself." }
];

// =====================================================
// 3. PAGE ELEMENTS
// =====================================================
const $ = id => document.getElementById(id);

const startScreen  = $("start-screen");
const quizScreen   = $("quiz-screen");
const resultScreen = $("result-screen");

const sara   = $("sara");
const speech = $("speech");

const nameInput = $("name-input");
const startBtn  = $("start-btn");
const nextBtn   = $("next-btn");
const shareBtn  = $("share-btn");
const restartBtn = $("restart-btn");

const progressText = $("progress-text");
const scoreText    = $("score-text");
const progressBar  = $("progress-bar");
const questionEl   = $("question");
const optionsEl    = $("options");

const resultName   = $("result-name");
const finalScore   = $("final-score");
const verdictTitle = $("verdict-title");
const verdictText  = $("verdict-text");

// =====================================================
// 4. STATE
// =====================================================
let friendName = "Friend";
let current = 0;
let score = 0;
let lastShareText = "";

// =====================================================
// 5. SARA THE FIGURINE
// =====================================================
function setMood(mood, text) {
  sara.dataset.mood = mood;
  if (text) speech.textContent = text;
}

function react(animation) {
  sara.classList.remove("jump", "wobble");
  void sara.offsetWidth;            // restart the animation
  sara.classList.add(animation);
  setTimeout(() => sara.classList.remove(animation), 700);
}

function confettiBurst() {
  const icons = ["💖", "✨", "🎉", "💜", "⭐", "🫧"];
  for (let i = 0; i < 12; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.textContent = icons[Math.floor(Math.random() * icons.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 80;
    piece.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--dy", `${Math.sin(angle) * distance - 30}px`);
    sara.appendChild(piece);
    setTimeout(() => piece.remove(), 1000);
  }
}

const pick = list => list[Math.floor(Math.random() * list.length)];

// =====================================================
// 6. BACKGROUND BUBBLES (click to pop)
// =====================================================
const bubbleLayer = $("bubbles");

function makeBubble() {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  const size = 24 + Math.random() * 70;
  bubble.style.width = bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.animationDuration = `${12 + Math.random() * 14}s`;
  bubble.style.animationDelay = `${-Math.random() * 20}s`;
  bubble.addEventListener("click", () => {
    bubble.classList.add("pop");
    setTimeout(() => { bubble.remove(); makeBubble(); }, 260);
  });
  bubbleLayer.appendChild(bubble);
}
for (let i = 0; i < 16; i++) makeBubble();

// =====================================================
// 7. QUIZ FLOW
// =====================================================
function show(screen) {
  [startScreen, quizScreen, resultScreen].forEach(s => (s.hidden = true));
  screen.hidden = false;
}

function startQuiz() {
  friendName = nameInput.value.trim() || "Friend";
  current = 0;
  score = 0;
  show(quizScreen);
  setMood("happy", `Hi ${friendName}! Let's see what you've got 😏`);
  react("jump");
  showQuestion();
}

function showQuestion() {
  const q = questions[current];

  progressText.textContent = `Question ${current + 1} of ${questions.length}`;
  scoreText.textContent = `Score: ${score}`;
  progressBar.style.width = `${(current / questions.length) * 100}%`;

  questionEl.textContent = q.question;
  nextBtn.hidden = true;
  optionsEl.innerHTML = "";

  q.options.forEach((text, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", () => selectAnswer(index));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(chosen) {
  const q = questions[current];
  const buttons = optionsEl.querySelectorAll(".option");

  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === q.answer) btn.classList.add("correct");
    if (index === chosen && chosen !== q.answer) btn.classList.add("wrong");
  });

  if (chosen === q.answer) {
    score++;
    setMood("happy", pick(correctLines));
    react("jump");
    confettiBurst();
  } else {
    setMood("sad", pick(wrongLines));
    react("wobble");
  }

  scoreText.textContent = `Score: ${score}`;
  nextBtn.textContent = current === questions.length - 1 ? "See results 🎀" : "Next →";
  nextBtn.hidden = false;
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  show(resultScreen);
  progressBar.style.width = "100%";

  const total = questions.length;
  const verdict = verdicts.find(v => score >= v.min);

  resultName.textContent = `${friendName}, you scored`;
  finalScore.textContent = `${score}/${total}`;
  verdictTitle.textContent = verdict.title;
  verdictText.textContent = verdict.text;

  setMood(verdict.mood, verdict.mood === "sad" ? "We need to talk... 🥲" : "Thanks for playing! 💕");
  react(verdict.mood === "sad" ? "wobble" : "jump");
  if (verdict.mood === "happy") confettiBurst();

  lastShareText = `I scored ${score}/${total} on "${SHARE_TITLE}" and got: ${verdict.title} Can you beat me? 💖`;
  shareBtn.textContent = "Copy my result 💌";
}

function restart() {
  show(startScreen);
  setMood("happy", "Hiii! I'm Sara. Think you know me? 💖");
  react("jump");
}

async function shareResult() {
  try {
    await navigator.clipboard.writeText(lastShareText);
    shareBtn.textContent = "Copied! ✨";
    setTimeout(() => (shareBtn.textContent = "Copy my result 💌"), 1800);
  } catch (err) {
    window.prompt("Copy this and send it to Sara:", lastShareText);
  }
}

// =====================================================
// 8. EVENTS
// =====================================================
startBtn.addEventListener("click", startQuiz);
nameInput.addEventListener("keydown", e => { if (e.key === "Enter") startQuiz(); });
nextBtn.addEventListener("click", nextQuestion);
shareBtn.addEventListener("click", shareResult);
restartBtn.addEventListener("click", restart);
