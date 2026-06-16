# 饭桶研究所动态报告 API 接入说明

当前线上版本默认使用 `content-engine.js` 的本地生成程序，不需要后端，也不会产生费用。

如果后续要接大模型或自研文案服务，请只在自己的后端保存私密 key，前端只填写一个公开可访问的 `reportApiEndpoint`。

## 前端配置

在 `config.js` 中填写：

```js
export const FANTONG_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  archiveTable: "fantong_archives",
  supabaseModuleUrl: "https://esm.sh/@supabase/supabase-js@2",
  reportApiEndpoint: "https://your-worker.example.com/fantong-report",
  reportApiTimeoutMs: 3200
};
```

未配置 `reportApiEndpoint` 时，页面会走本地生成。

接口超时、报错、返回字段不完整时，页面会自动回落到本地生成，不影响用户完成测试。

## 请求格式

前端会用 `POST` 发送 JSON：

```json
{
  "app": "饭桶研究所",
  "system": "FBI 饭桶行为识别系统",
  "constraints": {
    "language": "zh-CN",
    "tone": "funny, absurd, meme-friendly, not vulgar",
    "noRealAgencyImitation": true,
    "fields": ["judgment", "high", "recommended", "caution", "risk", "comment", "shareLine"]
  },
  "subject": "满减观察员",
  "type": {
    "id": "budget",
    "code": "FBI-B03",
    "name": "满减精算型",
    "summary": "满减、红包、配送费在你脑内自动建模。",
    "metrics": {
      "impulse": 54,
      "discount": 98,
      "social": 62
    }
  },
  "answerPath": [
    {
      "questionIndex": 0,
      "question": "饭点提前三十分钟，你的系统通常先弹出什么提醒？",
      "title": "群里发起拼单",
      "desc": "先问大家吃啥，再把问题聊复杂。",
      "add": ["social", "budget"]
    }
  ]
}
```

## 响应格式

后端返回 JSON，字段可以不全，不全的字段会由本地生成结果补齐：

```json
{
  "judgment": "系统发现你对满减、配送费和凑单行为高度敏感。",
  "high": "高频行为：凑满减、看红包、把第二杯半价讲成投资逻辑。",
  "recommended": "团购套餐、拼单外卖、双拼饭",
  "caution": "慎选无明码标价和临时加价的小店。",
  "risk": "精算过载级 · 置信度 91%",
  "comment": "研究所建议你保留这份算力，但不要为了省两块多点一份吃不完的主食。",
  "shareLine": "满减不是优惠，是我和平台之间的智力对局。",
  "fingerprint": "FT-B03-2026",
  "confidence": 91
}
```

## 后端最小规则

- 不返回低俗、攻击性或冒犯性内容。
- 不模仿真实机构、真实政府系统、执法证件、警徽、印章或任何真实机构背书。
- 保持中文语境，优先使用早八、外卖、满减、拼单、夜宵、打工、食堂等本土表达。
- 建议控制每个字段长度，避免结果卡和海报溢出。

## 推荐实现顺序

1. 先保持本地生成，继续灰测。
2. 如果用户觉得报告好笑但重复感仍强，再接后端模型服务。
3. 后端接入后先小流量测试，确认费用、延迟和内容安全。
4. 稳定后再把生成内容写入 Supabase 档案。
