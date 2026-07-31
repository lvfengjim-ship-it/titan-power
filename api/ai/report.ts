// AI 投资评估报告 —— SSE 流式端点
// POST /api/ai/report  body: { projectType, params, metrics }
// 前端已计算财务指标（IRR/LCOE/NPV/回收期），后端组装 prompt 调 DeepSeek 并 SSE 转发
import type { Context } from "hono";
import { stream } from "hono/streaming";
import { deepseekChatStream, hasDeepSeekKey } from "./deepseek";

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

const SYSTEM_PROMPT = `你是彭田环保（PT Momentum）的资深新能源投资分析师，专注中国分布式光伏、风电、储能电站的投资、并购与运营。
请基于用户给出的项目参数与已计算的财务指标，输出一份专业的中文投资评估解读报告（Markdown 格式），结构：
1. 结论与评级（强烈关注 / 可关注 / 谨慎 / 回避，并给一句话理由）
2. 收益质量分析（IRR、LCOE、回收期的行业横向比较与解读）
3. 关键敏感因素（电价、利用小时、造价、利率变化的影响）
4. 主要风险提示（政策、消纳、电价市场化、技术衰减、融资等，结合项目类型）
5. 交易与结构建议（股债结构、税务安排如三免三减半、并购尽调要点）
要求：专业、克制、数据驱动，引用用户给出的具体数字；不要编造政策文号；文末加免责声明"本报告由 AI 自动生成，仅供参考，不构成投资建议"。
严格要求：报告标题与全文必须严格对应给定的"项目类型"——纯光伏项目不得出现储能内容，纯储能项目不得出现光伏/风电内容，风电项目不得出现光伏/储能内容；项目参数 JSON 中只包含该类型相关字段，不要臆测或补充未给出的设备配置。`;

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

  let body: { projectType?: string; params?: unknown; metrics?: unknown };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "请求格式错误" }, 400);
  }
  if (!body.projectType || !body.params || !body.metrics) {
    return c.json({ error: "缺少必要参数 projectType / params / metrics" }, 400);
  }

  const userPrompt = `项目类型：${body.projectType}
项目参数：${JSON.stringify(body.params, null, 2)}
前端已计算财务指标：${JSON.stringify(body.metrics, null, 2)}
请输出投资评估解读报告。`;

  let upstream: Response;
  try {
    upstream = await deepseekChatStream([
      { role: "system", content: SYSTEM_PROMPT },
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
