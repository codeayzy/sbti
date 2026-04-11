<p align="center">
  <img src="public/images/ctrl.png" alt="SBTI Logo" width="120" height="120" />
</p>

<h1 align="center">SBTI — 娱乐人格测试</h1>

<p align="center">
  <strong>一个纯娱乐向的性格测试网站，灵感来自 MBTI，但更有趣。</strong>
</p>

<p align="center">
  原作者：<a href="https://space.bilibili.com/417038183"><strong>B站 @蛆肉儿串儿</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Bun-Runtime-000?logo=bun&logoColor=white" alt="Bun" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/中文优先-绿色有机风-87A96B" alt="中文优先" />
</p>

---

## 在线体验

```bash
git clone https://github.com/your-username/sbti.git
cd sbti
bun install
bun dev
# 打开 http://localhost:8080
```

---

## 项目简介

SBTI 是一个**纯前端**、**无后端**的娱乐性格测试 SPA。通过回答一系列趣味问题，系统会基于 **15 个心理维度**、**5 大人格模型** 对你进行评分，最终匹配出 26 种人格类型中的一种。

> 纯娱乐产物，没有任何心理学依据，请勿当真。

---

## 特色亮点

- **26 种独特人格** — 24 种标准人格 + 2 种隐藏人格（酒鬼 & 傻乐者）
- **15 维度雷达图** — 覆盖自我、情感、态度、行动、社交五大模型
- **曼哈顿距离匹配** — 用向量相似度算法找到最匹配的人格
- **隐藏触发机制** — 特定答题路径可解锁隐藏人格
- **一键分享海报** — Canvas 绘制结果海报，支持 Web Share API
- **纯 CSS 动画** — 无任何动画库，藤蔓进度条、发芽弹跳、花瓣飘落
- **移动端优先** — 专为手机屏幕设计的植物绿色有机风界面
- **零后端依赖** — 评分、计算、持久化全部在浏览器端完成

---

## 26 种人格一览

| 代码 | 人格 | 一句话 |
|------|------|--------|
| `CTRL` | 拿捏者 | 怎么样，被我拿捏了吧？ |
| `ATM-er` | 送钱者 | 你以为我很有钱吗？ |
| `Dior-s` | 屌丝 | 等着我屌丝逆袭。 |
| `BOSS` | 领导者 | 方向盘给我，我来开。 |
| `THAN-K` | 感恩者 | 我感谢苍天！我感谢大地！ |
| `OH-NO` | 哦不人 | 哦不！我怎么会是这个人格？！ |
| `GOGO` | 行者 | gogogo~出发咯 |
| `SEXY` | 尤物 | 您就是天生的尤物！ |
| `LOVE-R` | 多情者 | 爱意太满，现实显得有点贫瘠。 |
| `MUM` | 妈妈 | 或许……我可以叫你妈妈吗……？ |
| `FAKE` | 伪人 | 已经，没有人类了。 |
| `OJBK` | 无所谓人 | 我说随便，是真的随便。 |
| `MALO` | 吗喽 | 人生是个副本，而我只是一只吗喽。 |
| `JOKE-R` | 小丑 | 原来我们都是小丑。 |
| `WOC!` | 握草人 | 卧槽，我怎么是这个人格？ |
| `THIN-K` | 思考者 | 已深度思考100s。 |
| `SHIT` | 愤世者 | 这个世界，构石一坨。 |
| `ZZZZ` | 装死者 | 我没死，我只是在睡觉。 |
| `POOR` | 贫困者 | 我穷，但我很专。 |
| `MONK` | 僧人 | 没有那种世俗的欲望。 |
| `IMSB` | 傻者 | 认真的么？我真的是傻逼么？ |
| `SOLO` | 孤儿 | 我哭了，我怎么会是孤儿？ |
| `FUCK` | 草者 | 操！这是什么人格？ |
| `DEAD` | 死者 | 我，还活着吗？ |
| `IMFW` | 废物 | 我真的……是废物吗？ |

**隐藏人格：**

| 代码 | 人格 | 触发条件 |
|------|------|----------|
| `DRUNK` | 酒鬼 | 特定答题路径触发（关于饮酒的连环问题） |
| `HHHH` | 傻乐者 | 标准匹配率低于 60% 时自动触发 |

---

## 评分体系

### 五大人格模型 × 15 个维度

每个模型包含 3 个维度，每个维度由 2 道题（分值 1-3）加总后映射为 L/M/H 三个等级：

```
自我模型    S1 自尊自信 · S2 自我清晰度 · S3 核心价值
情感模型    E1 依恋安全感 · E2 情感投入度 · E3 边界与依赖
态度模型    A1 世界观倾向 · A2 规则与灵活度 · A3 人生意义感
行动模型    Ac1 动机导向 · Ac2 决策风格 · Ac3 执行模式
社交模型    So1 社交主动性 · So2 人际边界感 · So3 表达与真实度
```

### 匹配算法

1. 用户作答后生成 15 维向量（如 `HHH-HMH-MHH-HHH-MHM`）
2. 与 24 种标准人格的特征向量进行**曼哈顿距离**计算
3. 距离最小的人格即为匹配结果
4. 特殊情况：相似度 < 60% 落入 `HHHH` 傻乐者

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | [Bun](https://bun.sh) — 开发服务器、构建工具、生产运行时 |
| 前端框架 | React 19 |
| 类型系统 | TypeScript 6（严格模式） |
| 样式方案 | 原生 CSS（CSS Custom Properties 设计令牌） |
| 构建产物 | `bun build` → 浏览器目标 + 压缩 |

**零依赖原则：** 没有路由库、没有状态管理库、没有动画库、没有 CSS 框架。

---

## 项目结构

```
src/
├── index.ts              # Bun 开发/生产服务器入口
├── index.html            # SPA HTML 壳
├── index.css             # 全局样式 + 设计令牌
├── App.tsx               # 根组件，屏幕路由
├── frontend.tsx          # 客户端 React 挂载点
├── context/
│   └── TestContext.tsx    # 全局状态（屏幕/答案/结果）
├── components/
│   ├── Intro/            # 首页 — 开始测试、查看历史
│   ├── Test/             # 答题页 — 问题卡片、藤蔓进度条
│   ├── Result/           # 结果页 — 人格展示、雷达图、分享
│   └── common/           # 通用组件（Toast 等）
├── data/
│   ├── types.ts          # 26 种人格定义与特征向量
│   ├── questions.ts      # 30 道常规题 + 2 道触发题
│   └── dimensions.ts     # 15 维度元数据与 L/M/H 解读
└── utils/
    ├── scoring.ts        # 评分算法 + 曼哈顿距离匹配
    └── share.ts          # 分享海报生成 + localStorage 持久化

public/
└── images/               # 26 张人格头像
```

---

## 快速开始

### 前置要求

- [Bun](https://bun.sh) >= 1.0

### 安装与运行

```bash
# 安装依赖
bun install

# 开发模式（HMR 热更新）
bun dev

# 生产构建
bun run build

# 生产运行
bun start
```

开发服务器和生产服务器均运行在 **8080** 端口。

---

## 设计风格

- **主色调：** Sage Green `#87A96B` + Mint Cream `#F0F7EE` + Forest Green `#2E5A3D`
- **字体：** Quicksand（英文标题）+ 系统中文字体栈
- **动效：** 纯 CSS 实现 — 藤蔓进度条、叶片飘落、发芽弹跳、纸屑庆祝
- **命名：** BEM 风格类名
- **响应式：** 移动端优先，从小屏向上适配

---

## 屏幕流程

```
┌─────────┐     ┌─────────┐     ┌──────────┐
│  Intro  │────>│  Test   │────>│  Result  │
│  首页    │     │  答题    │     │  结果     │
│         │<────│         │     │          │
└─────────┘     └─────────┘     └──────────┘
  开始测试        30+ 道题        人格匹配
  查看历史        随机打乱        雷达图
                                 维度解读
                                 分享海报
```

三个屏幕通过 React Context 的 `screen` 状态切换，无需路由库。

---

## License

MIT
