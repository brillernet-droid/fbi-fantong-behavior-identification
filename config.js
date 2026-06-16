export const FANTONG_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  archiveTable: "fantong_archives",
  supabaseModuleUrl: "https://esm.sh/@supabase/supabase-js@2",
  reportApiEndpoint: "",
  reportApiTimeoutMs: 3200
};

if (typeof window !== "undefined") {
  window.FANTONG_CONFIG = FANTONG_CONFIG;
}
