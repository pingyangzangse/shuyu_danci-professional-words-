# 术语闪卡 · 制造 & AI

一个零依赖单文件闪卡网页 App，专门记「缩写 ↔ 英文全称 + 中文详解」。
线上地址：https://pingyangzangse.github.io/shuyu_danci-professional-words-/

## 功能

- **闪卡模式**：正面缩写 + 缩写音标（喇叭朗读缩写），点击翻面看全称 + 全称音标（喇叭朗读全称，英音 en-GB）+ 250~400 字详解（通俗类比 / 全局位置 / 解决痛点）+ 关联词条跳转
- **全部词表**：搜索、领域筛选、只看已掌握/不熟；点击任意词条直达详解卡片
- **标记系统**：已掌握 / 还不熟，进度自动保存
- **账号登录**（与 DeepTalk 共用账号体系，账号互通）：
  - 邮箱 + 密码登录 / 注册
  - 邮箱验证码登录
  - 数字钱包签名登录（MetaMask 等浏览器插件，未注册自动建号）
  - 登录后进度与自定义词条云端同步，多设备一致；游客模式数据在本机，登录后自动合并上云
- **生词录入**：
  - 添加单个词：表单手动填写（缩写/全称/释义必填，详解/音标选填）
  - 批量导入：复制内置提示词 → 粘贴给任意 AI（DeepSeek/Kimi/豆包，可只说一个领域让它自动扩词 20~50 个）→ 把返回的 JSON 粘贴回来 → 勾选确认入库
- 内置词库 351 条（制造 163 + AI 175，华为 IPD 价值链 + AI 全栈），全部配双音标与详解

## 架构

```
GitHub Pages（静态单文件 index.html）
   │  https://knowledge-share.alaric.wiki/api（CORS 已放开）
   ▼
DeepTalk knowledge-share 后端（Express）
   ├─ 复用：auth 登录注册 / 验证码 / 钱包 SIWE / ks_users / ks_tokens
   └─ 新增：src/routes/flashcards.js（ks_flash_terms / ks_flash_progress 两表）
```

## 更新内置词库

改 `../术语总表.md` 后重新生成（本机无 Node 时用 DSH 会话跑）：

```bash
node build.js   # 术语总表.md → index.html（仅内置词条；详解/音标在 data/*.json，由 merge.js 合并）
```

## 文件

| 文件 | 说明 |
|---|---|
| index.html | 最终 App（单文件，数据内嵌） |
| template.html | 界面模板 |
| build.js / merge.js | 构建脚本 |
| data/*.json | 各小类详解 + 双音标数据 |
