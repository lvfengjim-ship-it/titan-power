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
