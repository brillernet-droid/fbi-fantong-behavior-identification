import { readFile } from "node:fs/promises";

import { FANTONG_CONFIG } from "../config.js";
import { getArchiveConfig, isArchiveConfigured } from "../auth.js";

const config = getArchiveConfig(FANTONG_CONFIG);
const schema = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");

const checks = [
  {
    label: "Supabase URL",
    ok: /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl),
    hint: "config.js 里需要填写 Project URL，例如 https://xxxx.supabase.co"
  },
  {
    label: "Anon public key",
    ok: isArchiveConfigured(config),
    hint: "config.js 里只能填写 anon public key，不要填写 service_role key"
  },
  {
    label: "Archive table",
    ok: config.archiveTable === "fantong_archives",
    hint: "archiveTable 建议保持 fantong_archives，除非 SQL 也同步改名"
  },
  {
    label: "RLS insert policy",
    ok: schema.includes("with check (auth.uid() = user_id)"),
    hint: "supabase/schema.sql 必须限制用户只能插入自己的档案"
  },
  {
    label: "RLS select policy",
    ok: schema.includes("using (auth.uid() = user_id)"),
    hint: "supabase/schema.sql 必须限制用户只能读取自己的档案"
  }
];

let failed = false;

console.log("饭桶研究所 Supabase 配置自检");
for (const check of checks) {
  const mark = check.ok ? "PASS" : "FAIL";
  console.log(`${mark} ${check.label}`);
  if (!check.ok) {
    failed = true;
    console.log(`  ${check.hint}`);
  }
}

if (failed) {
  console.log("\n当前还不能做真实邮箱验证码灰测。请按 SUPABASE_SETUP.md 完成配置后重试。");
  process.exit(1);
}

console.log("\n配置看起来可以进入真实邮箱 OTP 验收。下一步：线上完成一次保存档案流程。");
