import { meals, questions, types } from "./data.js";
import { buildReportFields, pickTypeFromAnswers } from "./logic.js";

const appState = {
  index: 0,
  answers: []
};

const home = document.querySelector("#home");
const quiz = document.querySelector("#quiz");
const result = document.querySelector("#result");
const startTest = document.querySelector("#startTest");
const rejectBtn = document.querySelector("#rejectBtn");
const rejectNotice = document.querySelector("#rejectNotice");
const decideMeal = document.querySelector("#decideMeal");
const mealFromResult = document.querySelector("#mealFromResult");
const restartBtn = document.querySelector("#restartBtn");
const cancelQuiz = document.querySelector("#cancelQuiz");
const backBtn = document.querySelector("#backBtn");
const subjectName = document.querySelector("#subjectName");
const sampleStatus = document.querySelector("#sampleStatus");
const questionCounter = document.querySelector("#questionCounter");
const progressLabel = document.querySelector("#progressLabel");
const progressBar = document.querySelector("#progressBar");
const questionText = document.querySelector("#questionText");
const optionsGrid = document.querySelector("#optionsGrid");
const reportFields = document.querySelector("#reportFields");
const typeGrid = document.querySelector("#typeGrid");
const mealDialog = document.querySelector("#mealDialog");
const mealTitle = document.querySelector("#mealTitle");
const mealResult = document.querySelector("#mealResult");
const rerollMeal = document.querySelector("#rerollMeal");

function setScreen(screen) {
  home.hidden = screen !== "home";
  quiz.hidden = screen !== "quiz";
  result.hidden = screen !== "result";

  if (screen === "home") {
    home.classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  home.classList.remove("is-active");
  document.querySelector(`#${screen}`).scrollIntoView({ behavior: "smooth", block: "start" });
}

function startQuiz() {
  appState.index = 0;
  appState.answers = [];
  sampleStatus.textContent = "饭点信号采集中，疑似早八/加班/夜宵样本";
  setScreen("quiz");
  renderQuestion();
  setTimeout(() => subjectName.focus(), 350);
}

function renderQuestion() {
  const current = questions[appState.index];
  const currentNumber = appState.index + 1;
  questionCounter.textContent = `${currentNumber} / ${questions.length}`;
  progressLabel.textContent = currentNumber < questions.length ? "本土饭点语境校准中" : "最终饭点波形确认";
  progressBar.style.width = `${(currentNumber / questions.length) * 100}%`;
  questionText.textContent = current.text;
  backBtn.disabled = appState.index === 0;

  optionsGrid.replaceChildren(
    ...current.options.map((option) => {
      const button = document.createElement("button");
      button.className = "option-btn";
      button.type = "button";
      button.innerHTML = `<strong>${option.title}</strong><span>${option.desc}</span>`;
      button.addEventListener("click", () => selectOption(option));
      return button;
    })
  );
}

function selectOption(option) {
  appState.answers[appState.index] = option.add;

  if (appState.index < questions.length - 1) {
    appState.index += 1;
    renderQuestion();
    return;
  }

  renderReport();
  setScreen("result");
}

function goBack() {
  if (appState.index === 0) return;
  appState.index -= 1;
  renderQuestion();
}

function pickType() {
  return pickTypeFromAnswers(types, appState.answers, subjectName.value.trim());
}

function renderReport() {
  const type = pickType();
  const subject = subjectName.value.trim() || "未署名饭桶";
  const fields = buildReportFields(type, subject);

  reportFields.replaceChildren(
    ...fields.map(({ label, value, wide }) => {
      const wrap = document.createElement("div");
      wrap.className = `report-field${wide ? " is-wide" : ""}`;

      const dt = document.createElement("dt");
      dt.textContent = label;

      const dd = document.createElement("dd");
      dd.textContent = value;

      wrap.append(dt, dd);
      return wrap;
    })
  );
}

function renderArchive() {
  typeGrid.replaceChildren(
    ...types.map((type) => {
      const card = document.createElement("article");
      card.className = "type-card";
      card.innerHTML = `<b>${type.code}</b><h3>${type.name}</h3><p>${type.summary}</p>`;
      return card;
    })
  );
}

function showRejectNotice() {
  rejectNotice.hidden = false;
  rejectNotice.classList.remove("is-hot");
  window.requestAnimationFrame(() => rejectNotice.classList.add("is-hot"));
}

function pickMeal() {
  const meal = meals[Math.floor(Math.random() * meals.length)];
  mealTitle.textContent = "今日饭点判定";
  mealResult.innerHTML = `<strong>${meal.name}</strong><span>${meal.reason}</span>`;
}

function openMealDialog() {
  pickMeal();
  if (typeof mealDialog.showModal === "function") {
    mealDialog.showModal();
    return;
  }

  mealDialog.setAttribute("open", "");
}

startTest.addEventListener("click", startQuiz);
rejectBtn.addEventListener("click", showRejectNotice);
decideMeal.addEventListener("click", openMealDialog);
mealFromResult.addEventListener("click", openMealDialog);
rerollMeal.addEventListener("click", pickMeal);
restartBtn.addEventListener("click", startQuiz);
cancelQuiz.addEventListener("click", () => setScreen("home"));
backBtn.addEventListener("click", goBack);

renderArchive();
