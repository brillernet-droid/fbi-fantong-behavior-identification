const REPORT_CONTENT_FIELDS = ["judgment", "high", "recommended", "caution", "risk", "comment", "shareLine"];

const LOCAL_REPORT_SOURCE = "local-program";
const API_REPORT_SOURCE = "api";
const API_FALLBACK_SOURCE = "api-fallback";

const DEFAULT_REPORT_API_TIMEOUT_MS = 3200;

const METRIC_COPY = {
  impulse: {
    label: "干饭冲动值",
    high: "开饭信号来得很早，理智还在路上，胃部已经坐到会议室主位。",
    medium: "饭点启动速度稳定，不算冲动，但也不会让自己饿成静音模式。",
    low: "干饭冲动偏低，常常先观察环境，再决定要不要正式开饭。"
  },
  discount: {
    label: "满减敏感度",
    high: "满减、红包、配送费会在你脑内自动排队报数。",
    medium: "会看优惠，但不会为了两块钱把菜单改成复杂项目。",
    low: "价格不是主要指挥官，好吃和省心更容易拿到投票权。"
  },
  social: {
    label: "饭局社交值",
    high: "饭局里容易自然承担组织、协调和拍板任务。",
    medium: "能独食也能组局，社交电量按当天情况灵活调度。",
    low: "餐桌边界感较强，一个人吃饭对你来说是正当回血方式。"
  }
};

const REPORT_OPENERS = [
  "系统完成饭点行为比对后发现，",
  "研究所内部模型显示，",
  "本次样本的饭点波形比较鲜明，",
  "根据答题路径回放，"
];

const REPORT_ENDINGS = [
  "建议优先保证准点进食，不要把饭点拖成悬疑片。",
  "整体属于可传播、可截图、可被朋友认领的饭桶样本。",
  "如遇群聊反复拉扯，可直接出示本报告要求拍板。",
  "本结论不构成医学建议，但构成今日吃饭理由。"
];

const BEHAVIOR_TRIGGERS = [
  "菜单打开超过三分钟",
  "群聊出现“都行”",
  "外卖红包即将过期",
  "食堂窗口开始排队",
  "下班路上闻到锅气",
  "夜里十点后刷到探店视频",
  "冰箱里出现可疑剩饭",
  "同事开始问今天吃什么"
];

const RECOMMEND_EXTRAS = {
  impulse: ["热汤面", "盖浇饭", "煲仔饭", "水饺配汤"],
  discount: ["团购套餐", "双拼饭", "工作日特价", "满减拼单"],
  social: ["火锅", "烤肉", "大盘菜", "早茶拼盘"]
};

const CAUTION_EXTRAS = {
  impulse: ["空腹硬扛", "临睡前加重辣", "边赶路边暴风吸入"],
  discount: ["为了凑单点到失控", "被优惠券带偏胃口", "把配送费算成主要人生矛盾"],
  social: ["群聊无限投票", "照顾所有人导致自己没吃好", "饭局人数临时膨胀"],
  balanced: ["菜单太长的店", "需要连续排队的局", "让你反复纠结的隐藏套餐"]
};

const COMMENT_TONES = [
  "你不是普通吃饭，你是在进行饭点自救。",
  "研究所建议保留这份荒诞感，它很适合对抗普通的一天。",
  "你的胃部决策系统虽然偶尔跑偏，但整体很有生活气。",
  "本样本具备较强朋友传播价值，看到报告的人大概率会说“这不就是你”。"
];

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function stableHash(input) {
  const text = JSON.stringify(input);
  let hash = 2166136261;

  for (const char of text) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pick(items, seed, offset = 0) {
  if (!items.length) return "";
  return items[(seed + offset) % items.length];
}

function sameAnswer(left = [], right = []) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function normalizeText(value, fallback = "", maxLength = 96) {
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  return (text || fallback).slice(0, maxLength);
}

function splitItems(text) {
  return String(text || "")
    .split(/[、,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueItems(items) {
  return [...new Set(items.filter(Boolean))];
}

function strongestMetric(metrics = {}) {
  const entries = Object.entries(metrics);
  if (!entries.length) return ["impulse", 50];
  return entries.sort((a, b) => b[1] - a[1])[0];
}

function metricBand(value) {
  if (value >= 75) return "high";
  if (value >= 45) return "medium";
  return "low";
}

function describeMetric(key, value) {
  const copy = METRIC_COPY[key] || METRIC_COPY.impulse;
  return `${copy.label} ${value}：${copy[metricBand(value)]}`;
}

function answerToken(answer, index) {
  return {
    questionIndex: index,
    question: "",
    title: `第 ${index + 1} 题信号`,
    desc: "未匹配到原始选项，但饭点波形仍然有效。",
    add: [...answer]
  };
}

export function resolveAnswerProfile(answers = [], questions = []) {
  return answers.map((answer, index) => {
    const question = questions[index];
    const option = question?.options?.find((item) => sameAnswer(item.add, answer));
    if (!option) return answerToken(answer, index);

    return {
      questionIndex: index,
      question: question.text,
      title: option.title,
      desc: option.desc,
      add: [...option.add]
    };
  });
}

export function buildLocalReportContent(type, subject = "", answers = [], questions = []) {
  const safeSubject = normalizeText(subject, "未署名饭桶", 40);
  const profile = resolveAnswerProfile(answers, questions);
  const seed = stableHash({
    subject: safeSubject,
    type: type?.id,
    answers: profile.map((item) => item.title)
  });
  const [dominantKey, dominantValue] = strongestMetric(type.metrics);
  const secondary = Object.entries(type.metrics)
    .filter(([key]) => key !== dominantKey)
    .sort((a, b) => b[1] - a[1])[0] || ["discount", 50];
  const anchors = profile.map((item) => item.title);
  const anchorLine = anchors.length ? uniqueItems(anchors).slice(0, 4).join("、") : type.high;
  const trigger = pick(BEHAVIOR_TRIGGERS, seed, 3);
  const baseRecommendations = splitItems(type.recommended);
  const extraRecommendations = RECOMMEND_EXTRAS[dominantKey] || RECOMMEND_EXTRAS.impulse;
  const recommended = uniqueItems([
    ...baseRecommendations,
    pick(extraRecommendations, seed, 5)
  ])
    .slice(0, 4)
    .join("、");
  const cautionPool = CAUTION_EXTRAS[dominantKey] || CAUTION_EXTRAS.balanced;
  const caution = `${type.caution}；尤其慎选${pick(cautionPool, seed, 7)}。`;
  const confidence = clampNumber(
    58 + Math.max(...Object.values(type.metrics)) * 0.24 + profile.length * 1.5 + (seed % 7),
    62,
    96,
    82
  );
  const fingerprint = `FT-${type.code.replace("FBI-", "")}-${String(seed % 10000).padStart(4, "0")}`;
  const metricLine = describeMetric(dominantKey, dominantValue);
  const secondaryLine = describeMetric(secondary[0], secondary[1]);

  return {
    source: LOCAL_REPORT_SOURCE,
    fingerprint,
    confidence,
    judgment: normalizeText(
      `${pick(REPORT_OPENERS, seed)}${safeSubject}在「${anchorLine}」里暴露了「${type.name}」波形。${metricLine}`,
      type.judgment,
      140
    ),
    high: normalizeText(`高频信号：${anchorLine}；隐藏触发器：${trigger}。${secondaryLine}`, type.high, 140),
    recommended,
    caution: normalizeText(caution, type.caution, 110),
    risk: `${type.risk} · 置信度 ${confidence}%`,
    comment: normalizeText(`${pick(COMMENT_TONES, seed, 11)}${pick(REPORT_ENDINGS, seed, 13)} 样本编号：${fingerprint}。`, type.comment, 150),
    shareLine: normalizeText(
      `${safeSubject}的饭点行为被识别为「${type.name}」：${pick(REPORT_ENDINGS, seed, 17)}`,
      type.shareLine,
      86
    )
  };
}

export function normalizeReportContent(remoteContent = {}, fallbackContent) {
  const fallback = fallbackContent || {};
  const normalized = {
    source: remoteContent.source || fallback.source || LOCAL_REPORT_SOURCE,
    fingerprint: normalizeText(remoteContent.fingerprint, fallback.fingerprint || "FT-LOCAL", 24),
    confidence: clampNumber(remoteContent.confidence, 0, 100, fallback.confidence || 82)
  };

  for (const field of REPORT_CONTENT_FIELDS) {
    normalized[field] = normalizeText(remoteContent[field], fallback[field], field === "comment" ? 150 : 120);
  }

  return normalized;
}

export function getReportApiConfig(raw = {}) {
  const source = raw || {};
  return {
    reportApiEndpoint: String(source.reportApiEndpoint || "").trim(),
    reportApiTimeoutMs: clampNumber(source.reportApiTimeoutMs, 800, 10000, DEFAULT_REPORT_API_TIMEOUT_MS)
  };
}

export function isReportApiConfigured(config = getReportApiConfig()) {
  const endpoint = config.reportApiEndpoint;
  return /^https:\/\/.+/i.test(endpoint) || /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//i.test(endpoint) || endpoint.startsWith("/");
}

export function buildReportApiRequest({ type, subject, answers = [], questions = [] }) {
  return {
    app: "饭桶研究所",
    system: "FBI 饭桶行为识别系统",
    constraints: {
      language: "zh-CN",
      tone: "funny, absurd, meme-friendly, not vulgar",
      noRealAgencyImitation: true,
      fields: REPORT_CONTENT_FIELDS
    },
    subject: normalizeText(subject, "未署名饭桶", 40),
    type: {
      id: type.id,
      code: type.code,
      name: type.name,
      summary: type.summary,
      metrics: { ...type.metrics }
    },
    answerPath: resolveAnswerProfile(answers, questions)
  };
}

export async function generateReportContent({ type, subject, answers = [], questions = [] }, rawConfig = {}) {
  const fallback = buildLocalReportContent(type, subject, answers, questions);
  const config = getReportApiConfig(rawConfig);

  if (!isReportApiConfigured(config)) return fallback;

  const controller = new AbortController();
  const setTimer = typeof window !== "undefined" ? window.setTimeout.bind(window) : setTimeout;
  const clearTimer = typeof window !== "undefined" ? window.clearTimeout.bind(window) : clearTimeout;
  const timeout = setTimer(() => controller.abort(), config.reportApiTimeoutMs);

  try {
    const response = await fetch(config.reportApiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildReportApiRequest({ type, subject, answers, questions })),
      signal: controller.signal
    });

    if (!response.ok) throw new Error(`Report API responded ${response.status}`);
    const data = await response.json();
    return normalizeReportContent({ ...data, source: API_REPORT_SOURCE }, fallback);
  } catch {
    return { ...fallback, source: API_FALLBACK_SOURCE };
  } finally {
    clearTimer(timeout);
  }
}
