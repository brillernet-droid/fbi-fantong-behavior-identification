# Claude Code Review Request

请审阅当前工作区的未提交变更，重点关注“饭桶研究所”的邮箱验证码档案保存功能。

## 背景

项目是 GitHub Pages 上的纯静态中文小应用：

- App name: 饭桶研究所
- Personality test name: FBI 饭桶行为识别系统
- Result report name: FBI 饭桶行为识别报告
- FBI 仅代表 FanTong Behavior Identification，不是真实机构

本次变更新增：

- Supabase 邮箱 OTP 配置模块：`config.js`
- 邮箱验证码和档案保存逻辑：`auth.js`
- 结果页“保存我的饭桶档案”按钮和弹窗：`index.html` / `app.js`
- Supabase 表结构和 RLS SQL：`supabase/schema.sql`
- 配置说明：`SUPABASE_SETUP.md`
- 扩充“今天吃啥”推荐内容
- 数据完整性和档案 payload 测试

## 审阅重点

1. 安全
   - 是否意外暴露私密 key 或暗示提交 `service_role` key。
   - Supabase RLS policy 是否能限制用户只能插入/读取自己的档案。
   - 邮箱、昵称、测试结果保存字段是否过度收集。
   - 前端冷却是否被正确表述为体验优化，而不是安全边界。

2. Supabase OTP 正确性
   - `signInWithOtp` / `verifyOtp` 调用是否合理。
   - 文档是否清楚说明邮箱模板要使用 `{{ .Token }}`。
   - 未配置 Supabase 时是否温和失败。

3. 静态站兼容性
   - GitHub Pages 直接托管时是否能加载模块。
   - `config.js` 作为公开配置文件是否合理。
   - 没有后端时是否避免了伪安全验证码。

4. 用户体验
   - 注册是否只在结果页用户主动保存档案时触发。
   - 移动端弹窗布局是否清晰。
   - 中文文案是否有趣但不低俗、不冒犯。

5. 测试
   - `npm test` 和 `npm run check` 是否覆盖关键风险。
   - 还缺哪些测试或手动验证。

请输出：

- 必须修复的问题，按严重程度排序。
- 可以后续优化的问题。
- 如果没有阻塞问题，请明确说“未发现阻塞发布的问题”。
