#!/usr/bin/env node
// titan-power.cn 视频抓取端（运行在 Mac Studio，零 npm 依赖，Node 20+）
// 流程：经本机代理(curl -x)抓 YouTube Data API → DeepSeek 中文解读(直连)
//       → 下载缩略图(base64) → POST 到云服务器 /api/videos/ingest
// 配置：同目录 .env（见 .env.example），或环境变量：
//   YOUTUBE_API_KEY  DEEPSEEK_API_KEY  INGEST_URL  INGEST_TOKEN
//   PROXY（默认 http://127.0.0.1:7890，按你的代理工具端口改）
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const DIR = path.dirname(fileURLToPath(import.meta.url));

// 读取同目录 .env（简单 KEY=VALUE 解析，不覆盖已有环境变量）
try {
  for (const line of fs.readFileSync(path.join(DIR, ".env"), "utf8").split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch { /* .env 可选 */ }

const YT_KEY = process.env.YOUTUBE_API_KEY || "";
const DS_KEY = process.env.DEEPSEEK_API_KEY || "";
const INGEST_URL = process.env.INGEST_URL || "https://titan-power.cn/api/videos/ingest";
const INGEST_TOKEN = process.env.INGEST_TOKEN || "";
const PROXY = process.env.PROXY || "http://127.0.0.1:7890";

if (!YT_KEY || !INGEST_TOKEN) {
  console.error("[agent] 缺少 YOUTUBE_API_KEY 或 INGEST_TOKEN，请检查 .env");
  process.exit(1);
}

// 策展关键词：分类 -> YouTube 搜索词（与服务器端历史逻辑一致）
const QUERIES = [
  { category: "nuclear", q: "small modular reactor SMR nuclear technology" },
  { category: "nuclear", q: "nuclear fusion breakthrough energy" },
  { category: "hydrogen", q: "green hydrogen electrolyzer technology" },
  { category: "storage", q: "flow battery grid energy storage" },
  { category: "storage", q: "solid state battery breakthrough" },
  { category: "solar", q: "perovskite solar cell technology" },
  { category: "wind", q: "floating offshore wind farm technology" },
];

/** 经代理的 HTTP GET（curl），返回 Buffer */
async function proxiedGet(url, maxTime = 30) {
  const { stdout } = await run("curl", [
    "-sS", "-x", PROXY, "--max-time", String(maxTime), "-L", url,
  ], { encoding: "buffer", maxBuffer: 8 * 1024 * 1024 });
  return stdout;
}

async function proxiedGetJson(url) {
  const buf = await proxiedGet(url);
  return JSON.parse(buf.toString("utf8"));
}

function parseDuration(iso) {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso ?? "");
  if (!m) return 0;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

/** DeepSeek 中文解读（api.deepseek.com 国内直连，不走代理） */
async function summarize(title, description) {
  const fallback = { aiTitle: title, aiSummary: (description || "").slice(0, 200), aiContent: "" };
  if (!DS_KEY) return fallback;
  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${DS_KEY}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        max_tokens: 500,
        messages: [
          { role: "system", content: '你是能源科技编辑。根据给定的英文视频标题与简介，输出 JSON：{"aiTitle":"中文标题(30字内)","aiSummary":"3条速读要点，每条一行，以·开头","aiContent":"150字中文解读，面向中国能源行业从业者"}。只输出 JSON。' },
          { role: "user", content: `Title: ${title}\nDescription: ${(description || "").slice(0, 1200)}` },
        ],
      }),
    });
    if (!res.ok) throw new Error(`deepseek ${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    const m = /\{[\s\S]*\}/.exec(text);
    if (m) {
      const p = JSON.parse(m[0]);
      return { aiTitle: p.aiTitle || title, aiSummary: p.aiSummary || "", aiContent: p.aiContent || "" };
    }
  } catch (e) {
    console.warn(`[agent] summarize failed: ${e.message}`);
  }
  return fallback;
}

async function main() {
  console.log(`[agent] ${new Date().toISOString()} 开始抓取（代理 ${PROXY}）`);
  const out = [];

  for (const { category, q } of QUERIES) {
    try {
      const searchUrl = "https://www.googleapis.com/youtube/v3/search?" + new URLSearchParams({
        part: "snippet", q, type: "video", order: "date", maxResults: "4",
        relevanceLanguage: "en", key: YT_KEY,
      });
      const searchData = await proxiedGetJson(searchUrl);
      if (searchData.error) throw new Error(`youtube: ${searchData.error.message}`);
      const items = searchData.items ?? [];
      const ids = items.map((i) => i.id?.videoId).filter(Boolean);
      if (!ids.length) continue;

      const videosUrl = "https://www.googleapis.com/youtube/v3/videos?" + new URLSearchParams({
        part: "contentDetails", id: ids.join(","), key: YT_KEY,
      });
      let durationMap = new Map();
      try {
        const vd = await proxiedGetJson(videosUrl);
        durationMap = new Map((vd.items ?? []).map((v) => [v.id ?? "", parseDuration(v.contentDetails?.duration ?? "")]));
      } catch { /* 时长获取失败不阻塞 */ }

      for (const item of items) {
        const vid = item.id?.videoId;
        const sn = item.snippet;
        if (!vid || !sn?.title) continue;
        const ai = await summarize(sn.title, sn.description ?? "");
        // 缩略图（经代理下载 → base64）
        let thumbnailBase64 = "";
        const thumbUrl = sn.thumbnails?.high?.url || sn.thumbnails?.medium?.url || "";
        if (thumbUrl) {
          try {
            thumbnailBase64 = (await proxiedGet(thumbUrl, 20)).toString("base64");
          } catch { /* 无图也可入库 */ }
        }
        out.push({
          youtubeId: vid,
          title: sn.title,
          channelTitle: sn.channelTitle ?? "",
          durationSec: durationMap.get(vid) ?? 0,
          publishedAt: sn.publishedAt ?? null,
          category,
          videoUrl: `https://www.youtube.com/watch?v=${vid}`,
          ...ai,
          thumbnailBase64,
        });
        console.log(`[agent]   + [${category}] ${sn.title.slice(0, 60)}`);
      }
    } catch (e) {
      console.warn(`[agent] 查询失败 "${q}": ${e.message}`);
    }
  }

  if (!out.length) {
    console.error("[agent] 未抓到任何视频（检查代理是否运行、配额是否耗尽），本次不推送");
    process.exit(2);
  }

  // 推送到云服务器
  const res = await fetch(INGEST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${INGEST_TOKEN}` },
    body: JSON.stringify({ videos: out }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`[agent] 推送失败 HTTP ${res.status}: ${text}`);
    process.exit(3);
  }
  console.log(`[agent] 推送成功：${text}`);
}

main().catch((e) => {
  console.error(`[agent] fatal: ${e.message}`);
  process.exit(1);
});
