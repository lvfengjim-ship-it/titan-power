import { useEffect, useState } from 'react'
import { ChevronDown, Globe, Sparkles } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import TagBadge from '@/components/TagBadge'
import Reveal from '@/components/Reveal'
import { cn } from '@/lib/utils'

interface VideoItem {
  id: string
  title: string
  channel: string
  date: string
  duration: string
  category: '核能' | '氢能' | '储能' | '光伏'
  thumb: string
  aiSummary: string
}

const CATEGORY_TONE: Record<VideoItem['category'], 'nuclear' | 'hydrogen' | 'storage' | 'gold'> = {
  核能: 'nuclear',
  氢能: 'hydrogen',
  储能: 'storage',
  光伏: 'gold',
}

const MOCK_VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    title: '小型模块化反应堆（SMR）如何改变核电经济模型',
    channel: 'Undecided with Matt Ferrell',
    date: '2025-11-28',
    duration: '14:32',
    category: '核能',
    thumb: '/insights-hero.jpg',
    aiSummary:
      'SMR 通过工厂预制与模块化部署大幅压缩建设周期与资本开支。视频拆解了 NuScale 与 Rolls-Royce SMR 的最新进展，并分析其对分布式电网的潜在影响。',
  },
  {
    id: 'v2',
    title: '绿氢电解槽成本五年下降 60% 的背后：技术路线全景',
    channel: 'Just Have a Think',
    date: '2025-11-26',
    duration: '18:05',
    category: '氢能',
    thumb: '/ai-nebula.jpg',
    aiSummary:
      'PEM、碱性、SOEC 三条电解槽路线竞速，规模效应与催化剂降本是主线。视频对比了欧洲与中国厂商的成本曲线，绿氢平价时点或早于预期。',
  },
  {
    id: 'v3',
    title: '液流电池 vs 固态电池：长时储能的下一个十年',
    channel: 'The Limiting Factor',
    date: '2025-11-22',
    duration: '22:47',
    category: '储能',
    thumb: '/business-storage.jpg',
    aiSummary:
      '4 小时以上长时储能需求爆发，液流电池在安全性与循环寿命上占优，固态电池则在能量密度上突破。视频给出两条路线的投资窗口判断。',
  },
  {
    id: 'v4',
    title: '钙钛矿叠层电池效率突破 34%：量产还有多远？',
    channel: 'Undecided with Matt Ferrell',
    date: '2025-11-18',
    duration: '16:21',
    category: '光伏',
    thumb: '/business-pv.jpg',
    aiSummary:
      '钙钛矿/晶硅叠层实验室效率持续刷新，但稳定性与大面积一致性仍是量产瓶颈。视频梳理了 Oxford PV 与协鑫光电的中试进度。',
  },
]

export default function InsightsSection() {
  const [videos, setVideos] = useState<VideoItem[] | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      fetch('/api/videos')
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no api'))))
        .then((data) => {
          if (!cancelled) setVideos(Array.isArray(data) && data.length ? data.slice(0, 4) : MOCK_VIDEOS)
        })
        .catch(() => {
          if (!cancelled) setVideos(MOCK_VIDEOS)
        })
    }, 700)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return (
    <section className="bg-ink-900 py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Global Insights"
            eyebrowColor="volt"
            title="全球能源前沿，每日由 AI 为你解读"
            description="我们的系统每日自动抓取海外核能、氢能、储能等领域的前沿技术视频，并由 AI 生成中文解读，免费开放给每一位行业同仁。"
            linkTo="/insights"
            linkLabel="进入前沿洞察"
          />
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-8 flex items-center gap-2 text-xs text-dim">
            <Globe className="h-3.5 w-3.5" />
            内容每日 08:00 自动更新 · 来源 YouTube 公开频道 · AI 中文解读由 DeepSeek 生成
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {videos === null &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-line bg-ink-800">
                <div className="aspect-video animate-pulse bg-ink-700" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-16 animate-pulse rounded bg-ink-700" />
                  <div className="h-4 w-full animate-pulse rounded bg-ink-700" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-ink-700" />
                </div>
              </div>
            ))}

          {videos?.map((v, i) => (
            <Reveal key={v.id} delay={i * 100} y={32}>
              <article className="group overflow-hidden rounded-2xl border border-line bg-ink-800 transition-all duration-500 hover:-translate-y-1.5 hover:border-line-strong">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={v.thumb}
                    alt={v.title}
                    loading="lazy"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = '/video-fallback.jpg'
                    }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(5,8,15,0.6)]" />
                  <span className="absolute bottom-2 right-2 rounded bg-abyss/80 px-1.5 py-0.5 font-mono text-[10px] text-paper">
                    {v.duration}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 scale-90 items-center justify-center rounded-full border border-white/30 bg-black/40 opacity-0 backdrop-blur transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <TagBadge tone={CATEGORY_TONE[v.category]}>{v.category}</TagBadge>
                  <h3 className="mt-3 line-clamp-2 font-sans text-sm font-bold leading-snug text-paper">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-xs text-dim">
                    {v.channel} · {v.date}
                  </p>
                  <button
                    onClick={() => setOpenId(openId === v.id ? null : v.id)}
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium text-volt-400 transition-colors hover:text-volt-300"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    AI 解读
                    <ChevronDown
                      className={cn('h-3.5 w-3.5 transition-transform duration-300', openId === v.id && 'rotate-180')}
                    />
                  </button>
                  <div
                    className="grid transition-all"
                    style={{
                      gridTemplateRows: openId === v.id ? '1fr' : '0fr',
                      transitionDuration: '350ms',
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-3 border-t border-line pt-3 text-xs leading-6 text-mist">
                        {v.aiSummary}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
