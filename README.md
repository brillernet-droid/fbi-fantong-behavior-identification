# 饭桶研究所

一个面向中文语境的荒诞饭点人格测试小应用，重点观察早八、外卖满减、拼单、食堂、夜宵和选择困难等中国饭点行为。

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
- 自动生成 `FBI 饭桶行为识别报告`
- 内置 `FBI 饭桶行为 16 型档案`
- 随机“今天吃啥”推荐弹窗
- 桌面端与移动端响应式适配
- 内置数据完整性测试和 GitHub Actions

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
├── index.html
├── styles.css
├── LICENSE
├── package.json
└── README.md
```

## Development

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
