import { desc, eq, like, or, sql } from "drizzle-orm";
import { getDb } from "./connection";
import { insights } from "@db/schema";

export type InsightRow = typeof insights.$inferSelect;

export async function listInsights(opts: { category?: string; search?: string; limit?: number }) {
  const db = getDb();
  const conditions = [];
  if (opts.category && opts.category !== "all") {
    conditions.push(eq(insights.category, opts.category));
  }
  if (opts.search) {
    const kw = `%${opts.search}%`;
    conditions.push(or(like(insights.title, kw), like(insights.viewpoint, kw)));
  }
  const base = db.select().from(insights);
  const rows = await (conditions.length
    ? base.where(conditions.length === 1 ? conditions[0] : sql`${sql.join(conditions, sql` AND `)}`)
    : base
  )
    .orderBy(desc(insights.publishedAt))
    .limit(opts.limit ?? 30);
  return rows;
}

/** 查重：生成快评前先判断（避免对已知条目重复调用 AI） */
export async function insightExistsByUrl(sourceUrl: string): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .select({ id: insights.id })
    .from(insights)
    .where(eq(insights.sourceUrl, sourceUrl))
    .limit(1);
  return rows.length > 0;
}

/** 按来源 URL 去重插入；已存在则跳过（返回受影响行数） */
export async function insertInsightIfNew(v: {
  sourceName: string;
  sourceUrl: string;
  title: string;
  category: string;
  publishedAt: Date | null;
  viewpoint: string;
}): Promise<boolean> {
  const db = getDb();
  const existing = await db
    .select({ id: insights.id })
    .from(insights)
    .where(eq(insights.sourceUrl, v.sourceUrl))
    .limit(1);
  if (existing.length > 0) return false;
  await db.insert(insights).values(v);
  return true;
}
