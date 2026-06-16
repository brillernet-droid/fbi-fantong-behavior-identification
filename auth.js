export const DEFAULT_ARCHIVE_TABLE = "fantong_archives";
export const DEFAULT_SUPABASE_MODULE_URL = "https://esm.sh/@supabase/supabase-js@2";

export function getArchiveConfig(raw) {
  const source =
    raw || (typeof window !== "undefined" ? window.FANTONG_CONFIG : globalThis.FANTONG_CONFIG) || {};

  return {
    supabaseUrl: String(source.supabaseUrl || "").trim(),
    supabaseAnonKey: String(source.supabaseAnonKey || "").trim(),
    archiveTable: String(source.archiveTable || DEFAULT_ARCHIVE_TABLE).trim() || DEFAULT_ARCHIVE_TABLE,
    supabaseModuleUrl: String(source.supabaseModuleUrl || DEFAULT_SUPABASE_MODULE_URL).trim() || DEFAULT_SUPABASE_MODULE_URL
  };
}

export function isArchiveConfigured(config = getArchiveConfig()) {
  const hasUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl);
  const hasPublicKey =
    config.supabaseAnonKey.length > 20 &&
    !config.supabaseAnonKey.includes("service_role") &&
    !config.supabaseAnonKey.includes("YOUR_");

  return hasUrl && hasPublicKey;
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function normalizeNickname(nickname) {
  return String(nickname || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function isValidOtp(token) {
  return /^\d{6}$/.test(String(token || "").trim());
}

export function buildArchiveRecord({ userId, email, nickname, subject, type, answers, reportContent }) {
  return {
    user_id: userId,
    email: normalizeEmail(email),
    nickname: normalizeNickname(nickname) || "匿名研究员",
    subject: String(subject || "未署名饭桶").trim() || "未署名饭桶",
    type_id: type.id,
    type_name: type.name,
    type_code: type.code,
    risk: reportContent?.risk || type.risk,
    share_line: reportContent?.shareLine || type.shareLine,
    metrics: { ...type.metrics },
    answers: answers.map((answer) => [...answer]),
    source: "fbi-fantong-behavior-identification"
  };
}

export async function createArchiveClient(config = getArchiveConfig()) {
  if (!isArchiveConfigured(config)) {
    throw new Error("档案服务还没配置 Supabase URL 和 anon public key。");
  }

  const { createClient } = await import(config.supabaseModuleUrl);
  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true
    }
  });

  return {
    async sendOtp(email) {
      return supabase.auth.signInWithOtp({
        email: normalizeEmail(email),
        options: {
          shouldCreateUser: true
        }
      });
    },

    async verifyOtp(email, token) {
      return supabase.auth.verifyOtp({
        email: normalizeEmail(email),
        token: String(token || "").trim(),
        type: "email"
      });
    },

    async saveArchive(record) {
      return supabase.from(config.archiveTable).insert(record).select("id, created_at").single();
    }
  };
}
