import { REPORT_FIELD_LABELS } from "./data.js";

export const METRIC_LABELS = {
  impulse: "干饭冲动值",
  discount: "满减敏感度",
  social: "饭局社交值"
};

export function scoreAnswers(types, answers) {
  const scores = Object.fromEntries(types.map((type) => [type.id, 0]));

  answers.flat().forEach((id) => {
    if (Object.hasOwn(scores, id)) {
      scores[id] += 1;
    }
  });

  return scores;
}

export function pickTypeFromAnswers(types, answers, seedText = "") {
  const scores = scoreAnswers(types, answers);
  const maxScore = Math.max(...Object.values(scores));
  const winners = types.filter((type) => scores[type.id] === maxScore);
  const seed = Array.from(seedText).reduce((sum, char) => sum + char.codePointAt(0), seedText.length);

  return winners[seed % winners.length];
}

export function buildReportFields(type, subject) {
  const values = [
    subject || "未署名饭桶",
    type.name,
    type.code,
    type.judgment,
    type.high,
    type.recommended,
    type.caution,
    type.risk,
    type.comment
  ];

  return REPORT_FIELD_LABELS.map((label, index) => ({
    label,
    value: values[index],
    wide: ["系统判断", "高频行为", "研究所评语"].includes(label)
  }));
}

export function buildPosterPayload(type, subject) {
  return {
    title: "【FBI 饭桶行为识别报告】",
    subtitle: "FanTong Behavior Identification",
    subject: subject || "未署名饭桶",
    typeName: type.name,
    code: type.code,
    judgment: type.judgment,
    recommended: type.recommended,
    risk: type.risk,
    metrics: type.metrics,
    metricLabels: METRIC_LABELS,
    watermark: "生成自：饭桶研究所"
  };
}
