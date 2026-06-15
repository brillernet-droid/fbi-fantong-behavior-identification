import test from "node:test";
import assert from "node:assert/strict";

import { REPORT_FIELD_LABELS, meals, questions, types } from "../data.js";
import { buildReportFields, pickTypeFromAnswers, scoreAnswers } from "../logic.js";

const REQUIRED_TYPE_FIELDS = [
  "id",
  "code",
  "name",
  "summary",
  "judgment",
  "high",
  "recommended",
  "caution",
  "risk",
  "comment"
];

const LOCAL_MARKERS = ["早八", "外卖", "满减", "拼单", "食堂", "夜宵", "打工", "小区门口", "奶茶", "团购"];
const FORBIDDEN_AGENCY_MARKERS = ["联邦调查局", "警徽", "鹰徽", "警察", "执法证", "真实 FBI"];

test("type catalog is complete and unique", () => {
  assert.equal(types.length, 16);

  const ids = new Set();
  const codes = new Set();

  for (const type of types) {
    for (const field of REQUIRED_TYPE_FIELDS) {
      assert.equal(typeof type[field], "string", `${type.id}.${field} should be a string`);
      assert.ok(type[field].trim(), `${type.id}.${field} should not be empty`);
    }

    assert.match(type.code, /^FBI-[A-D]0[1-4]$/);
    assert.equal(ids.has(type.id), false, `duplicate id: ${type.id}`);
    assert.equal(codes.has(type.code), false, `duplicate code: ${type.code}`);
    ids.add(type.id);
    codes.add(type.code);
  }
});

test("questions are valid and every type is reachable", () => {
  const typeIds = new Set(types.map((type) => type.id));
  const reachableIds = new Set();

  assert.equal(questions.length, 8);

  for (const question of questions) {
    assert.ok(question.text.trim());
    assert.equal(question.options.length, 4);

    for (const option of question.options) {
      assert.ok(option.title.trim());
      assert.ok(option.desc.trim());
      assert.ok(Array.isArray(option.add));
      assert.equal(option.add.length, 2);

      for (const id of option.add) {
        assert.ok(typeIds.has(id), `unknown type id in question option: ${id}`);
        reachableIds.add(id);
      }
    }
  }

  assert.deepEqual([...reachableIds].sort(), [...typeIds].sort());
});

test("copywriting uses local Chinese meal context without agency imitation", () => {
  const text = JSON.stringify({ types, questions, meals });

  for (const marker of LOCAL_MARKERS) {
    assert.ok(text.includes(marker), `missing local marker: ${marker}`);
  }

  for (const marker of FORBIDDEN_AGENCY_MARKERS) {
    assert.equal(text.includes(marker), false, `forbidden agency marker found: ${marker}`);
  }
});

test("meal suggestions are varied and non-empty", () => {
  assert.ok(meals.length >= 12);

  for (const meal of meals) {
    assert.ok(meal.name.trim());
    assert.ok(meal.reason.trim());
  }
});

test("result scoring and report fields stay stable", () => {
  const answers = questions.map((question) => question.options[0].add);
  const scores = scoreAnswers(types, answers);
  const type = pickTypeFromAnswers(types, answers, "早八干饭人");
  const fields = buildReportFields(type, "早八干饭人");

  assert.equal(Object.keys(scores).length, 16);
  assert.ok(type.id);
  assert.deepEqual(
    fields.map((field) => field.label),
    REPORT_FIELD_LABELS
  );
  assert.equal(fields[0].value, "早八干饭人");
  assert.equal(fields.length, 9);
});
