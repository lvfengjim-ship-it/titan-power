import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { aiReportHandler } from "./ai/report";
import { scheduleVideoFetch } from "./videos/fetch";
import { videosIngestHandler } from "./videos/ingest";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// ===== API 速率限制（安全审计 H-1 整改）=====
// 公开官网无需登录，但接口不能被无限刷：联系表单严格限流（防垃圾提交），
// 其余 API 宽松限流（防枚举/拖取）。内存固定窗口，单机部署足够。
const rateBuckets = new Map<string, { n: number; reset: number }>();
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateBuckets) if (now > v.reset) rateBuckets.delete(k);
}, 60_000).unref();

function hitRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  let b = rateBuckets.get(key);
  if (!b || now > b.reset) {
    b = { n: 0, reset: now + windowMs };
    rateBuckets.set(key, b);
  }
  b.n++;
  return b.n > limit;
}

app.use("/api/*", async (c, next) => {
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  // 联系表单提交：每 IP 每分钟 5 次；其余 API：每 IP 每分钟 120 次
  const limited = c.req.path.includes("contacts.submit")
    ? hitRateLimit(`contact:${ip}`, 5, 60_000)
    : hitRateLimit(`api:${ip}`, 120, 60_000);
  if (limited) {
    return c.json({ error: "请求过于频繁，请稍后再试" }, 429);
  }
  return next();
});

app.get("/api/health", (c) => c.json({ ok: true, ts: Date.now() }));
app.post("/api/ai/report", aiReportHandler);
// Mac 抓取端推送视频入库（Bearer INGEST_TOKEN 鉴权）
app.post("/api/videos/ingest", videosIngestHandler);

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStatic } = await import("@hono/node-server/serve-static");
  const { serveStaticFiles } = await import("./lib/vite");
  // 视频缩略图本地化存储（Mac 抓取端上传），DATA_DIR 默认 ./data，容器内挂卷 /app/data
  const dataDir = process.env.DATA_DIR || "./data";
  app.use("/thumbnails/*", serveStatic({ root: dataDir }));
  serveStaticFiles(app);

  // 启动时自动应用数据库迁移（幂等，无需 drizzle-kit）
  try {
    const { migrate } = await import("drizzle-orm/mysql2/migrator");
    const { getDb } = await import("./queries/connection");
    await migrate(getDb(), { migrationsFolder: "./db/migrations" });
    console.log("[db] migrations applied");
  } catch (e) {
    console.error("[db] migration failed:", (e as Error).message);
  }

  // 云部署模式（VIDEO_INGEST=1）：服务器不直连 YouTube，由 Mac 抓取端推送；
  // 否则保持服务器自抓取（需服务器自身能访问 googleapis.com）
  if (process.env.VIDEO_INGEST === "1") {
    console.log("[videos] ingest mode: server-side YouTube fetch disabled, waiting for Mac agent push");
  } else {
    scheduleVideoFetch();
  }

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
