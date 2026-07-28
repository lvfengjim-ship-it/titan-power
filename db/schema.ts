import {
  mysqlTable,
  serial,
  varchar,
  text,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";

// 前沿技术视频缓存（YouTube 抓取 + DeepSeek 中文解读）
export const videos = mysqlTable("videos", {
  id: serial("id").primaryKey(),
  youtubeId: varchar("youtube_id", { length: 32 }).notNull().unique(),
  title: varchar("title", { length: 512 }).notNull(),
  channelTitle: varchar("channel_title", { length: 255 }).notNull().default(""),
  thumbnailUrl: varchar("thumbnail_url", { length: 1024 }).notNull().default(""),
  durationSec: int("duration_sec").notNull().default(0),
  publishedAt: timestamp("published_at"),
  category: varchar("category", { length: 64 }).notNull().default("other"),
  videoUrl: varchar("video_url", { length: 1024 }).notNull().default(""),
  aiTitle: varchar("ai_title", { length: 512 }).notNull().default(""),
  aiSummary: text("ai_summary"),
  aiContent: text("ai_content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// 合作意向 / 留资（联系表单 + AI 工具登记）
export const contacts = mysqlTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  org: varchar("org", { length: 255 }).notNull().default(""),
  phone: varchar("phone", { length: 64 }).notNull().default(""),
  email: varchar("email", { length: 255 }).notNull().default(""),
  type: varchar("type", { length: 64 }).notNull().default("other"),
  message: text("message"),
  source: varchar("source", { length: 64 }).notNull().default("contact"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
