import { desc, eq, like, or, sql } from "drizzle-orm";
import { getDb } from "./connection";
import { videos } from "@db/schema";

export type VideoRow = typeof videos.$inferSelect;

export async function listVideos(opts: { category?: string; search?: string; limit?: number }) {
  const db = getDb();
  const conditions = [];
  if (opts.category && opts.category !== "all") {
    conditions.push(eq(videos.category, opts.category));
  }
  if (opts.search) {
    const kw = `%${opts.search}%`;
    conditions.push(or(like(videos.title, kw), like(videos.aiTitle, kw), like(videos.aiSummary, kw)));
  }
  const base = db.select().from(videos);
  const rows = await (conditions.length
    ? base.where(conditions.length === 1 ? conditions[0] : sql`${sql.join(conditions, sql` AND `)}`)
    : base
  )
    .orderBy(desc(videos.publishedAt))
    .limit(opts.limit ?? 60);
  return rows;
}

export async function getVideoById(id: number) {
  const db = getDb();
  const rows = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function upsertVideo(v: {
  youtubeId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  durationSec: number;
  publishedAt: Date | null;
  category: string;
  videoUrl: string;
  aiTitle: string;
  aiSummary: string;
  aiContent: string;
}) {
  const db = getDb();
  await db
    .insert(videos)
    .values(v)
    .onDuplicateKeyUpdate({
      set: {
        title: v.title,
        channelTitle: v.channelTitle,
        thumbnailUrl: v.thumbnailUrl,
        durationSec: v.durationSec,
        publishedAt: v.publishedAt,
        category: v.category,
        aiTitle: v.aiTitle,
        aiSummary: v.aiSummary,
        aiContent: v.aiContent,
      },
    });
}

export async function countVideos() {
  const db = getDb();
  const rows = await db.select({ n: sql<number>`count(*)` }).from(videos);
  return Number(rows[0]?.n ?? 0);
}
