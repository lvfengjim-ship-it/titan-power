import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { toast, Toaster } from 'sonner'
import { Sparkles, ArrowRight, MessageSquare } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import Reveal from '@/components/Reveal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import ParamsPanel from '@/components/aitool/ParamsPanel'
import ResultsPanel from '@/components/aitool/ResultsPanel'
import ReportPanel from '@/components/aitool/ReportPanel'
import { useAiReport } from '@/components/aitool/useReport'
import { computeMetrics, PRESETS } from '@/components/aitool/finance'
import type { ProjectParams, ProjectType } from '@/components/aitool/finance'
import { useLang } from '@/i18n'

const FAQ_COUNT = 7

export default function AiTool() {
  const { t } = useLang()
  const [type, setType] = useState<ProjectType>('pv')
  const [params, setParams] = useState<ProjectParams>(PRESETS.pv)
  const [debounced, setDebounced] = useState<{ type: ProjectType; params: ProjectParams }>({
    type: 'pv',
    params: PRESETS.pv,
  })
  const report = useAiReport()

  // SEO
  useEffect(() => {
    document.title = t('aitool.hero.docTitle')
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = t('aitool.hero.metaDesc')
  }, [t])

  // 参数变化 → 150ms 防抖后重算
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced({ type, params }), 150)
    return () => window.clearTimeout(id)
  }, [type, params])

  const metrics = useMemo(
    () => computeMetrics(debounced.type, debounced.params),
    [debounced],
  )

  const handleTypeChange = useCallback(
    (next: ProjectType) => {
      setType(next)
      setParams(PRESETS[next])
      toast.success(
        t('aitool.toast.loadedPre') + t(`aitool.types.full.${next}`) + t('aitool.toast.loadedPost'),
      )
    },
    [t],
  )

  const handleReset = useCallback(() => {
    setParams(PRESETS[type])
    toast.success(
      t('aitool.toast.resetPre') + t(`aitool.types.full.${type}`) + t('aitool.toast.resetPost'),
    )
  }, [type, t])

  const handleGenerate = useCallback(() => {
    report.generate(type, params, metrics)
    // 生成时滚动到报告区
    window.setTimeout(() => {
      document.getElementById('ai-report')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }, [report, type, params, metrics])

  return (
    <div>
      <Toaster theme="dark" position="bottom-right" />

      {/* ===== Section 1 — PageHero（紧凑版） ===== */}
      <section
        className="relative -mt-16 flex min-h-[320px] items-end overflow-hidden pt-16"
        style={{ height: '40vh' }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <img src="/ai-nebula.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/45 to-abyss" />
          <div className="tp-drift absolute inset-[-120px] bg-grid-faint opacity-60" />
        </motion.div>

        <span className="absolute left-6 top-20 font-mono text-[10px] tracking-[0.15em] text-dim lg:left-10">
          39.9042° N, 116.4074° E
        </span>

        <div className="relative mx-auto w-full max-w-[1280px] px-6 pb-10 lg:px-10">
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
            <span className="font-mono text-mist">{t('aitool.hero.breadcrumb')}</span>
          </motion.nav>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <motion.p
                className="flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.28em] text-volt-400"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="inline-block h-px w-6 bg-volt-400" />
                Investment Analyzer
              </motion.p>
              <motion.h1
                className="mt-4 font-serif text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.15] text-paper"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {t('aitool.hero.title')}
              </motion.h1>
              <motion.p
                className="mt-4 max-w-2xl text-base leading-[1.8] text-mist lg:text-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {t('aitool.hero.lead')}
              </motion.p>
            </div>

            <div className="flex items-center gap-3">
              {[
                <span key="ds" className="flex items-center gap-2 rounded-full border border-volt-400/40 bg-volt-400/10 px-4 py-1.5 font-mono text-[11px] tracking-[0.12em] text-volt-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  POWERED BY DP
                </span>,
                <span key="free" className="rounded-full bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-4 py-1.5 font-mono text-[11px] font-bold tracking-[0.12em] text-abyss">
                  FREE
                </span>,
              ].map((badge, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.45 + i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {badge}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 2 — 评估工作台 ===== */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
        <Reveal y={24}>
          <div className="grid overflow-hidden rounded-2xl border border-line bg-ink-900 lg:grid-cols-12">
            <div className="border-b border-line lg:col-span-5 lg:border-b-0 lg:border-r">
              <ParamsPanel
                type={type}
                params={params}
                onTypeChange={handleTypeChange}
                onParamsChange={setParams}
                onReset={handleReset}
              />
            </div>
            <div className="lg:col-span-7">
              <ResultsPanel
                metrics={metrics}
                onGenerate={handleGenerate}
                generating={report.status === 'streaming'}
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== Section 3 — AI 解读报告 ===== */}
      <section id="ai-report" className="scroll-mt-20 py-16">
        <div className="mx-auto mb-10 max-w-[1280px] px-6 lg:px-10">
          <SectionHeading
            eyebrow="REPORT"
            eyebrowColor="volt"
            title={t('aitool.report.heading')}
            description={t('aitool.report.headingDesc')}
          />
        </div>
        <ReportPanel type={type} report={report} onRetry={handleGenerate} />
      </section>

      {/* ===== Section 4 — 使用说明与口径（FAQ） ===== */}
      <section className="bg-ink-900 py-24">
        <div className="mx-auto max-w-[760px] px-6">
          <SectionHeading
            eyebrow="METHODOLOGY"
            title={t('aitool.faq.heading')}
            description={t('aitool.faq.desc')}
          />
          <Reveal className="mt-10" y={20}>
            <Accordion type="single" collapsible className="space-y-3">
              {Array.from({ length: FAQ_COUNT }, (_, i) => ({ q: t(`aitool.faq.q${i + 1}`), a: t(`aitool.faq.a${i + 1}`) })).map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl border border-line bg-ink-850/60 px-5"
                >
                  <AccordionTrigger className="py-4 text-left text-[15px] font-bold text-paper hover:no-underline [&[data-state=open]>svg]:text-volt-400">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-mist">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ===== Section 5 — CTA Band ===== */}
      <section className="relative overflow-hidden bg-ink-800">
        <img
          src="/cta-band-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-800/60 via-ink-800/80 to-ink-800/95" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(242,179,61,0.14),transparent)]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(44,224,190,0.10),transparent)]" />
        <div className="relative mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-10 px-6 py-20 lg:flex-row lg:items-center lg:px-10">
          <div className="max-w-xl">
            <h3 className="font-serif text-2xl font-bold leading-snug text-paper lg:text-3xl">
              {t('aitool.cta.title')}
            </h3>
            <p className="mt-4 text-base leading-7 text-mist">{t('aitool.cta.desc')}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/contact?type=${type}`}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-7 py-3.5 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.02] hover:glow-gold active:scale-[0.97]"
            >
              <MessageSquare className="h-4 w-4" />
              {t('aitool.cta.primary')}
            </Link>
            <Link
              to="/business"
              className="group flex items-center gap-2 rounded-xl border border-line-strong px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:border-solar-400 hover:bg-solar-400/[0.08] hover:text-solar-300"
            >
              {t('aitool.cta.secondary')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
