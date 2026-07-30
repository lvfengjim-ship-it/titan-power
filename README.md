# 彭田环保 PT MOMENTUM — titan-power.cn

海南彭田环保科技有限公司官网：分布式光伏、分布式风电、工商业储能/独立储能电站的投资、并购与运营。

## 功能

- **AI 投资评估工具**（/ai-tool）：光伏 / 风电 / 储能 / 光储一体化项目参数录入 → 前端财务测算（IRR / LCOE / NPV / 动态回收期，分布式光伏支持自用电价+上网电价双电价模型）→ DeepSeek 流式生成 AI 投资解读报告（每 IP 每日 20 次）
- **前沿技术洞察**（/insights）：每日自动抓取海外公开渠道前沿能源技术视频（核能 SMR/聚变、氢能、液流/固态电池、钙钛矿等）+ DeepSeek 中文解读，附来源与版权说明
- 公众号 / 视频号入口（二维码占位，申请中）
- 联系表单留资（tRPC 入库）

## 技术栈

React 19 + Vite + Tailwind + shadcn/ui ｜ Hono + tRPC + Drizzle + MySQL ｜ DeepSeek API（OpenAI 兼容协议）

## 部署（Mac Studio）

仓库内含预编译 `dist/` 产物，无需 npm install：

```bash
printf 'DEEPSEEK_API_KEY=sk-xxx\nYOUTUBE_API_KEY=\n' > .env
docker compose up -d --build   # 访问 http://localhost:3100
```

日常更新：`git pull && docker compose up -d --build`

详见 DEPLOY.md。
