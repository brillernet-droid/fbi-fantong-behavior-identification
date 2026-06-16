# 饭桶研究所

一个面向中文语境的荒诞饭点决策小应用，包含饭桶行为识别、饭点决策、报告海报和饭桶档案。

## Live Demo

[打开饭桶研究所](https://brillernet-droid.github.io/fbi-fantong-behavior-identification/)

产品结构：

- App name: 饭桶研究所
- Personality test name: FBI 饭桶行为识别系统
- Result report name: FBI 饭桶行为识别报告
- 16-type system name: FBI 饭桶行为 16 型档案

> FBI stands for **FanTong Behavior Identification**.
> This is a playful fictional research-system name inside 饭桶研究所.

## Preview

![饭桶研究所预览](./assets/fantong-lab-hero.png)

## Features

- 单页静态 Web 应用，无需构建步骤
- 首页三种入口：
  - 启动 FBI 识别
  - 直接决定今天吃啥
  - 我拒绝被识别
- 拒绝按钮彩蛋：`拒绝无效。饭点行为已经暴露。`
- 8 道本土饭点行为问题
- 自动生成 `FBI 饭桶行为识别报告`，报告文案会根据答题路径动态组合
- 内置 `FBI 饭桶行为 16 型档案`
- 饭点决策系统：按早八、打工午饭、下班回血、夜宵、省钱、清爽、聚餐等场景决定今天吃啥
- 结果页生成可预览、长按保存、可分享/下载的报告海报
- 结果页可通过 Supabase 邮箱验证码保存饭桶档案
- 可选报告 API 接口：配置后优先请求后端生成，失败自动回落本地生成程序
- 三个本土饭点维度：干饭冲动值、满减敏感度、饭局社交值
- 饭桶类型热度榜和结果传播金句
- 桌面端与移动端响应式适配
- 内置数据完整性测试和 GitHub Actions
- 小红书/抖音/微信群传播素材包

## Important Note

本项目中的 `FBI` 只代表 `FanTong Behavior Identification`。

本项目不使用、模仿或暗示真实 FBI、真实政府机构、执法机构、官方徽章、印章、鹰形标识、警徽、制服或任何真实机构背书。

This project is not affiliated with, endorsed by, or connected to any real government agency or law enforcement organization.

## Run Locally

使用本地静态服务器运行：

```bash
python3 -m http.server 4173
```

然后访问：

```text
http://127.0.0.1:4173/
```

## Project Structure

```text
.
├── assets/
│   └── fantong-lab-hero.png
├── app.js
├── content-engine.js
├── data.js
├── index.html
├── logic.js
├── marketing/
├── supabase/
├── styles.css
├── tests/
├── API_INTEGRATION.md
├── SUPABASE_SETUP.md
├── LICENSE
├── package.json
└── README.md
```

## Development

传播素材：

```text
marketing/viral-kit.md
marketing/covers/
```

运行测试：

```bash
npm test
```

检查 JavaScript 语法：

```bash
npm run check
```

启动本地预览：

```bash
npm start
```

配置邮箱验证码档案：

```text
config.js
supabase/schema.sql
SUPABASE_SETUP.md
```

只允许填写 Supabase `anon public` key，不要提交 `service_role` 或任何私密 key。

配置动态报告 API：

```js
export const FANTONG_CONFIG = {
  reportApiEndpoint: "https://your-worker.example.com/fantong-report",
  reportApiTimeoutMs: 3200
};
```

`reportApiEndpoint` 必须是你自己的后端、Worker、Edge Function 或 Serverless Function。不要把 OpenAI、Claude、DeepSeek 等模型服务的私密 key 放进前端仓库。未配置时会使用 `content-engine.js` 的本地生成程序。

配置完成后自检：

```bash
npm run verify:supabase
```

小范围灰测说明见 [GRAY_TEST.md](./GRAY_TEST.md)。

## GitHub Pages

这个项目是纯静态应用，可以直接部署到 GitHub Pages：

1. 打开仓库的 `Settings`
2. 进入 `Pages`
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main` 和 `/root`
5. 保存后等待 Pages 发布

更多发布命令见 [PUBLISHING.md](./PUBLISHING.md)。

## License

MIT License.
