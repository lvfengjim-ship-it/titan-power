// 视频 ingest 端点 —— 接收 Mac 抓取端推送的 YouTube 前沿视频
// 大陆服务器无法访问 YouTube，抓取在 Mac Studio 完成（走代理），推送到本端点入库
// POST /api/videos/ingest  Header: Authorization: Bearer <INGEST_TOKEN>
// Body: { videos: IngestItem[] }，缩略图以 base64 随包上传，落盘 /thumbnails/<youtubeId>.jpg
// 每次 ingest 后滚动清理 7 天前的视频与缩略图（“7 天行业视频内容”窗口）
import type { Context } from "hono";
import fs from "node:fs";
import path from "node:path";
import { inArray, lt } from "drizzle-orm";
import { getDb } from "../queries/connection";
import { videos } from "@db/schema";
import { upsertVideo } from "../queries/videos";

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), "data");
const THUMB_DIR = path.join(DATA_DIR, "thumbnails");
const RETENTION_DAYS = 7;
const MAX_ITEMS = 100;

interface IngestItem {
  youtubeId?: string;
  title?: string;
  channelTitle?: string;
  durationSec?: number;
  publishedAt?: string | null;
  category?: string;
  videoUrl?: string;
  aiTitle?: string;
  aiSummary?: string;
  aiContent?: string;
  /** JPEG 缩略图 base64（Mac 端经代理下载后上传） */
  thumbnailBase64?: string;
}

function ensureThumbDir() {
  fs.mkdirSync(THUMB_DIR, { recursive: true });
}

export async function videosIngestHandler(c: Context) {
  const token = (process.env.INGEST_TOKEN || "").trim();
  if (!token) return c.json({ error: "服务端未配置 INGEST_TOKEN" }, 503);
  const auth = c.req.header("authorization") ?? "";
  if (auth !== `Bearer ${token}`) return c.json({ error: "Unauthorized" }, 401);

  let body: { videos?: IngestItem[] };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "请求格式错误" }, 400);
  }
  const items = Array.isArray(body.videos) ? body.videos.slice(0, MAX_ITEMS) : [];
  if (!items.length) return c.json({ error: "videos 为空" }, 400);

  ensureThumbDir();
  let ingested = 0;
  const errors: string[] = [];

  for (const item of items) {
    try {
      if (!item.youtubeId || !item.title) continue;
      // 缩略图落盘（有 base64 才覆盖，否则保留既有文件/URL）
      let thumbnailUrl = "";
      if (item.thumbnailBase64) {
        const buf = Buffer.from(item.thumbnailBase64, "base64");
        if (buf.length > 0 && buf.length <= 2 * 1024 * 1024) {
          fs.writeFileSync(path.join(THUMB_DIR, `${item.youtubeId}.jpg`), buf);
          thumbnailUrl = `/thumbnails/${item.youtubeId}.jpg`;
        }
      }
      await upsertVideo({
        youtubeId: item.youtubeId,
        title: item.title,
        channelTitle: item.channelTitle ?? "",
        thumbnailUrl: thumbnailUrl || `/thumbnails/${item.youtubeId}.jpg`,
        durationSec: item.durationSec ?? 0,
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        category: item.category ?? "other",
        videoUrl: item.videoUrl ?? `https://www.youtube.com/watch?v=${item.youtubeId}`,
        aiTitle: item.aiTitle ?? item.title,
        aiSummary: item.aiSummary ?? "",
        aiContent: item.aiContent ?? "",
      });
      ingested += 1;
    } catch (e) {
      errors.push(`${item.youtubeId}: ${(e as Error).message}`);
    }
  }

  // 滚动清理：删除 createdAt 早于 7 天的视频及其缩略图
  let pruned = 0;
  try {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 3600 * 1000);
    const db = getDb();
    const old = await db
      .select({ id: videos.id, youtubeId: videos.youtubeId })
      .from(videos)
      .where(lt(videos.createdAt, cutoff));
    if (old.length) {
      await db.delete(videos).where(inArray(videos.id, old.map((r) => Number(r.id))));
      for (const r of old) {
        try {
          fs.unlinkSync(path.join(THUMB_DIR, `${r.youtubeId}.jpg`));
        } catch {
          /* 文件不存在则忽略 */
        }
      }
      pruned = old.length;
    }
  } catch (e) {
    console.warn("[ingest] prune failed:", (e as Error).message);
  }

  console.log(`[ingest] ingested=${ingested} pruned=${pruned} errors=${errors.length}`);
  return c.json({ ok: true, ingested, pruned, errors: errors.slice(0, 10) });
}
