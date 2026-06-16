import { mealModes, meals, questions, types } from "./data.js";
import {
  buildArchiveRecord,
  createArchiveClient,
  getArchiveConfig,
  isArchiveConfigured,
  isValidEmail,
  isValidOtp,
  normalizeEmail,
  normalizeNickname
} from "./auth.js";
import { FANTONG_CONFIG } from "./config.js";
import {
  METRIC_LABELS,
  buildLeaderboard,
  buildMealDecision,
  buildPosterPayload,
  buildReportFields,
  findMealMode,
  pickMealForMode,
  pickTypeFromAnswers
} from "./logic.js";

const appState = {
  index: 0,
  answers: [],
  currentType: null,
  currentPosterPayload: null,
  currentPosterUrl: null,
  currentMealModeId: "all",
  currentMealDecision: null,
  lastMealId: "",
  archiveClientPromise: null,
  archiveCooldownTimer: null
};

const PROGRESS_LABELS = [
  "正在比对早八续航行为",
  "正在扫描食堂路线偏好",
  "正在识别外卖满减敏感度",
  "正在判断拼单社交波形",
  "正在读取今晚吃啥纠结值",
  "正在校准夜宵复活迹象",
  "正在分析冰箱清仓能力",
  "最终饭点波形确认"
];

const home = document.querySelector("#home");
const quiz = document.querySelector("#quiz");
const result = document.querySelector("#result");
const startTest = document.querySelector("#startTest");
const rejectBtn = document.querySelector("#rejectBtn");
const rejectNotice = document.querySelector("#rejectNotice");
const decideMeal = document.querySelector("#decideMeal");
const openMealTool = document.querySelector("#openMealTool");
const homeMealMode = document.querySelector("#homeMealMode");
const homeMealSummary = document.querySelector("#homeMealSummary");
const mealFromResult = document.querySelector("#mealFromResult");
const restartBtn = document.querySelector("#restartBtn");
const posterBtn = document.querySelector("#posterBtn");
const saveArchiveBtn = document.querySelector("#saveArchiveBtn");
const cancelQuiz = document.querySelector("#cancelQuiz");
const backBtn = document.querySelector("#backBtn");
const subjectName = document.querySelector("#subjectName");
const sampleStatus = document.querySelector("#sampleStatus");
const questionCounter = document.querySelector("#questionCounter");
const progressLabel = document.querySelector("#progressLabel");
const progressBar = document.querySelector("#progressBar");
const questionText = document.querySelector("#questionText");
const optionsGrid = document.querySelector("#optionsGrid");
const metricsPanel = document.querySelector("#metricsPanel");
const reportFields = document.querySelector("#reportFields");
const posterStatus = document.querySelector("#posterStatus");
const posterPreviewWrap = document.querySelector("#posterPreviewWrap");
const posterPreview = document.querySelector("#posterPreview");
const leaderboardGrid = document.querySelector("#leaderboardGrid");
const typeGrid = document.querySelector("#typeGrid");
const mealDialog = document.querySelector("#mealDialog");
const mealTitle = document.querySelector("#mealTitle");
const mealModeGrid = document.querySelector("#mealModeGrid");
const mealResult = document.querySelector("#mealResult");
const mealMeta = document.querySelector("#mealMeta");
const rerollMeal = document.querySelector("#rerollMeal");
const copyMeal = document.querySelector("#copyMeal");
const archiveDialog = document.querySelector("#archiveDialog");
const archiveForm = document.querySelector("#archiveForm");
const archiveNickname = document.querySelector("#archiveNickname");
const archiveEmail = document.querySelector("#archiveEmail");
const archiveOtp = document.querySelector("#archiveOtp");
const archiveConsent = document.querySelector("#archiveConsent");
const sendArchiveCode = document.querySelector("#sendArchiveCode");
const verifyArchiveBtn = document.querySelector("#verifyArchiveBtn");
const archiveStatus = document.querySelector("#archiveStatus");
const archiveSuccess = document.querySelector("#archiveSuccess");

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
  appState.currentType = null;
  appState.currentPosterPayload = null;
  sampleStatus.textContent = "饭点信号采集中，疑似早八/加班/夜宵样本";
  setScreen("quiz");
  renderQuestion();
  setTimeout(() => subjectName.focus(), 350);
}

function renderQuestion() {
  const current = questions[appState.index];
  const currentNumber = appState.index + 1;
  const selectedAnswer = appState.answers[appState.index];
  questionCounter.textContent = `${currentNumber} / ${questions.length}`;
  progressLabel.textContent = PROGRESS_LABELS[appState.index];
  progressBar.style.width = `${(currentNumber / questions.length) * 100}%`;
  questionText.textContent = current.text;
  backBtn.disabled = appState.index === 0;

  optionsGrid.replaceChildren(
    ...current.options.map((option) => {
      const button = document.createElement("button");
      button.className = "option-btn";
      button.type = "button";
      button.setAttribute("aria-pressed", "false");
      if (selectedAnswer && option.add.join("|") === selectedAnswer.join("|")) {
        button.classList.add("is-selected");
        button.setAttribute("aria-pressed", "true");
      }
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

function clearPosterPreview() {
  if (appState.currentPosterUrl) {
    URL.revokeObjectURL(appState.currentPosterUrl);
    appState.currentPosterUrl = null;
  }

  posterPreview.removeAttribute("src");
  posterPreviewWrap.hidden = true;
}

function showPosterPreview(blob, filename) {
  clearPosterPreview();
  const url = URL.createObjectURL(blob);
  appState.currentPosterUrl = url;
  posterPreview.src = url;
  posterPreview.alt = `${filename} 海报预览`;
  posterPreviewWrap.hidden = false;
  return url;
}

function setArchiveStatus(message, tone = "neutral") {
  archiveStatus.textContent = message;
  archiveStatus.dataset.tone = tone;
}

function resetArchiveSuccess() {
  archiveSuccess.hidden = true;
  archiveSuccess.textContent = "";
}

function getArchiveService() {
  const config = getArchiveConfig(FANTONG_CONFIG);
  if (!isArchiveConfigured(config)) {
    throw new Error("档案服务还没配置。请先在 config.js 填入 Supabase URL 和 anon public key。");
  }

  if (!appState.archiveClientPromise) {
    appState.archiveClientPromise = createArchiveClient(config);
  }

  return appState.archiveClientPromise;
}

function startArchiveCooldown(seconds = 60) {
  let remaining = seconds;
  sendArchiveCode.disabled = true;
  sendArchiveCode.textContent = `${remaining}s 后重发`;

  window.clearInterval(appState.archiveCooldownTimer);
  appState.archiveCooldownTimer = window.setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      window.clearInterval(appState.archiveCooldownTimer);
      sendArchiveCode.disabled = false;
      sendArchiveCode.textContent = "发送验证码";
      return;
    }

    sendArchiveCode.textContent = `${remaining}s 后重发`;
  }, 1000);
}

function validateArchiveContact({ requireOtp = false } = {}) {
  const email = normalizeEmail(archiveEmail.value);
  const token = archiveOtp.value.trim();

  if (!archiveConsent.checked) {
    setArchiveStatus("请先同意保存邮箱和本次测试结果，研究所不能偷偷建档。", "error");
    return null;
  }

  if (!isValidEmail(email)) {
    setArchiveStatus("邮箱格式看起来不太像邮箱，研究所收不到验证码。", "error");
    archiveEmail.focus();
    return null;
  }

  if (requireOtp && !isValidOtp(token)) {
    setArchiveStatus("请输入邮件里的 6 位数字验证码。", "error");
    archiveOtp.focus();
    return null;
  }

  return { email, token };
}

function openArchiveDialog() {
  resetArchiveSuccess();
  const subject = appState.currentPosterPayload?.subject || subjectName.value.trim() || "未署名饭桶";
  archiveNickname.value = normalizeNickname(archiveNickname.value || subject);
  archiveOtp.value = "";

  const config = getArchiveConfig(FANTONG_CONFIG);
  if (isArchiveConfigured(config)) {
    setArchiveStatus("输入邮箱后发送验证码，验证成功即可把本次报告入库。");
  } else {
    setArchiveStatus("档案服务还没配置：请先在 config.js 填入 Supabase URL 和 anon public key。", "error");
  }

  if (typeof archiveDialog.showModal === "function") {
    archiveDialog.showModal();
    return;
  }

  archiveDialog.setAttribute("open", "");
}

async function sendArchiveOtp() {
  resetArchiveSuccess();
  const contact = validateArchiveContact();
  if (!contact) return;

  sendArchiveCode.disabled = true;
  setArchiveStatus("验证码发送中，研究所正在把邮件塞进传送带。");

  try {
    const service = await getArchiveService();
    const { error } = await service.sendOtp(contact.email);
    if (error) throw error;
    setArchiveStatus("验证码已发送，请查看邮箱。若没收到，可以 60 秒后再试。", "success");
    startArchiveCooldown();
  } catch (error) {
    sendArchiveCode.disabled = false;
    sendArchiveCode.textContent = "发送验证码";
    setArchiveStatus(error.message || "验证码发送失败，请稍后再试。", "error");
  }
}

async function verifyAndSaveArchive() {
  resetArchiveSuccess();
  if (!appState.currentType || !appState.currentPosterPayload) {
    setArchiveStatus("请先完成一次 FBI 饭桶行为识别，再保存档案。", "error");
    return;
  }

  const contact = validateArchiveContact({ requireOtp: true });
  if (!contact) return;

  verifyArchiveBtn.disabled = true;
  setArchiveStatus("验证码核验中，饭桶研究所正在给档案盖饭。");

  try {
    const service = await getArchiveService();
    const { data, error } = await service.verifyOtp(contact.email, contact.token);
    if (error) throw error;

    const user = data?.user || data?.session?.user;
    if (!user?.id) throw new Error("验证码通过了，但没有拿到研究员编号，请重试。");

    const record = buildArchiveRecord({
      userId: user.id,
      email: contact.email,
      nickname: archiveNickname.value,
      subject: appState.currentPosterPayload.subject,
      type: appState.currentType,
      answers: appState.answers
    });
    const { data: savedArchive, error: saveError } = await service.saveArchive(record);
    if (saveError) throw saveError;

    const shortId = String(savedArchive?.id || user.id).slice(0, 8).toUpperCase();
    setArchiveStatus("档案已入库。", "success");
    archiveSuccess.hidden = false;
    archiveSuccess.textContent = `研究员编号：FT-${shortId}。你的 ${record.type_code} / ${record.type_name} 已被饭桶研究所收录。`;
  } catch (error) {
    setArchiveStatus(error.message || "档案保存失败，请检查验证码或稍后再试。", "error");
  } finally {
    verifyArchiveBtn.disabled = false;
  }
}

function renderReport() {
  const type = pickType();
  const subject = subjectName.value.trim() || "未署名饭桶";
  const fields = buildReportFields(type, subject);
  appState.currentType = type;
  appState.currentPosterPayload = buildPosterPayload(type, subject);
  posterStatus.textContent = "";
  clearPosterPreview();
  renderMetrics(type.metrics);

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

function renderMetrics(metrics) {
  metricsPanel.replaceChildren(
    ...Object.entries(METRIC_LABELS).map(([key, label]) => {
      const value = metrics[key];
      const item = document.createElement("div");
      item.className = "metric-item";
      item.innerHTML = `
        <div class="metric-top">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
        <div class="metric-track" aria-hidden="true"><span style="width: ${value}%"></span></div>
      `;
      return item;
    })
  );
}

function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const chars = Array.from(text);
  const lines = [];
  let current = "";

  for (const char of chars) {
    const next = current + char;
    if (context.measureText(next).width <= maxWidth || !current) {
      current = next;
      continue;
    }
    lines.push(current);
    current = char;
    if (lines.length === maxLines - 1) break;
  }

  if (current && lines.length < maxLines) lines.push(current);

  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });

  return y + lines.length * lineHeight;
}

function drawPoster(payload) {
  const canvas = document.createElement("canvas");
  const width = 1080;
  const height = 1680;
  const scale = window.devicePixelRatio || 1;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  ctx.fillStyle = "#fffaf0";
  ctx.fillRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "rgba(217, 77, 50, 0.18)");
  background.addColorStop(0.52, "rgba(244, 223, 187, 0.34)");
  background.addColorStop(1, "rgba(47, 114, 93, 0.22)");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#202723";
  ctx.font = "900 44px system-ui, sans-serif";
  ctx.fillText("饭桶研究所", 78, 112);
  ctx.fillStyle = "#d94d32";
  ctx.font = "800 28px system-ui, sans-serif";
  ctx.fillText(payload.subtitle, 78, 158);

  ctx.fillStyle = "#202723";
  ctx.font = "900 66px system-ui, sans-serif";
  wrapText(ctx, payload.title, 78, 265, 880, 78, 2);

  ctx.fillStyle = "rgba(255, 253, 247, 0.92)";
  roundRect(ctx, 66, 360, 948, 980, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(32, 39, 35, 0.16)";
  ctx.lineWidth = 2;
  ctx.stroke();

  let y = 448;
  y = posterField(ctx, "识别对象", payload.subject, 112, y, 390);
  y = posterField(ctx, "行为类型", payload.typeName, 112, y + 26, 390);
  y = posterField(ctx, "行为代码", payload.code, 112, y + 26, 390);
  y = posterField(ctx, "饭桶风险等级", payload.risk, 112, y + 26, 760);

  ctx.fillStyle = "#47524c";
  ctx.font = "800 28px system-ui, sans-serif";
  ctx.fillText("系统判断", 112, y + 52);
  ctx.fillStyle = "#202723";
  ctx.font = "850 34px system-ui, sans-serif";
  y = wrapText(ctx, payload.judgment, 112, y + 104, 800, 48, 3);

  ctx.fillStyle = "#47524c";
  ctx.font = "800 28px system-ui, sans-serif";
  ctx.fillText("推荐摄入", 112, y + 56);
  ctx.fillStyle = "#202723";
  ctx.font = "850 34px system-ui, sans-serif";
  y = wrapText(ctx, payload.recommended, 112, y + 108, 800, 48, 2);

  ctx.fillStyle = "#a73524";
  ctx.font = "900 32px system-ui, sans-serif";
  y = wrapText(ctx, payload.shareLine, 112, y + 72, 800, 44, 2);

  y += 54;
  Object.entries(payload.metricLabels).forEach(([key, label]) => {
    const value = payload.metrics[key];
    ctx.fillStyle = "#202723";
    ctx.font = "800 28px system-ui, sans-serif";
    ctx.fillText(label, 112, y);
    ctx.fillText(String(value), 850, y);
    ctx.fillStyle = "rgba(32, 39, 35, 0.12)";
    roundRect(ctx, 112, y + 24, 760, 22, 11);
    ctx.fill();
    ctx.fillStyle = key === "discount" ? "#d89b23" : key === "social" ? "#2f725d" : "#d94d32";
    roundRect(ctx, 112, y + 24, Math.max(24, 760 * (value / 100)), 22, 11);
    ctx.fill();
    y += 88;
  });

  ctx.fillStyle = "rgba(32, 39, 35, 0.08)";
  ctx.font = "950 220px system-ui, sans-serif";
  ctx.fillText("FBI", 590, 1510);

  ctx.fillStyle = "#47524c";
  ctx.font = "800 30px system-ui, sans-serif";
  ctx.fillText(payload.watermark, 78, 1550);
  ctx.fillStyle = "#a73524";
  ctx.font = "700 26px system-ui, sans-serif";
  ctx.fillText("FBI = FanTong Behavior Identification", 78, 1594);

  return canvas;
}

function posterField(ctx, label, value, x, y, maxWidth) {
  ctx.fillStyle = "#47524c";
  ctx.font = "800 26px system-ui, sans-serif";
  ctx.fillText(label, x, y);
  ctx.fillStyle = "#202723";
  ctx.font = "900 42px system-ui, sans-serif";
  return wrapText(ctx, value, x, y + 56, maxWidth, 50, 2);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

async function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
}

async function generatePoster() {
  const payload = appState.currentPosterPayload;
  if (!payload) return;

  posterStatus.textContent = "海报生成中，饭桶研究所正在装订报告。";
  const canvas = drawPoster(payload);
  const blob = await canvasToBlob(canvas);
  const filename = `fantong-report-${payload.code}.png`;
  const file = new File([blob], filename, { type: "image/png" });
  const posterUrl = showPosterPreview(blob, filename);

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: "FBI 饭桶行为识别报告",
        text: `${payload.subject} 的饭桶行为类型：${payload.typeName}`
      });
      posterStatus.textContent = "海报已交给系统分享，也可长按预览图保存。";
      return;
    } catch {
      posterStatus.textContent = "海报已生成，可长按预览图保存，或再点一次尝试分享。";
      return;
    }
  }

  try {
    const link = document.createElement("a");
    link.href = posterUrl;
    link.download = filename;
    link.click();
    posterStatus.textContent = "海报已生成，已尝试自动下载，也可长按预览图保存。";
  } catch {
    posterStatus.textContent = "海报已生成，可长按预览图保存。";
    return;
  }
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

function renderLeaderboard() {
  const leaders = buildLeaderboard(types, 6);
  leaderboardGrid.replaceChildren(
    ...leaders.map((type, index) => {
      const card = document.createElement("article");
      card.className = "leaderboard-card";
      card.innerHTML = `
        <span class="rank-mark">TOP ${index + 1}</span>
        <h3>${type.name}</h3>
        <p>${type.shareLine}</p>
        <div class="rank-score">
          <span>传播热度</span>
          <strong>${type.viralScore}</strong>
        </div>
      `;
      return card;
    })
  );
}

function showRejectNotice() {
  rejectNotice.hidden = false;
  rejectNotice.classList.remove("is-hot");
  window.requestAnimationFrame(() => rejectNotice.classList.add("is-hot"));
}

function setMealMode(modeId) {
  const mode = findMealMode(mealModes, modeId);
  appState.currentMealModeId = mode.id;
  homeMealMode.textContent = mode.label;
  homeMealSummary.textContent = mode.summary;

  [...mealModeGrid.querySelectorAll(".meal-mode-btn")].forEach((button) => {
    const active = button.dataset.modeId === mode.id;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function pickMeal(modeId = appState.currentMealModeId) {
  const seed = Date.now() + Math.floor(Math.random() * 1000);
  const { meal, mode, poolSize } = pickMealForMode(meals, mealModes, modeId, seed, appState.lastMealId);
  const decision = buildMealDecision(meal, mode, poolSize);
  appState.lastMealId = meal.id;
  appState.currentMealDecision = decision;
  setMealMode(mode.id);
  mealTitle.textContent = decision.title;
  mealResult.innerHTML = `
    <small>${decision.command}</small>
    <strong>${decision.mealName}</strong>
    <span>${decision.reason}</span>
    <em>慎选提醒：${decision.caution}</em>
  `;
  mealMeta.textContent = `${decision.modeSummary}｜${decision.meta}`;
  copyMeal.textContent = "复制饭点指令";
}

function openMealDialog(modeId = "all") {
  pickMeal(modeId);
  if (typeof mealDialog.showModal === "function") {
    mealDialog.showModal();
    return;
  }

  mealDialog.setAttribute("open", "");
}

function copyTextWithFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard copy failed");
}

async function copyMealDecision() {
  const decision = appState.currentMealDecision;
  if (!decision) return;
  const text = `${decision.command}\n${decision.reason}\n慎选提醒：${decision.caution}\n生成自：饭桶研究所`;

  try {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(text);
    } catch {
      copyTextWithFallback(text);
    }
    copyMeal.textContent = "已复制";
  } catch {
    copyMeal.textContent = "长按复制";
  }
}

function renderMealModes() {
  mealModeGrid.replaceChildren(
    ...mealModes.map((mode) => {
      const button = document.createElement("button");
      button.className = "meal-mode-btn";
      button.type = "button";
      button.dataset.modeId = mode.id;
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = `<strong>${mode.label}</strong><span>${mode.summary}</span>`;
      button.addEventListener("click", () => pickMeal(mode.id));
      return button;
    })
  );
  setMealMode(appState.currentMealModeId);
}

startTest.addEventListener("click", startQuiz);
rejectBtn.addEventListener("click", showRejectNotice);
decideMeal.addEventListener("click", () => openMealDialog("all"));
openMealTool.addEventListener("click", () => openMealDialog(appState.currentMealModeId));
mealFromResult.addEventListener("click", () => openMealDialog(appState.currentType?.id === "late" ? "late" : "all"));
rerollMeal.addEventListener("click", () => pickMeal(appState.currentMealModeId));
copyMeal.addEventListener("click", copyMealDecision);
restartBtn.addEventListener("click", startQuiz);
saveArchiveBtn.addEventListener("click", openArchiveDialog);
sendArchiveCode.addEventListener("click", sendArchiveOtp);
verifyArchiveBtn.addEventListener("click", verifyAndSaveArchive);
archiveForm.addEventListener("submit", (event) => {
  if (event.submitter?.value === "close") return;
  event.preventDefault();
});
posterBtn.addEventListener("click", () => {
  generatePoster().catch(() => {
    posterStatus.textContent = "海报生成失败，请再点一次。";
  });
});
cancelQuiz.addEventListener("click", () => setScreen("home"));
backBtn.addEventListener("click", goBack);

renderArchive();
renderLeaderboard();
renderMealModes();
