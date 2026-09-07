import { ArrowUpRight, Radar } from 'lucide-react'
import { Link } from 'react-router'
import SectionHeading from '@/components/SectionHeading'
import TagBadge from '@/components/TagBadge'
import Reveal from '@/components/Reveal'
import { useLang } from '@/i18n'
import { trpc } from '@/providers/trpc'
import { CATEGORY_LABEL, CATEGORY_TONE } from '@/components/insights/data'

interface PolicyItem {
  id: number
  sourceName: string
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

/** 首页"前沿洞察"区：国内政策/项目快讯（自动扫描 + AI 快评）
 *  无数据时显示诚实的"扫描中"占位——官网不展示虚构政策内容 */
export default function InsightsSection() {
  const { t } = useLang()
  const { data, isLoading, isError } = trpc.insights.list.useQuery({ limit: 4 }, { retry: 1 })
  const items = (!isError && data ? (data as PolicyItem[]) : []).slice(0, 4)

  return (
    <section className="bg-ink-900 py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Policy Insights"
            eyebrowColor="volt"
            title={t('home.insights.title')}
            description={t('home.insights.description')}
            linkTo="/insights"
            linkLabel={t('home.insights.linkLabel')}
          />
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-8 flex items-center gap-2 text-xs text-dim">
            <Radar className="h-3.5 w-3.5 text-volt-400" />
            {t('home.insights.note')}
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-line bg-ink-800 p-6">
                <div className="h-3 w-16 animate-pulse rounded bg-ink-700" />
                <div className="h-4 w-full animate-pulse rounded bg-ink-700" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-ink-700" />
                <div className="h-20 animate-pulse rounded-xl bg-ink-850" />
              </div>
            ))}

          {!isLoading && items.length === 0 && (
            <Reveal>
              <div className="col-span-full flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong py-16 text-center">
                <Radar className="h-8 w-8 animate-pulse text-volt-400" />
                <p className="text-sm text-mist">{t('home.insights.scanning')}</p>
              </div>
            </Reveal>
          )}

          {items.map((it, i) => (
            <Reveal key={it.id} delay={i * 100} y={32}>
              <Link to="/insights" className="group block h-full">
                <article className="flex h-full flex-col rounded-2xl border border-line bg-ink-800 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-line-strong">
                  <div className="flex items-center gap-2">
                    <TagBadge tone={CATEGORY_TONE[it.category] ?? 'volt'}>
                      {CATEGORY_LABEL[it.category] ?? it.category}
                    </TagBadge>
                  </div>
                  <h3 className="mt-3 line-clamp-2 font-sans text-sm font-bold leading-snug text-paper">
                    {it.title}
                  </h3>
                  <p className="mt-2 text-xs text-dim">
                    {it.sourceName}
                    {formatDate(it.publishedAt) ? ` · ${formatDate(it.publishedAt)}` : ''}
                  </p>
                  {it.viewpoint && (
                    <p className="mt-3 line-clamp-4 flex-1 border-t border-line pt-3 text-xs leading-6 text-mist">
                      {it.viewpoint}
                    </p>
                  )}
                  <span className="mt-3 flex items-center gap-1 text-xs font-medium text-volt-400 transition-colors group-hover:text-volt-300">
                    {t('home.insights.readMore')}
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
