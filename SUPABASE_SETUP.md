# Supabase 邮箱验证码档案配置

这个项目的邮箱验证码注册使用 Supabase Auth。前端只放公开的 Supabase URL 和 anon public key，不要放 service role key。

## 1. 创建 Supabase 项目

1. 打开 Supabase，新建项目。
2. 进入 `Project Settings -> API`。
3. 复制 `Project URL` 和 `anon public` key。
4. 填到项目根目录的 `config.js`：

```js
export const FANTONG_CONFIG = {
  supabaseUrl: "https://your-project-ref.supabase.co",
  supabaseAnonKey: "你的 anon public key",
  archiveTable: "fantong_archives",
  supabaseModuleUrl: "https://esm.sh/@supabase/supabase-js@2"
};
```

`anon public` key 可以出现在前端，但必须配合 Row Level Security。不要把 `service_role` 或任何私密 key 放进仓库。

## 2. 创建档案表

在 Supabase 控制台打开 `SQL Editor`，运行：

```sql
-- 复制并运行 supabase/schema.sql
```

本仓库已经提供完整 SQL：[supabase/schema.sql](./supabase/schema.sql)。

这张表会保存：

- 邮箱
- 研究员昵称
- 本次识别对象
- 饭桶行为类型、行为代码、风险等级
- 传播金句、维度值、答题路径

## 3. 配置邮箱验证码模板

进入 `Authentication -> Email Templates -> Magic Link or OTP`。

如果你希望用户输入 6 位验证码，模板里要包含：

```text
{{ .Token }}
```

不要只放 `{{ .ConfirmationURL }}`，否则用户收到的是魔法链接，不是验证码。

可以使用类似文案：

```text
你的饭桶研究所验证码是：{{ .Token }}

5 分钟内输入有效。若不是你本人操作，可以忽略这封邮件。
```

## 4. Redirect URL

进入 `Authentication -> URL Configuration`，把 GitHub Pages 地址加入允许列表：

```text
https://brillernet-droid.github.io/fbi-fantong-behavior-identification/
```

本地调试可以加入：

```text
http://127.0.0.1:4173/
```

## 5. 防刷建议

当前前端已经有 60 秒发送冷却，但这只能改善体验，不能替代后端防刷。

正式传播前建议：

- 开启 Supabase Auth rate limit 默认保护。
- 配置自己的 SMTP，提高送达率和可控性。
- 流量变大后接入 CAPTCHA，例如 Cloudflare Turnstile。
- 定期查看 Supabase Auth 邮件发送量，避免被恶意刷爆免费额度。
