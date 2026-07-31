import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe, Rss, SearchX, Sparkles } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import CTABand from '@/components/CTABand'
import FilterBar from '@/components/insights/FilterBar'
import type { SortKey } from '@/components/insights/FilterBar'
import VideoCard from '@/components/insights/VideoCard'
import VideoDetailDialog from '@/components/insights/VideoDetailDialog'
import GlossarySection from '@/components/insights/GlossarySection'
import SubscribeSection from '@/components/insights/SubscribeSection'
import { FALLBACK_VIDEOS } from '@/components/insights/data'
import type { CategoryKey, InsightVideo } from '@/components/insights/data'
import { useLang } from '@/i18n'

const PAGE_SIZE = 12

export default function Insights() {
  const { t } = useLang()
  /** 标题词级拆分（'|' 分隔，随语言切换） */
  const titleWords = t('insights.hero.titleWords').split('|')
  const [activeTab, setActiveTab] = useState<CategoryKey>('all')
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState<SortKey>('latest')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [current, setCurrent] = useState<InsightVideo | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // SEO
  useEffect(() => {
    document.title = t('insights.seo.title')
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute('content', t('insights.seo.desc'))
    }
  }, [t])

  // 条件变化时重置分页（事件处理器内同步重置）
  const handleTabChange = (t: CategoryKey) => {
    setActiveTab(t)
    setVisible(PAGE_SIZE)
  }
  const handleKeywordChange = (kw: string) => {
    setKeyword(kw)
    setVisible(PAGE_SIZE)
  }
  const handleSortChange = (s: SortKey) => {
    setSort(s)
    setVisible(PAGE_SIZE)
  }

  const { data, isLoading, isError } = trpc.videos.list.useQuery(
    {
      category: activeTab,
      search: keyword || undefined,
      limit: 60,
    },
    { retry: 1 },
  )

  /** 接口失败或为空 → 内置 fallback（前端本地按分类/关键词过滤） */
  const isFallback = isError || (!isLoading && (!data || data.length === 0))
  const videos: InsightVideo[] = useMemo(() => {
    if (!isFallback) return (data ?? []) as InsightVideo[]
    const kw = keyword.trim().toLowerCase()
    return FALLBACK_VIDEOS.filter((v) => {
      const matchTab = activeTab === 'all' || v.category === activeTab
      const matchKw =
        !kw ||
        v.title.toLowerCase().includes(kw) ||
        v.aiTitle.toLowerCase().includes(kw) ||
        (v.aiSummary ?? '').toLowerCase().includes(kw)
      return matchTab && matchKw
    })
  }, [isFallback, data, activeTab, keyword])

  const sorted = useMemo(() => {
    const arr = [...videos]
    if (sort === 'views') {
      arr.sort((a, b) => b.durationSec - a.durationSec)
    } else {
      arr.sort((a, b) => {
        const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
        const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
        return tb - ta
      })
    }
    return arr
  }, [videos, sort])

  const shown = sorted.slice(0, visible)

  const openVideo = (v: InsightVideo) => {
    setCurrent(v)
    setDialogOpen(true)
  }

  /** 术语卡点击 → 关键词过滤并滚动回视频墙 */
  const filterByKeyword = (kw: string) => {
    setActiveTab('all')
    setKeyword(kw)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const heroBadges = [
    { icon: Rss, text: isFallback ? t('insights.hero.badgeCached') : t('insights.hero.badgeLive') },
    { icon: Globe, text: t('insights.hero.badgeSource') },
    { icon: Sparkles, text: t('insights.hero.badgeAi') },
  ]

  return (
    <>
      {/* Section 1 — PageHero（48vh，青强调） */}
      <section className="relative -mt-16 flex min-h-[400px] items-end overflow-hidden pt-16" style={{ height: '48vh' }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <img src="/insights-hero.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/40 to-abyss" />
          <div className="absolute inset-0 bg-grid-faint opacity-60" />
        </motion.div>

        <span className="absolute left-6 top-20 font-mono text-[10px] tracking-[0.15em] text-dim lg:left-10">
          AUTO-AGGREGATED · DAILY 08:00 CST
        </span>

        <div className="relative mx-auto w-full max-w-[1280px] px-6 pb-12 lg:px-10">
          <motion.nav
            className="flex items-center gap-2 text-xs text-dim"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="font-mono transition-colors hover:text-mist">
              {t('common.nav.home')}
            </Link>
            <span className="font-mono text-dim/60">/</span>
            <span className="font-mono text-mist">{t('common.nav.insights')}</span>
          </motion.nav>

          <motion.p
            className="mt-5 flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.28em] text-volt-400"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-block h-px w-6 bg-volt-400" />
            {t('insights.hero.eyebrow')}
          </motion.p>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,4.5vw,3.75rem)] font-bold leading-[1.15] text-paper">
            {titleWords.map((w, i) => (
              <motion.span
                key={w + i}
                className="inline-block"
                initial={{ opacity: 0, y: 24, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-5 max-w-2xl text-lg leading-[1.8] text-mist"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {t('insights.hero.desc')}
          </motion.p>

          <div className="mt-6 flex flex-wrap gap-3">
            {heroBadges.map((b, i) => (
              <motion.span
                key={b.text}
                className="flex items-center gap-2 rounded-full border border-volt-400/30 bg-ink-900/60 px-4 py-1.5 text-xs font-medium text-volt-300 backdrop-blur"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.65 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <b.icon className="h-3.5 w-3.5" />
                {b.text}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — 分类筛选 + 搜索工具条 */}
      <FilterBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
        sort={sort}
        onSortChange={handleSortChange}
        total={isFallback ? FALLBACK_VIDEOS.length : (data?.length ?? 0)}
        isFallback={isFallback}
      />

      {/* Section 3 — 视频卡片墙 */}
      <section ref={gridRef} className="mx-auto max-w-[1280px] scroll-mt-32 px-6 py-16 lg:px-10">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-line bg-ink-800">
                <div className="aspect-video animate-pulse bg-ink-700" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-16 animate-pulse rounded bg-ink-700" />
                  <div className="h-4 w-full animate-pulse rounded bg-ink-700" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-ink-700" />
                  <div className="h-16 animate-pulse rounded-xl bg-ink-850" />
                </div>
              </div>
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line-strong py-24 text-center">
            <SearchX className="h-10 w-10 text-dim" />
            <p className="text-sm text-mist">{t('insights.grid.empty')}</p>
            <button
              onClick={() => {
                setKeyword('')
                setActiveTab('all')
              }}
              className="rounded-xl border border-volt-400/40 px-5 py-2 text-sm text-volt-300 transition-colors hover:bg-volt-400/10"
            >
              {t('insights.grid.clearFilters')}
            </button>
          </div>
        ) : (
          <>
            <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {shown.map((v, i) => (
                  <VideoCard key={v.id} video={v} index={i} onOpen={openVideo} />
                ))}
              </AnimatePresence>
            </motion.div>

            {visible < sorted.length && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisible((n) => n + PAGE_SIZE)}
                  className="rounded-xl border border-line-strong px-8 py-3 text-sm font-medium text-paper transition-all duration-300 hover:border-volt-400 hover:bg-volt-400/[0.08] hover:text-volt-300"
                >
                  {t('insights.grid.loadMore').replace('{count}', String(sorted.length - visible))}
                </button>
              </div>
            )}

            <p className="mt-10 text-center font-mono text-[10px] tracking-[0.12em] text-dim">
              {isFallback
                ? t('insights.grid.footCached')
                : t('insights.grid.footLive').replace('{count}', String(sorted.length))}
            </p>
          </>
        )}
      </section>

      {/* Section 4 — 视频详情模态 */}
      <VideoDetailDialog video={current} open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Section 5 — 术语库 */}
      <GlossarySection onFilter={filterByKeyword} />

      {/* Section 6 — 订阅与关注 */}
      <SubscribeSection />

      {/* Section 7 — CTA Band */}
      <CTABand title={t('insights.cta.title')} description={t('insights.cta.desc')} />
    </>
  )
}
