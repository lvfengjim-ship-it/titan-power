// 国内政策/项目快讯自动扫描：政策源列表 → 关键词过滤 → DeepSeek 快评 → 入库（全自动发布）
// 政策源均为国内站点，服务器（阿里云国内）直连可达，无需代理。
// 设计约束：全自动无人审核——源宁精勿滥，生成约束严格（见 prompts.ts），
// 单次运行限量，失败不影响主站。
import { deepseekChat, hasDeepSeekKey } from "../ai/deepseek";
import { insertInsightIfNew, insightExistsByUrl } from "../queries/insights";
import { POLICY_SOURCES, classifyTitle, type PolicySource } from "./sources";
import { getViewpointSystemPrompt, getViewpointUserPrompt } from "./prompts";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const FETCH_TIMEOUT = 15_000;
const MAX_NEW_PER_RUN = 10; // 单次运行最多新生成条目（控制 DeepSeek 调用量）
const MAX_AGE_DAYS = 30; // 只处理最近 30 天发布的内容

interface CandidateItem {
  title: string;
  url: string;
  publishedAt: Date | null;
}

/** 抓取页面文本，自动识别编码（政府站有 GBK 遗留） */
async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  const head = Buffer.from(buf.slice(0, 2048)).toString("latin1");
  const m = /charset=["']?([a-zA-Z0-9-]+)/i.exec(head);
  let enc = (m?.[1] ?? "utf-8").toLowerCase();
  if (enc === "gb2312" || enc === "gbk") enc = "gb18030";
  try {
    return new TextDecoder(enc).decode(buf);
  } catch {
    return new TextDecoder("utf-8").decode(buf);
  }
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").trim();
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-zA-Z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);
}

function parseDate(s: unknown): Date | null {
  if (typeof s !== "string") return null;
  const d = new Date(s.trim().replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** xhcloud CMS：从列表页 HTML 自动发现 datasource，再取 ./ds_<id>.json */
async function fetchCmsJsonItems(src: PolicySource): Promise<CandidateItem[]> {
  const html = await fetchText(src.listUrl);
  const dir = src.listUrl.slice(0, src.listUrl.lastIndexOf("/") + 1);
  const ids = [...new Set([...html.matchAll(/data="datasource:([a-f0-9]{32})"/g)].map((m) => m[1]))];
  const preview = /preview="([a-zA-Z_]*)"/.exec(html)?.[1] || "ds_";
  const items: CandidateItem[] = [];
  for (const id of ids) {
    try {
      const res = await fetch(`${dir}${preview}${id}.json`, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as unknown;
      const arr = Array.isArray(data)
        ? data
        : (data as { datasource?: unknown[] }).datasource;
      if (!Array.isArray(arr)) continue;
      for (const raw of arr) {
        const it = raw as { showTitle?: unknown; publishUrl?: unknown; publishTime?: unknown };
        const title = stripTags(String(it.showTitle ?? "")).trim();
        const rawUrl = String(it.publishUrl ?? "");
        if (!title || title.length < 8 || !rawUrl) continue;
        let url: string;
        try {
          url = new URL(rawUrl, src.listUrl).toString();
        } catch {
          continue;
        }
        items.push({ title, url, publishedAt: parseDate(it.publishTime) });
      }
    } catch (e) {
      console.warn(`[insights] ${src.name} ds=${id} 获取失败:`, (e as Error).message);
    }
  }
  return items;
}

/** 直链解析：列表页 <a> 的 title 属性或链接文本作为标题 */
async function fetchHtmlLinkItems(src: PolicySource): Promise<CandidateItem[]> {
  const html = await fetchText(src.listUrl);
  const items: CandidateItem[] = [];
  const re = /<a\s+[^>]*href="([^"]+)"[^>]*?(?:title="([^"]*)")?[^>]*>([\s\S]*?)<\/a>/gi;
  for (const m of html.matchAll(re)) {
    const [, href, titleAttr, inner] = m;
    const title = (titleAttr || stripTags(inner)).trim();
    if (!title || title.length < 10 || title.length > 120) continue;
    if (!/\.s?html?/i.test(href)) continue; // 只要文章页
    let url: string;
    try {
      url = new URL(href, src.listUrl).toString();
    } catch {
      continue;
    }
    items.push({ title, url, publishedAt: null });
  }
  // 去重（同 URL）
  const seen = new Set<string>();
  return items.filter((it) => (seen.has(it.url) ? false : (seen.add(it.url), true)));
}

async function processItem(src: PolicySource, it: CandidateItem): Promise<boolean> {
  const category = classifyTitle(it.title);
  if (!category) return false;
  // 先查重再调用 DeepSeek（避免每轮对已知条目重复生成）
  if (await insightExistsByUrl(it.url)) return false;
  const html = await fetchText(it.url);
  const bodyText = htmlToText(html);
  if (bodyText.length < 100) return false;
  const viewpoint = await deepseekChat(
    [
      { role: "system", content: getViewpointSystemPrompt() },
      {
        role: "user",
        content: getViewpointUserPrompt({
          title: it.title,
          sourceName: src.name,
          publishedAt: it.publishedAt?.toISOString().slice(0, 10) ?? "",
          bodyText,
        }),
      },
    ],
    700,
  );
  if (!viewpoint || viewpoint.replace(/[\s。]/g, "") === "无关") return false;
  return insertInsightIfNew({
    sourceName: src.name,
    sourceUrl: it.url,
    title: it.title.slice(0, 500),
    category,
    publishedAt: it.publishedAt,
    viewpoint: viewpoint.slice(0, 2000),
  });
}

export async function scanPolicies(): Promise<number> {
  if (!hasDeepSeekKey()) {
    console.warn("[insights] 未配置 DEEPSEEK_API_KEY，跳过政策扫描");
    return 0;
  }
  let created = 0;
  for (const src of POLICY_SOURCES) {
    if (created >= MAX_NEW_PER_RUN) break;
    try {
      const items = src.type === "cms-json" ? await fetchCmsJsonItems(src) : await fetchHtmlLinkItems(src);
      const fresh = items
        .filter((it) => {
          if (it.publishedAt && Date.now() - it.publishedAt.getTime() > MAX_AGE_DAYS * 864e5) return false;
          return classifyTitle(it.title) !== null;
        })
        .slice(0, 20); // 每源最多检查 20 条候选
      for (const it of fresh) {
        if (created >= MAX_NEW_PER_RUN) break;
        try {
          if (await processItem(src, it)) {
            created++;
            console.log(`[insights] 新增快讯: ${it.title}`);
          }
        } catch (e) {
          console.warn("[insights] 条目处理失败:", it.url, (e as Error).message);
        }
      }
    } catch (e) {
      console.warn(`[insights] 源 ${src.name} 扫描失败:`, (e as Error).message);
    }
  }
  console.log(`[insights] 扫描完成，新增 ${created} 条`);
  return created;
}

export function scheduleInsightsFetch() {
  const run = () => scanPolicies().catch((e) => console.warn("[insights] cron error:", e));
  // 启动 45 秒后首跑（等待数据库迁移完成），之后每 6 小时一轮
  // 政策发布后最迟约 6 小时入站，远快于 48 小时快评要求
  setTimeout(run, 45_000);
  setInterval(run, 6 * 60 * 60 * 1000);
}
