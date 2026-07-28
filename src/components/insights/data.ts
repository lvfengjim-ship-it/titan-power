/** 与后端 videos 表行结构对齐的统一视频模型（fallback 数据同样遵守） */
export interface InsightVideo {
  id: number
  youtubeId: string
  title: string
  channelTitle: string
  thumbnailUrl: string
  durationSec: number
  publishedAt: Date | string | null
  category: string
  videoUrl: string
  aiTitle: string
  aiSummary: string | null
  aiContent: string | null
}

export type CategoryKey = 'all' | 'solar' | 'wind' | 'storage' | 'hydrogen' | 'nuclear' | 'other'

export interface CategoryDef {
  key: CategoryKey
  label: string
  /** TagBadge 可用的 tone；other/all 用自定义色 */
  tone: 'gold' | 'volt' | 'storage' | 'hydrogen' | 'nuclear' | 'paper'
}

/** 7 个分类 Tab（顺序按 insights.md） */
export const CATEGORIES: CategoryDef[] = [
  { key: 'all', label: '全部', tone: 'volt' },
  { key: 'solar', label: '光伏', tone: 'gold' },
  { key: 'wind', label: '风电', tone: 'volt' },
  { key: 'storage', label: '储能', tone: 'storage' },
  { key: 'hydrogen', label: '氢能', tone: 'hydrogen' },
  { key: 'nuclear', label: '核能', tone: 'nuclear' },
  { key: 'other', label: '综合能源', tone: 'paper' },
]

export const CATEGORY_LABEL: Record<string, string> = {
  solar: '光伏',
  wind: '风电',
  storage: '储能',
  hydrogen: '氢能',
  nuclear: '核能',
  other: '综合能源',
}

export const CATEGORY_TONE: Record<string, CategoryDef['tone']> = {
  solar: 'gold',
  wind: 'volt',
  storage: 'storage',
  hydrogen: 'hydrogen',
  nuclear: 'nuclear',
  other: 'paper',
}

/** 秒 → mm:ss */
export function formatDuration(sec: number): string {
  if (!sec || sec <= 0) return '--:--'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** 相对时间：3 天前 / 2 周前 … */
export function timeAgo(input: Date | string | null): string {
  if (!input) return '日期待定'
  const d = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(d.getTime())) return '日期待定'
  const diff = Date.now() - d.getTime()
  const day = 86400_000
  if (diff < day) return '今天'
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`
  if (diff < 30 * day) return `${Math.floor(diff / (7 * day))} 周前`
  if (diff < 365 * day) return `${Math.floor(diff / (30 * day))} 个月前`
  return `${Math.floor(diff / (365 * day))} 年前`
}

export function formatDate(input: Date | string | null): string {
  if (!input) return ''
  const d = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* ------------------------------------------------------------------ */
/* 内置 fallback 演示数据（接口失败或为空时展示，id 为负数以示区别）        */
/* ------------------------------------------------------------------ */

const daysAgo = (n: number) => new Date(Date.now() - n * 86400_000)

export const FALLBACK_VIDEOS: InsightVideo[] = [
  {
    id: -1,
    youtubeId: 'c1b0xG3pZkM',
    title: 'How Small Modular Reactors Could Rewrite the Energy Map',
    channelTitle: 'Undecided with Matt Ferrell',
    thumbnailUrl: '/video-fallback.jpg',
    durationSec: 872,
    publishedAt: daysAgo(2),
    category: 'nuclear',
    videoUrl: 'https://www.youtube.com/watch?v=c1b0xG3pZkM',
    aiTitle: 'SMR 小型模块化反应堆如何改变能源格局',
    aiSummary:
      'SMR 通过工厂预制、现场拼装的"集装箱化"模式压缩核电建设周期与造价。要点：单堆功率 ≤300MWe，可灵活匹配工业园区与数据中心负荷；NuScale、Rolls-Royce SMR 进入许可冲刺阶段；对中国核电装备出海与分布式核能供热具有直接参考价值。',
    aiContent: `### 技术原理一句话\n\nSMR 把传统大型核电站"化整为零"：单堆功率控制在 300MWe 以内，反应堆模块在工厂预制后运抵现场拼装，用标准化换安全性与工期。\n\n### 关键进展\n\n- NuScale 小型堆设计获美国 NRC 认证，成为首个通过完整审查的 SMR 堆型。\n- Rolls-Royce SMR 进入英国通用设计审查（GDA）第二阶段，目标 2030 年代初并网。\n- 加拿大、波兰、捷克等国陆续公布 SMR 厂址规划，数据中心供电成为新场景。\n\n### 商业化时间表\n\n2027—2030 年首批示范堆投运；2030 年代中期进入批量化建设窗口，造价有望随批量下降 30% 以上。\n\n### 对中国行业的启示\n\n国内"玲龙一号"已率先示范，SMR 与工业园区热电联供、海上平台供电结合，是核电装备与工程服务出海的重要抓手。`,
  },
  {
    id: -2,
    youtubeId: 'h2Elec9QmX4',
    title: 'Green Hydrogen Electrolyzer Costs Fell 60% in Five Years — Here Is Why',
    channelTitle: 'Just Have a Think',
    thumbnailUrl: '/video-fallback.jpg',
    durationSec: 1085,
    publishedAt: daysAgo(4),
    category: 'hydrogen',
    videoUrl: 'https://www.youtube.com/watch?v=h2Elec9QmX4',
    aiTitle: '绿氢电解槽成本五年下降 60% 的背后',
    aiSummary:
      'PEM、碱性、SOEC 三条电解槽技术路线竞速，规模效应与催化剂降本是主线。要点：碱性电解槽成本最低但动态响应弱；PEM 适配波动性绿电；欧洲补贴与中国制造产能共同压低全球价格，绿氢平价时点或早于预期。',
    aiContent: `### 技术原理一句话\n\n电解槽利用可再生电力把水分解为氢气和氧气，绿氢的碳排放为零，成本核心取决于电价与电解槽设备造价。\n\n### 关键进展\n\n- 碱性电解槽单槽产能向 2000 Nm³/h 迈进，系统价格五年下降约 60%。\n- PEM 电解槽铱催化剂载量持续降低，适配风光波动出力。\n- 欧洲氢能银行拍卖落地，绿氢项目获得差价合约式补贴。\n\n### 商业化时间表\n\n2026—2028 年部分低电价地区绿氢成本有望与灰氢持平；2030 年绿氢在炼化、绿氨、绿色甲醇领域规模化替代。\n\n### 对中国行业的启示\n\n中国电解槽产能已占全球半数以上，"风光氢储"一体化项目将复制光伏的成本下降曲线，设备出口与绿氢衍生品贸易是下一波机会。`,
  },
  {
    id: -3,
    youtubeId: 's0lidBatt7Yp',
    title: 'Solid-State Battery Countdown: Toyota vs CATL Roadmaps',
    channelTitle: 'The Limiting Factor',
    thumbnailUrl: '/video-fallback.jpg',
    durationSec: 1367,
    publishedAt: daysAgo(6),
    category: 'storage',
    videoUrl: 'https://www.youtube.com/watch?v=s0lidBatt7Yp',
    aiTitle: '固态电池量产倒计时：丰田与宁德时代的路线之争',
    aiSummary:
      '固态电池以固态电解质替代电解液，本征安全且能量密度可突破 400Wh/kg。要点：丰田押注硫化物路线、2027 装车；宁德时代凝聚态电池先行；固固界面阻抗与成本是量产前最后两道坎。',
    aiContent: `### 技术原理一句话\n\n固态电池用固态电解质取代易燃电解液，既消除热失控风险，又允许使用金属锂负极从而大幅提升能量密度。\n\n### 关键进展\n\n- 丰田宣布 2027—2028 年量产装车计划，目标充电 10 分钟续航 1200 公里。\n- 宁德时代发布凝聚态电池并推进全固态中试线。\n- 硫化物、氧化物、聚合物三条电解质路线进入工程化验证。\n\n### 商业化时间表\n\n2027 年前后高端车型小批量示范；2030 年成本降至液态电池 1.5 倍以内，开始规模渗透；储能场景跟进。\n\n### 对中国行业的启示\n\n固态电池将重塑动力电池与储能产业链格局，材料体系与设备工艺的提前布局决定下一轮竞争的席位。`,
  },
  {
    id: -4,
    youtubeId: 'per0vsk1t3Zx',
    title: 'Perovskite Tandem Cells Just Broke 34% Efficiency',
    channelTitle: 'Undecided with Matt Ferrell',
    thumbnailUrl: '/video-fallback.jpg',
    durationSec: 981,
    publishedAt: daysAgo(9),
    category: 'solar',
    videoUrl: 'https://www.youtube.com/watch?v=per0vsk1t3Zx',
    aiTitle: '钙钛矿叠层电池效率突破 34%',
    aiSummary:
      '钙钛矿/晶硅叠层电池实验室效率突破 34%，远超晶硅理论极限。要点：钙钛矿带隙可调，与硅底电池光谱互补；稳定性与大面积一致性仍是量产瓶颈；Oxford PV、协鑫光电中试线进度领先。',
    aiContent: `### 技术原理一句话\n\n钙钛矿材料带隙可调，叠在晶硅电池之上吸收短波光，两层电池各取光谱一段，理论效率可突破 40%。\n\n### 关键进展\n\n- 实验室叠层效率刷新至 34% 以上，持续逼近理论极限。\n- Oxford PV 开始向客户交付商用叠层组件。\n- 国内协鑫光电、极电光能吉瓦级中试线陆续投产。\n\n### 商业化时间表\n\n2025—2027 年中试与示范电站阶段；2028 年前后若通过 IEC 可靠性验证，将进入吉瓦级量产。\n\n### 对中国行业的启示\n\n叠层技术是光伏下一个十年的效率引擎，将抬升单位面积电站收益，提前锁定高效组件供应是电站投资的胜负手。`,
  },
  {
    id: -5,
    youtubeId: 'f10atW1ndQ8e',
    title: 'Floating Offshore Wind: The Deep-Water Race from Norway to Scotland',
    channelTitle: 'Just Have a Think',
    thumbnailUrl: '/video-fallback.jpg',
    durationSec: 1142,
    publishedAt: daysAgo(12),
    category: 'wind',
    videoUrl: 'https://www.youtube.com/watch?v=f10atW1ndQ8e',
    aiTitle: '漂浮式海上风电：从挪威到苏格兰的深水竞赛',
    aiSummary:
      '漂浮式平台把海上风电推向 60 米以上深水区，打开全球 80% 的海上风资源。要点：Hywind Tampen 全球最大漂浮式风场投运；苏格兰 ScotWind 租赁轮次释放 25GW 潜力；系泊系统与动态电缆是降本关键。',
    aiContent: `### 技术原理一句话\n\n漂浮式风电把风机装在半潜式或单柱式浮体上，用系泊缆锚定海底，不再受水深限制，可部署在风资源更好的深远海。\n\n### 关键进展\n\n- 挪威 Hywind Tampen（88MW）全面投运，为油气平台供电。\n- 苏格兰 ScotWind 与 INTOG 租赁轮次锁定大规模漂浮式项目。\n- 中国"海油观澜号""扶摇号"等示范项目并网。\n\n### 商业化时间表\n\n2028—2032 年漂浮式 LCOE 有望降至固定式的 1.3 倍以内，欧洲与东亚率先规模化。\n\n### 对中国行业的启示\n\n中国深远海风资源储量巨大，漂浮式是海上风电"十五五"之后的主战场，浮体制造与系泊系统国产化将决定成本曲线。`,
  },
  {
    id: -6,
    youtubeId: 'fus10nCFS5k',
    title: 'Nuclear Fusion 2025: The Full Story of CFS SPARC',
    channelTitle: 'Real Engineering',
    thumbnailUrl: '/video-fallback.jpg',
    durationSec: 1293,
    publishedAt: daysAgo(15),
    category: 'nuclear',
    videoUrl: 'https://www.youtube.com/watch?v=fus10nCFS5k',
    aiTitle: '核聚变 2025：CFS 的 SPARC 进展全解析',
    aiSummary:
      'CFS 的 SPARC 装置用高温超导磁体把托卡马克小型化，目标验证净能量增益 Q>2。要点：REBCO 高温超导带材是核心使能技术；SPARC 已转入总装阶段；聚变商业化仍取决于材料耐辐照与氚自持两大工程难题。',
    aiContent: `### 技术原理一句话\n\nSPARC 用 REBCO 高温超导磁体产生 20 特斯拉级强磁场，把托卡马克装置体积压缩到 ITER 的 1/40，以更小装置实现聚变点火条件。\n\n### 关键进展\n\n- 高温超导大孔径磁体完成全尺寸验证，磁场强度创纪录。\n- SPARC 装置进入总装阶段，目标验证净能量增益 Q>2。\n- 全球聚变私营企业融资累计超 70 亿美元。\n\n### 商业化时间表\n\n2027 年前后 SPARC 完成关键物理验证；2030 年代初中期 ARC 示范电站并网是业界普遍锚点。\n\n### 对中国行业的启示\n\n聚变产业链（超导磁体、第一壁材料、氚工厂）与现有核电、新能源装备高度协同，中国 BEST、CFETR 工程同步推进，值得长期跟踪。`,
  },
]

/* ------------------------------------------------------------------ */
/* 术语库（行业普及专栏）                                                  */
/* ------------------------------------------------------------------ */

export interface GlossaryTerm {
  abbr: string
  name: string
  desc: string
  color: string
  keyword: string
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    abbr: 'SMR',
    name: '小型模块化核反应堆',
    desc: '核电的"集装箱化"：工厂预制、现场拼装，单堆 ≤300MWe，建设周期与造价大幅压缩。',
    color: '#F2994A',
    keyword: 'SMR',
  },
  {
    abbr: '绿氢',
    name: 'Green Hydrogen',
    desc: '用可再生电力电解水制取的氢气，全程零碳，是工业脱碳与零碳燃料的基石。',
    color: '#5EECD4',
    keyword: '氢',
  },
  {
    abbr: '钙钛矿',
    name: 'Perovskite',
    desc: '新一代光伏材料，带隙可调，与硅叠层后实验室效率可突破 40%，量产在即。',
    color: '#F2B33D',
    keyword: '钙钛矿',
  },
  {
    abbr: '液流电池',
    name: 'Flow Battery',
    desc: '把电量存在"液体罐"里，功率与容量解耦，本征安全的长时储能技术。',
    color: '#7A8CFF',
    keyword: '液流',
  },
  {
    abbr: 'LCOE',
    name: '平准化度电成本',
    desc: '电站全生命周期总成本除以总发电量，衡量电站经济性的第一指标。',
    color: '#2CE0BE',
    keyword: '成本',
  },
  {
    abbr: '虚拟电厂 VPP',
    name: 'Virtual Power Plant',
    desc: '把千万个分布式光伏、储能与可调负荷聚合成一座"云电厂"，参与电网调度与电力交易。',
    color: '#EDF2F9',
    keyword: '虚拟电厂',
  },
]
