import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { motion, useScroll } from 'framer-motion'
import {
  CheckCircle2,
  MessageSquare,
  Search,
  FileSearch,
  PenLine,
  Gauge,
  BrainCircuit,
  Network,
  MonitorDot,
  Landmark,
  Sparkles,
} from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionHeading from '@/components/SectionHeading'
import GlowCard from '@/components/GlowCard'
import TagBadge from '@/components/TagBadge'
import Reveal from '@/components/Reveal'
import { cn } from '@/lib/utils'
import { useLang } from '@/i18n'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ---------------- Section 2 — 三大业务模式 ---------------- */

const MODELS = [
  {
    key: 'm1',
    tone: 'gold' as const,
    image: '/project-zhejiang-rooftop.jpg',
    data: 'DIRECT INVESTMENT · JOINT DEVELOPMENT',
  },
  {
    key: 'm2',
    tone: 'volt' as const,
    image: '/business-storage.jpg',
    data: 'AI-ASSISTED VALUATION · FAST DD',
  },
  {
    key: 'm3',
    tone: 'storage' as const,
    image: '/business-wind.jpg',
    data: 'SMART O&M · PERFORMANCE IMPROVEMENT',
  },
] as const

function Models() {
  const { t } = useLang()
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading eyebrow="BUSINESS MODELS" title={t('business.models.heading')} />
        </Reveal>

        <div className="mt-16 space-y-16 lg:space-y-24">
          {MODELS.map((m, i) => {
            const reversed = i % 2 === 1
            const base = `business.models.${m.key}`
            const points = [1, 2, 3, 4].map((n) => t(`${base}.p${n}`))
            return (
              <Reveal key={m.key} y={48}>
                <div className="group grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                  {/* image */}
                  <motion.div
                    className={cn('lg:col-span-5', reversed && 'lg:order-2')}
                    initial={{ clipPath: 'inset(100% 0 0 0)' }}
                    whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                    viewport={{ once: true, margin: '-15% 0px' }}
                    transition={{ duration: 1, ease: EASE }}
                  >
                    <div className="overflow-hidden rounded-2xl border border-line">
                      <img
                        src={m.image}
                        alt={t(`${base}.alt`)}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </motion.div>

                  {/* text */}
                  <div className={cn('lg:col-span-7', reversed && 'lg:order-1')}>
                    <TagBadge tone={m.tone}>{t(`${base}.tag`)}</TagBadge>
                    <h3 className="mt-4 text-2xl font-bold text-paper lg:text-[1.5rem]">
                      {t(`${base}.title`)}
                    </h3>
                    <p className="mt-4 max-w-2xl leading-[1.85] text-mist">{t(`${base}.body`)}</p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {points.map((p, j) => (
                        <motion.li
                          key={p}
                          className="flex items-center gap-2.5"
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-10% 0px' }}
                          transition={{ duration: 0.6, delay: j * 0.08, ease: EASE }}
                        >
                          <CheckCircle2
                            className={cn(
                              'h-4 w-4 shrink-0',
                              m.tone === 'gold' && 'text-solar-400',
                              m.tone === 'volt' && 'text-volt-400',
                              m.tone === 'storage' && 'text-[#7A8CFF]',
                            )}
                          />
                          <span className="text-sm font-medium text-paper">{p}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <p className="mt-6 inline-block rounded-lg border border-line bg-ink-850 px-4 py-2 font-mono text-xs tracking-[0.08em] text-dim">
                      {m.data}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Section 3 — 资产矩阵 ---------------- */

const MATRIX_COLS = [
  { nameKey: 'business.matrix.colPv', en: 'PV', tone: 'gold' as const },
  { nameKey: 'business.matrix.colWind', en: 'WIND', tone: 'volt' as const },
  { nameKey: 'business.matrix.colStorage', en: 'STORAGE', tone: 'storage' as const },
]

const MATRIX_ROWS: { modeKey: string; en: string; cellKeys: (string | null)[] }[] = [
  {
    modeKey: 'business.matrix.rowInvest',
    en: 'INVESTMENT',
    cellKeys: [
      'business.matrix.investPv',
      'business.matrix.investWind',
      'business.matrix.investStorage',
    ],
  },
  {
    modeKey: 'business.matrix.rowMa',
    en: 'M&A',
    cellKeys: ['business.matrix.maPv', 'business.matrix.maWind', 'business.matrix.maStorage'],
  },
  {
    modeKey: 'business.matrix.rowOm',
    en: 'O&M',
    cellKeys: ['business.matrix.omPv', 'business.matrix.omWind', null],
  },
]

function AssetMatrix() {
  const { lang, t } = useLang()
  return (
    <section className="bg-ink-900 py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading eyebrow="ASSET MATRIX" title={t('business.matrix.heading')} />
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-2">
              <thead>
                <tr>
                  <th className="w-32 p-3 text-left font-mono text-xs tracking-[0.08em] text-dim">
                    MODE × ASSET
                  </th>
                  {MATRIX_COLS.map((c) => (
                    <th key={c.nameKey} className="p-3 text-left">
                      <TagBadge tone={c.tone}>
                        {lang === 'en' ? c.en : `${t(c.nameKey)} · ${c.en}`}
                      </TagBadge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX_ROWS.map((row, ri) => (
                  <motion.tr
                    key={row.modeKey}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.7, delay: ri * 0.1, ease: EASE }}
                  >
                    <th className="rounded-xl border border-line bg-ink-850 p-4 text-left align-middle">
                      <span className="block text-sm font-bold text-paper">{t(row.modeKey)}</span>
                      <span className="mt-1 block font-mono text-[10px] tracking-[0.15em] text-dim">
                        {row.en}
                      </span>
                    </th>
                    {row.cellKeys.map((cellKey, ci) => (
                      <td
                        key={ci}
                        className={cn(
                          'rounded-xl border p-4 align-middle text-sm transition-all duration-300',
                          cellKey
                            ? 'border-line bg-ink-800 text-mist hover:border-line-strong hover:bg-ink-700 hover:text-paper'
                            : 'border-dashed border-line/60 bg-transparent text-dim/60',
                        )}
                      >
                        {cellKey ? t(cellKey) : t('business.matrix.empty')}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={250}>
          <p className="mt-6 text-sm text-dim">{t('business.matrix.note')}</p>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Section 4 — 服务流程 ---------------- */

const STEPS = [
  { icon: MessageSquare, key: 's1' },
  { icon: Search, key: 's2' },
  { icon: FileSearch, key: 's3' },
  { icon: PenLine, key: 's4' },
  { icon: Gauge, key: 's5' },
] as const

function Process() {
  const { t } = useLang()
  const lineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 75%', 'end 55%'],
  })

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading eyebrow="PROCESS" title={t('business.process.heading')} />
        </Reveal>

        <div ref={lineRef} className="relative mt-16">
          {/* connector line (desktop) */}
          <span className="absolute left-0 right-0 top-6 hidden h-px bg-line lg:block" />
          <motion.span
            className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-gradient-to-r from-solar-300 via-solar-400 to-solar-500 lg:block"
            style={{ scaleX: scrollYProgress }}
          />
          {/* connector line (mobile) */}
          <span className="absolute bottom-0 left-6 top-0 w-px bg-line lg:hidden" />

          <ol className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.key}
                className="relative pl-16 lg:pl-0 lg:pt-16"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              >
                {/* node */}
                <motion.span
                  className="absolute left-6 top-6 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-line bg-ink-800 text-solar-400 lg:left-6 lg:top-6 lg:translate-x-0 lg:translate-y-[-50%]"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.12 }}
                >
                  <s.icon className="h-5 w-5" />
                </motion.span>
                <p className="font-mono text-xs tracking-[0.15em] text-solar-400">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-base font-bold text-paper">
                  {t(`business.process.${s.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-mist">
                  {t(`business.process.${s.key}.desc`)}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Section 5 — 能力体系 ---------------- */

const CAPABILITIES = [
  { icon: BrainCircuit, color: 'text-volt-400', key: 'c1' },
  { icon: Network, color: 'text-solar-400', key: 'c2' },
  { icon: MonitorDot, color: 'text-volt-400', key: 'c3' },
  { icon: Landmark, color: 'text-solar-400', key: 'c4' },
] as const

function Capabilities() {
  const { t } = useLang()
  return (
    <section className="bg-ink-900 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1280px] gap-14 px-6 lg:grid-cols-3 lg:gap-12 lg:px-10">
        {/* left */}
        <div>
          <Reveal>
            <h2 className="font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.2] text-paper">
              {t('business.capabilities.title')}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-5 leading-[1.85] text-mist">{t('business.capabilities.lead')}</p>
          </Reveal>
          <div className="mt-10 space-y-10 border-t border-line pt-10">
            <Reveal delay={200}>
              <p className="font-serif text-2xl font-bold text-paper">
                {t('business.capabilities.deal.title')}
              </p>
              <p className="mt-2 text-sm leading-6 text-mist">
                {t('business.capabilities.deal.desc')}
              </p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.15em] text-dim">
                DEAL EXECUTION
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="font-serif text-2xl font-bold text-paper">
                {t('business.capabilities.perf.title')}
              </p>
              <p className="mt-2 text-sm leading-6 text-mist">
                {t('business.capabilities.perf.desc')}
              </p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.15em] text-dim">
                PERFORMANCE MANAGEMENT
              </p>
            </Reveal>
          </div>
        </div>

        {/* right grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.key} delay={i * 100}>
              <GlowCard
                icon={<c.icon className={cn('h-5 w-5', c.color)} />}
                title={t(`business.capabilities.${c.key}.title`)}
                description={t(`business.capabilities.${c.key}.desc`)}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Section 6 — CTA Band ---------------- */

function BusinessCTA() {
  const { t } = useLang()
  return (
    <section className="relative overflow-hidden bg-ink-800">
      <img src="/cta-band-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-800/60 via-ink-800/80 to-ink-800/95" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(242,179,61,0.14),transparent)]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(44,224,190,0.10),transparent)]" />

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-10 px-6 py-20 lg:flex-row lg:items-center lg:px-10">
        <Reveal>
          <h3 className="font-serif text-2xl font-bold leading-snug text-paper lg:text-3xl">
            {t('business.cta.title')}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-7 text-mist">{t('business.cta.desc')}</p>
        </Reveal>
        <Reveal delay={150}>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/ai-tool"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-7 py-3.5 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.02] hover:glow-gold active:scale-[0.97]"
            >
              <Sparkles className="h-4 w-4" />
              {t('business.cta.primary')}
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-line-strong px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:border-solar-400 hover:bg-solar-400/[0.08] hover:text-solar-300"
            >
              {t('business.cta.secondary')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Page ---------------- */

export default function Business() {
  const { t } = useLang()
  useEffect(() => {
    document.title = t('business.hero.docTitle')
  }, [t])

  return (
    <>
      <PageHero
        breadcrumb={[t('common.nav.home'), t('common.nav.business')]}
        title={
          <>
            {t('business.hero.title')}
            <span className="mt-3 block font-serif text-[clamp(1.1rem,2vw,1.5rem)] font-bold leading-snug text-mist">
              {t('business.hero.subtitle')}
            </span>
          </>
        }
        lead={t('business.hero.lead')}
        image="/business-wind.jpg"
        coord="MODE × ASSET MATRIX / 3 × 3"
      />
      <Models />
      <AssetMatrix />
      <Process />
      <Capabilities />
      <BusinessCTA />
    </>
  )
}
