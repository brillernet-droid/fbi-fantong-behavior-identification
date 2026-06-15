export const REPORT_FIELD_LABELS = [
  "识别对象",
  "行为类型",
  "行为代码",
  "系统判断",
  "高频行为",
  "推荐摄入",
  "慎选食物",
  "饭桶风险等级",
  "研究所评语"
];

export const types = [
  {
    id: "rush",
    code: "FBI-A01",
    name: "干饭冲锋型",
    summary: "饭点一到，工位到食堂的路线自动点亮。",
    judgment: "系统判定你拥有稳定的开饭雷达，电梯还没到，心已经排在窗口前。",
    high: "提前看食堂菜单、卡点下楼、对排队长度异常敏感",
    recommended: "黄焖鸡米饭、牛肉面、热汤馄饨",
    caution: "需要等位 90 分钟的网红店",
    risk: "高饥饿反应级",
    comment: "建议随身备一根能量棒，防止会议拖堂触发眼神预警。",
    metrics: { impulse: 96, discount: 42, social: 48 }
  },
  {
    id: "archive",
    code: "FBI-A02",
    name: "点评考古型",
    summary: "点餐前先翻评论区，连老板回复都不放过。",
    judgment: "系统发现你对菜单有考古级执念，配料表和差评在你眼里会自动加粗。",
    high: "研究套餐图、比对评论、追问隐藏菜单和今日沽清",
    recommended: "家常小炒、季节限定、手写菜单小馆",
    caution: "只有套餐 A 和套餐 B 的极简店",
    risk: "中度纠结扩散级",
    comment: "研究所建议给你配一名同桌，职责是到点合上菜单。",
    metrics: { impulse: 46, discount: 74, social: 58 }
  },
  {
    id: "comfort",
    code: "FBI-A03",
    name: "老地方续命型",
    summary: "世界再乱，小区门口那家不能乱。",
    judgment: "系统识别到稳定摄入偏好，你的安全感可能藏在同一家店的同一张桌子。",
    high: "重复点单、熟练报忌口、老板还没问你已经点完",
    recommended: "家常盖饭、热粥、砂锅粉丝",
    caution: "菜单每天变的实验厨房",
    risk: "低风险高依赖级",
    comment: "稳定不是保守，是你和胃部签订的长期战略协议。",
    metrics: { impulse: 55, discount: 38, social: 40 }
  },
  {
    id: "random",
    code: "FBI-A04",
    name: "随缘盲点型",
    summary: "吃什么不重要，被今日推荐选中很重要。",
    judgment: "系统检测到强随机倾向，你的点餐软件像一个赛博转盘。",
    high: "闭眼点、让朋友报数字、把优惠券当成命运提示",
    recommended: "双拼饭、麻辣烫、当日推荐套餐",
    caution: "口味过于极端的隐藏菜单",
    risk: "波动惊喜级",
    comment: "研究所无法预测你，但可以确认你让饭点变得很有戏。",
    metrics: { impulse: 82, discount: 51, social: 44 }
  },
  {
    id: "social",
    code: "FBI-B01",
    name: "拼单外交型",
    summary: "饭不是一个人吃的，是群聊关系现场开会。",
    judgment: "系统确认你具备强餐桌协商能力，点菜时自动进入饭局组织者模式。",
    high: "拉群投票、凑起送、照顾忌口、点一道大家都能夹的菜",
    recommended: "火锅、烤肉、大盘鸡、东北菜",
    caution: "只能单人独享的小份料理",
    risk: "中高社交传染级",
    comment: "你不是在吃饭，你是在维护人类饭桌文明。",
    metrics: { impulse: 68, discount: 63, social: 96 }
  },
  {
    id: "solo",
    code: "FBI-B02",
    name: "独食充电型",
    summary: "一个人吃饭，是给大脑插上静音充电线。",
    judgment: "系统判定你拥有独立进食主权，饭点不需要寒暄批准。",
    high: "耳机就位、靠墙落座、享受不分享最后一口",
    recommended: "兰州牛肉面、便当、单人小火锅",
    caution: "必须八个人起订的团餐",
    risk: "低干扰沉浸级",
    comment: "研究所尊重你的餐桌边界，并为最后一块肉保密。",
    metrics: { impulse: 50, discount: 35, social: 18 }
  },
  {
    id: "budget",
    code: "FBI-B03",
    name: "满减精算型",
    summary: "满减、红包、配送费在你脑内自动建模。",
    judgment: "系统发现你的饭点决策受价格曲线显著影响，精确到每一元配送费。",
    high: "凑满减、算红包、把第二杯半价讲成投资逻辑",
    recommended: "团购套餐、工作日特价、拼单外卖",
    caution: "无明码标价的随缘菜馆",
    risk: "精算过载级",
    comment: "你不是抠门，你是在进行碳水资产配置。",
    metrics: { impulse: 54, discount: 98, social: 62 }
  },
  {
    id: "premium",
    code: "FBI-B04",
    name: "拍照仪式型",
    summary: "普通饭点，也要有一张能发朋友圈的开场照。",
    judgment: "系统捕捉到高仪式感波形，你会为一碗饭安排角度、滤镜和心理建设。",
    high: "摆盘拍照、挑靠窗座位、把甜品称为句号",
    recommended: "广式早茶、精致简餐、奶茶甜品收尾",
    caution: "塑料袋里直接开吃",
    risk: "审美延迟级",
    comment: "建议继续保持，生活已经够忙，饭可以稍微隆重。",
    metrics: { impulse: 61, discount: 34, social: 78 }
  },
  {
    id: "spicy",
    code: "FBI-C01",
    name: "辣度上头型",
    summary: "微辣只是系统开机音，中辣才算进入频道。",
    judgment: "系统检测到辣度容忍异常，你可能把冒汗当作饭点氛围灯。",
    high: "主动加辣、点评辣椒香型、嘴上说还行",
    recommended: "川湘菜、麻辣香锅、冒菜",
    caution: "连续三天叠加极辣任务",
    risk: "红色预警级",
    comment: "研究所建议同步部署酸奶，不要让胃独自承担英雄主义。",
    metrics: { impulse: 88, discount: 41, social: 64 }
  },
  {
    id: "clean",
    code: "FBI-C02",
    name: "清爽回血型",
    summary: "油腻一退，打工人的理智回归。",
    judgment: "系统判定你偏好轻负担摄入，饭后还想保留一点清醒的操作系统。",
    high: "点汤菜、要少油、饭后还能继续开会",
    recommended: "蒸菜、轻食饭、清汤粉",
    caution: "厚重奶油加双倍芝士",
    risk: "低负担稳定级",
    comment: "你像一键清理缓存，但比手机管家更会吃。",
    metrics: { impulse: 38, discount: 33, social: 36 }
  },
  {
    id: "carb",
    code: "FBI-C03",
    name: "碳水托底型",
    summary: "米饭面条馒头，都是情绪安全垫。",
    judgment: "系统发现你与主食存在稳定互相奔赴关系，快乐常以淀粉形态出现。",
    high: "加饭、加面、看到炒饭自动停步",
    recommended: "葱油拌面、蛋炒饭、煲仔饭",
    caution: "只有菜叶没有主食的局",
    risk: "满足感拉满级",
    comment: "研究所确认：碳水不是退路，是你今天继续前进的燃料。",
    metrics: { impulse: 84, discount: 48, social: 42 }
  },
  {
    id: "protein",
    code: "FBI-C04",
    name: "硬菜压轴型",
    summary: "没有硬菜，饭点像没正式开席。",
    judgment: "系统识别到主菜优先级极高，你的菜单扫描会自动高亮肉类区域。",
    high: "问有没有牛肉、加蛋加鸡腿、对素菜保持礼貌距离",
    recommended: "卤肉饭、烤鱼、铁板牛肉",
    caution: "只有小菜和点心的下午茶局",
    risk: "高能量占有级",
    comment: "建议搭配一点蔬菜，给系统留出散热空间。",
    metrics: { impulse: 78, discount: 39, social: 52 }
  },
  {
    id: "late",
    code: "FBI-D01",
    name: "夜宵复活型",
    summary: "白天只是预告，晚上那顿才是正片。",
    judgment: "系统在深夜捕捉到强烈开饭信号，你的胃可能采用倒班制。",
    high: "十一点看菜单、收藏烧烤摊、把宵夜称为精神修复",
    recommended: "粥底火锅、烧烤、热汤粉",
    caution: "临睡前暴击式重油重辣",
    risk: "夜间活跃级",
    comment: "研究所建议留一盏小灯，也给明天的自己留一条活路。",
    metrics: { impulse: 91, discount: 44, social: 57 }
  },
  {
    id: "early",
    code: "FBI-D02",
    name: "早八续航型",
    summary: "早饭吃稳，早八才像能运行。",
    judgment: "系统确认你尊重一天的启动仪式，豆浆包子或咖啡三明治都被认真对待。",
    high: "早起买早餐、固定搭配、上午不轻易崩盘",
    recommended: "豆浆油条、鸡蛋三明治、热粥包子",
    caution: "空腹硬扛到午饭",
    risk: "晨间稳定级",
    comment: "你是研究所眼里罕见的启动规范样本。",
    metrics: { impulse: 43, discount: 36, social: 34 }
  },
  {
    id: "indecisive",
    code: "FBI-D03",
    name: "吃啥纠结型",
    summary: "想吃的很多，能决定的很少。",
    judgment: "系统检测到菜单分叉过多，建议把选择权暂时外包给饭桶研究所。",
    high: "问三遍吃啥、打开外卖又退出、最后点了昨天那家",
    recommended: "双拼饭、套餐、朋友指定款",
    caution: "有 128 道菜的大菜单",
    risk: "高纠结滞留级",
    comment: "你不是没主见，你只是对每一种好吃都抱有基本尊重。",
    metrics: { impulse: 49, discount: 67, social: 55 }
  },
  {
    id: "leftover",
    code: "FBI-D04",
    name: "冰箱清仓型",
    summary: "剩菜不是剩菜，是明天的伏笔。",
    judgment: "系统发现你具备强资源整合能力，一碗饭能把冰箱库存全部谈拢。",
    high: "翻冰箱、改造剩菜、把半根黄瓜纳入宏大计划",
    recommended: "炒饭、汤面、杂蔬锅",
    caution: "需要新鲜现买所有材料的大菜",
    risk: "勤俭创造级",
    comment: "研究所认为你拥有把普通食材讲成连续剧的能力。",
    metrics: { impulse: 52, discount: 86, social: 31 }
  }
];

export const questions = [
  {
    text: "饭点提前三十分钟，你的系统通常先弹出什么提醒？",
    options: [
      { title: "食堂路线已规划", desc: "电梯、窗口、付款码，一条龙预热。", add: ["rush", "early"] },
      { title: "评论区开始考古", desc: "先看图，再看差评，再看老板回复。", add: ["archive", "indecisive"] },
      { title: "群里发起拼单", desc: "先问大家吃啥，再把问题聊复杂。", add: ["social", "budget"] },
      { title: "先假装不饿", desc: "直到胃部敲桌，才承认现实。", add: ["late", "random"] }
    ]
  },
  {
    text: "面对一家没吃过的小店，你会怎么处理？",
    options: [
      { title: "冲进去再说", desc: "人生需要一些热乎的未知。", add: ["random", "rush"] },
      { title: "先查十页评价", desc: "对踩雷的容忍度低于配送费。", add: ["archive", "budget"] },
      { title: "找人一起试错", desc: "好吃共享，不好吃共担。", add: ["social", "spicy"] },
      { title: "回老地方", desc: "世界很大，但固定窗口很可靠。", add: ["comfort", "clean"] }
    ]
  },
  {
    text: "如果今天只能选一种饭点快乐，你更偏向哪种？",
    options: [
      { title: "碳水落地", desc: "米饭面条一到，灵魂坐稳。", add: ["carb", "comfort"] },
      { title: "硬菜登场", desc: "主菜必须有姓名，最好还有分量。", add: ["protein", "premium"] },
      { title: "辣度上头", desc: "吃到额头发光才算进入状态。", add: ["spicy", "late"] },
      { title: "清爽回血", desc: "吃完还想保留一点理智。", add: ["clean", "early"] }
    ]
  },
  {
    text: "点外卖时，最容易改变你决定的是？",
    options: [
      { title: "满减差两块", desc: "宇宙在暗示你加个卤蛋。", add: ["budget", "leftover"] },
      { title: "预计送达时间", desc: "超过四十分钟，感情自动冷却。", add: ["rush", "solo"] },
      { title: "图片很能打", desc: "摆盘好看，心里先加三分。", add: ["premium", "random"] },
      { title: "熟悉的店名", desc: "未知会犹豫，熟人局会安心。", add: ["comfort", "indecisive"] }
    ]
  },
  {
    text: "朋友问你“今天吃什么”，你最像哪一句？",
    options: [
      { title: "我都行，但别太远", desc: "看似随和，实则距离严控。", add: ["comfort", "clean"] },
      { title: "火锅？烤肉？都能聊", desc: "你已经准备好组织饭局。", add: ["social", "protein"] },
      { title: "你决定，我执行", desc: "把选择权交出去是一种解脱。", add: ["indecisive", "random"] },
      { title: "等下，我这有券", desc: "饭桌预算官正式上线。", add: ["budget", "archive"] }
    ]
  },
  {
    text: "一天中最能拯救你的那顿饭，通常是？",
    options: [
      { title: "早餐", desc: "早八启动正确，整天不乱。", add: ["early", "clean"] },
      { title: "午饭", desc: "午饭是打工日的中场维修。", add: ["rush", "carb"] },
      { title: "晚饭", desc: "终于可以认真对待自己。", add: ["premium", "comfort"] },
      { title: "夜宵", desc: "夜深了，系统才真的醒。", add: ["late", "spicy"] }
    ]
  },
  {
    text: "冰箱里剩下一点饭、一点菜和半瓶酱，你会？",
    options: [
      { title: "立刻炒饭", desc: "万物皆可回锅，且有机会变好吃。", add: ["leftover", "carb"] },
      { title: "再买个硬菜补强", desc: "库存需要主角，不然故事不完整。", add: ["protein", "premium"] },
      { title: "点外卖算了", desc: "冰箱问题交给明天的我。", add: ["random", "late"] },
      { title: "精算组合", desc: "把现有食材凑成不浪费方案。", add: ["budget", "archive"] }
    ]
  },
  {
    text: "吃完一顿满意的饭，你最可能出现的行为是？",
    options: [
      { title: "收藏并标注", desc: "未来复购路线已经入库。", add: ["archive", "comfort"] },
      { title: "发给朋友", desc: "好吃不传播，等于没有完成闭环。", add: ["social", "premium"] },
      { title: "宣布回血", desc: "刚才那口直接修复今日精神损耗。", add: ["carb", "protein"] },
      { title: "开始想下一顿", desc: "系统刚结算，系统又启动。", add: ["late", "rush"] }
    ]
  }
];

export const meals = [
  { name: "番茄牛腩饭", reason: "酸甜稳场，肉量负责，适合假装今天一切可控。" },
  { name: "葱油拌面加煎蛋", reason: "决策成本低，快乐回报高，研究所给出快速通过。" },
  { name: "麻辣烫少点神秘丸子", reason: "自由组合但别太放飞，给明天的自己留一点余地。" },
  { name: "烤鸡腿便当", reason: "主菜明确，碳水在场，系统判断为高完成度摄入。" },
  { name: "虾仁炒饭配紫菜汤", reason: "冰箱清仓型友好，也适合所有需要被热饭安慰的人。" },
  { name: "菌菇鸡汤米线", reason: "热汤能把混乱按回座位，适合轻微灵魂掉线。" },
  { name: "牛肉粉加青菜", reason: "硬菜和清爽同时在线，属于饭桶研究所平衡样本。" },
  { name: "小火锅单人局", reason: "不需要组局审批，一个人也能把仪式感煮开。" },
  { name: "黄焖鸡米饭", reason: "稳定、热乎、有汤汁，是打工日的标准修复包。" },
  { name: "煎饼果子加里脊", reason: "适合早八紧急启动，边走边吃也不耽误人生。" },
  { name: "麻辣香锅微辣", reason: "选择权交给夹子，快乐交给锅气，但辣度别太逞强。" },
  { name: "广式早茶拼盘", reason: "适合把普通一天开成慢一点的局，研究所批准喝茶续航。" },
  { name: "奶茶加小料", reason: "不算正餐，但很适合给下午三点的灵魂续一口电。" }
];
