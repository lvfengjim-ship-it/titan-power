// AI 投资评估报告 —— SSE 流式端点
// POST /api/ai/report  body: { projectType, params, metrics }
// 前端已计算财务指标（IRR/LCOE/NPV/回收期），后端组装 prompt 调 DeepSeek 并 SSE 转发
import type { Context } from "hono";
import { stream } from "hono/streaming";
import { deepseekChatStream, hasDeepSeekKey } from "./deepseek";
import { getReportSystemPrompt, normalizeReportLang } from "./prompts";

// 限流：每 IP 每日 20 次（内存计数，重启清零）
const DAY = 24 * 60 * 60 * 1000;
const LIMIT = 20;
const hits = new Map<string, { reset: number; count: number }>();

function checkRate(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { reset: now + DAY, count: 1 });
    return true;
  }
  if (rec.count >= LIMIT) return false;
  rec.count += 1;
  return true;
}

export async function aiReportHandler(c: Context) {
  const ip =
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "anonymous";

  if (!hasDeepSeekKey()) {
    return c.json({ error: "AI 服务未配置" }, 503);
  }
  if (!checkRate(ip)) {
    return c.json({ error: "已达到今日免费评估次数上限（20 次/日），请明天再来" }, 429);
  }

  let body: { projectType?: string; params?: unknown; metrics?: unknown; lang?: unknown };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "请求格式错误" }, 400);
  }
  if (!body.projectType || !body.params || !body.metrics) {
    return c.json({ error: "缺少必要参数 projectType / params / metrics" }, 400);
  }

  // 报告语言：默认中文，lang='en' 时生成英文报告
  const lang = normalizeReportLang(body.lang);

  const userPrompt = `项目类型：${body.projectType}
项目参数：${JSON.stringify(body.params, null, 2)}
前端已计算财务指标：${JSON.stringify(body.metrics, null, 2)}
请输出投资评估解读报告。${lang === "en" ? "\nRespond entirely in English." : ""}`;

  let upstream: Response;
  try {
    upstream = await deepseekChatStream([
      { role: "system", content: getReportSystemPrompt(lang) },
      { role: "user", content: userPrompt },
    ]);
  } catch (e) {
    return c.json({ error: `AI 服务暂不可用：${(e as Error).message}` }, 502);
  }

  c.header("Content-Type", "text/event-stream; charset=utf-8");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");
  return stream(c, async (s) => {
    const reader = upstream.body!.getReader();
    const decoder = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      // 原样转发上游 OpenAI 兼容 SSE 帧（data: {...}\n\n）
      await s.write(decoder.decode(value, { stream: true }));
    }
  });
}
