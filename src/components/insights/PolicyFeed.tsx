import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Radar, SearchX } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import TagBadge from '@/components/TagBadge'
import { CATEGORIES, CATEGORY_LABEL, CATEGORY_TONE } from '@/components/insights/data'
import { useLang } from '@/i18n'
import { cn } from '@/lib/utils'

interface PolicyItem {
  id: number
  sourceName: string
  sourceUrl: string
  title: string
  category: string
  publishedAt: Date | string | null
  viewpoint: string | null
}

function formatDate(d: Date | string | null): string {
  if (!d) return ''
  const dt = new Date(d)
  return Number.isNaN(dt.getTime()) ? '' : dt.toISOString().slice(0, 10)
}

/** 国内政策/项目快讯：自动扫描政策源 + AI 快评，全自动发布 */
export default function PolicyFeed() {
  const { t } = useLang()
  const [tab, setTab] = useState('all')
  const { data, isLoading, isError } = trpc.insights.list.useQuery({ limit: 30 }, { retry: 1 })

  const items = useMemo(() => {
    const rows = (data ?? []) as PolicyItem[]
    return tab === 'all' ? rows : rows.filter((r) => r.category === tab)
  }, [data, tab])

  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-16 lg:px-10">
      {/* 标题区 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.28em] text-solar-400">
          <span className="inline-block h-px w-6 bg-solar-400" />
          {t('insights.policy.eyebrow')}
        </p>
        <h2 className="mt-4 font-serif text-3xl font-bold text-paper lg:text-4xl">
          {t('insights.policy.title')}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-mist">
          {t('insights.policy.desc')}
        </p>
        <p className="mt-3 flex items-center gap-2 text-xs text-dim">
          <Radar className="h-3.5 w-3.5 text-volt-400" />
          {t('insights.policy.note')}
        </p>
      </motion.div>

      {/* 分类筛选 */}
      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setTab(c.key)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300',
              tab === c.key
                ? 'border-solar-400/60 bg-solar-400/10 text-solar-300'
                : 'border-line text-mist hover:border-line-strong hover:text-paper',
            )}
          >
            {t(`insights.filter.categories.${c.key}`)}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="mt-8 pb-4">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-line bg-ink-800 p-6">
                <div className="h-3 w-20 animate-pulse rounded bg-ink-700" />
                <div className="h-5 w-full animate-pulse rounded bg-ink-700" />
                <div className="h-16 animate-pulse rounded-xl bg-ink-850" />
              </div>
            ))}
          </div>
        ) : isError || items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line-strong py-20 text-center">
            <SearchX className="h-10 w-10 text-dim" />
            <p className="text-sm text-mist">{t('insights.policy.empty')}</p>
          </div>
        ) : (
          <motion.div layout className="grid gap-6 md:grid-cols-2">
            {items.map((it, i) => (
              <motion.article
                key={it.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="group flex flex-col rounded-2xl border border-line bg-ink-800 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-line-strong"
              >
                <div className="flex items-center gap-3">
                  <TagBadge tone={CATEGORY_TONE[it.category] ?? 'volt'}>
                    {t(`insights.filter.categories.${it.category}`) === `insights.filter.categories.${it.category}`
                      ? (CATEGORY_LABEL[it.category] ?? it.category)
                      : t(`insights.filter.categories.${it.category}`)}
                  </TagBadge>
                  <span className="text-xs text-dim">
                    {it.sourceName}{formatDate(it.publishedAt) ? ` · ${formatDate(it.publishedAt)}` : ''}
                  </span>
                </div>
                <h3 className="mt-3 font-sans text-base font-bold leading-snug text-paper">
                  {it.title}
                </h3>
                {it.viewpoint && (
                  <p className="mt-3 flex-1 text-sm leading-7 text-mist">{it.viewpoint}</p>
                )}
                <a
                  href={it.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-1.5 text-xs font-medium text-volt-400 transition-colors hover:text-volt-300"
                >
                  {t('insights.policy.viewSource')}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
