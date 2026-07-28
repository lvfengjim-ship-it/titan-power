// YouTube 前沿技术视频抓取 + DeepSeek 中文解读 + 入库缓存
// 需要环境变量 YOUTUBE_API_KEY；无 key 时跳过抓取（前端有内置 fallback 数据）
import { deepseekChat, hasDeepSeekKey } from "../ai/deepseek";
import { upsertVideo, countVideos } from "../queries/videos";

// 策展关键词：分类 -> YouTube 搜索词（核能/氢能/储能/光伏/风电前沿）
const QUERIES: { category: string; q: string }[] = [
  { category: "nuclear", q: "small modular reactor SMR nuclear technology" },
  { category: "nuclear", q: "nuclear fusion breakthrough energy" },
  { category: "hydrogen", q: "green hydrogen electrolyzer technology" },
  { category: "storage", q: "flow battery grid energy storage" },
  { category: "storage", q: "solid state battery breakthrough" },
  { category: "solar", q: "perovskite solar cell technology" },
  { category: "wind", q: "floating offshore wind farm technology" },
];

function ytKey() {
  return process.env.YOUTUBE_API_KEY ?? "";
}

function parseDuration(iso: string): number {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso ?? "");
  if (!m) return 0;
  return (Number(m[1] ?? 0) * 3600) + (Number(m[2] ?? 0) * 60) + Number(m[3] ?? 0);
}

async function summarize(title: string, description: string): Promise<{ aiTitle: string; aiSummary: string; aiContent: string }> {
  if (!hasDeepSeekKey()) {
    return { aiTitle: title, aiSummary: description.slice(0, 200), aiContent: "" };
  }
  try {
    const out = await deepseekChat([
      {
        role: "system",
        content:
          '你是能源科技编辑。根据给定的英文视频标题与简介，输出 JSON：{"aiTitle":"中文标题(30字内)","aiSummary":"3条速读要点，每条一行，以·开头","aiContent":"150字中文解读，面向中国能源行业从业者"}。只输出 JSON。',
      },
      { role: "user", content: `Title: ${title}\nDescription: ${description.slice(0, 1200)}` },
    ], 500);
    const m = /\{[\s\S]*\}/.exec(out);
    if (m) {
      const parsed = JSON.parse(m[0]) as { aiTitle?: string; aiSummary?: string; aiContent?: string };
      return {
        aiTitle: parsed.aiTitle || title,
        aiSummary: parsed.aiSummary || "",
        aiContent: parsed.aiContent || "",
      };
    }
  } catch (e) {
    console.warn("[videos] summarize failed:", (e as Error).message);
  }
  return { aiTitle: title, aiSummary: description.slice(0, 200), aiContent: "" };
}

export async function fetchAndCacheVideos(): Promise<number> {
  if (!ytKey()) {
    console.log("[videos] YOUTUBE_API_KEY not set, skip fetch");
    return 0;
  }
  let imported = 0;
  for (const { category, q } of QUERIES) {
    try {
      const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
      searchUrl.search = new URLSearchParams({
        part: "snippet", q, type: "video", order: "date", maxResults: "4",
        relevanceLanguage: "en", key: ytKey(),
      }).toString();
      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) throw new Error(`search ${searchRes.status}`);
      const searchData = (await searchRes.json()) as {
        items?: { id?: { videoId?: string }; snippet?: { title?: string; description?: string; channelTitle?: string; publishedAt?: string; thumbnails?: { high?: { url?: string } } } }[];
      };
      const ids = (searchData.items ?? []).map((i) => i.id?.videoId).filter(Boolean) as string[];
      if (!ids.length) continue;

      const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
      videosUrl.search = new URLSearchParams({
        part: "contentDetails", id: ids.join(","), key: ytKey(),
      }).toString();
      const videosRes = await fetch(videosUrl);
      const videosData = videosRes.ok
        ? ((await videosRes.json()) as { items?: { id?: string; contentDetails?: { duration?: string } }[] })
        : { items: [] };
      const durationMap = new Map(
        (videosData.items ?? []).map((v) => [v.id ?? "", parseDuration(v.contentDetails?.duration ?? "")]),
      );

      for (const item of searchData.items ?? []) {
        const vid = item.id?.videoId;
        const sn = item.snippet;
        if (!vid || !sn?.title) continue;
        const ai = await summarize(sn.title, sn.description ?? "");
        await upsertVideo({
          youtubeId: vid,
          title: sn.title,
          channelTitle: sn.channelTitle ?? "",
          thumbnailUrl: sn.thumbnails?.high?.url ?? "",
          durationSec: durationMap.get(vid) ?? 0,
          publishedAt: sn.publishedAt ? new Date(sn.publishedAt) : null,
          category,
          videoUrl: `https://www.youtube.com/watch?v=${vid}`,
          aiTitle: ai.aiTitle,
          aiSummary: ai.aiSummary,
          aiContent: ai.aiContent,
        });
        imported += 1;
      }
    } catch (e) {
      console.warn(`[videos] fetch failed for "${q}":`, (e as Error).message);
    }
  }
  console.log(`[videos] imported/updated ${imported} videos`);
  return imported;
}

/** 启动每日 08:00 定时抓取；启动时若库为空则立即抓一次 */
export function scheduleVideoFetch() {
  const run = () => fetchAndCacheVideos().catch((e) => console.warn("[videos] cron error:", e));
  countVideos()
    .then((n) => {
      if (n === 0) run();
    })
    .catch(() => {});
  const now = new Date();
  const next = new Date(now);
  next.setHours(8, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const delay = next.getTime() - now.getTime();
  setTimeout(() => {
    run();
    setInterval(run, 24 * 60 * 60 * 1000);
  }, delay);
  console.log(`[videos] next fetch scheduled in ${Math.round(delay / 3600000)}h`);
}
