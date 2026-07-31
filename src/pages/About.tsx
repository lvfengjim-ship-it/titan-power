import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { motion, useScroll } from 'framer-motion'
import {
  Building2,
  Users,
  Award,
  Target,
  Telescope,
  Compass,
  ArrowRight,
  Leaf,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionHeading from '@/components/SectionHeading'
import GlowCard from '@/components/GlowCard'
import Reveal from '@/components/Reveal'
import { cn } from '@/lib/utils'
import { useLang } from '@/i18n'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ---------------- Section 2 — 公司概览 ---------------- */

const HIGHLIGHTS = [
  { icon: Building2, key: 'about.overview.highlights.h1' },
  { icon: Users, key: 'about.overview.highlights.h2' },
  { icon: Award, key: 'about.overview.highlights.h3' },
]

function Overview() {
  const { t } = useLang()
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1280px] gap-16 px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
        {/* left sticky */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <Reveal>
              <h2 className="font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.2] text-paper">
                {t('about.overview.heading')}
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 leading-[1.85] text-mist">{t('about.overview.p1')}</p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 leading-[1.85] text-mist">{t('about.overview.p2')}</p>
            </Reveal>
            <Reveal delay={300}>
              <ul className="mt-8 space-y-4">
                {HIGHLIGHTS.map((h) => (
                  <li key={h.key} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-ink-800 text-solar-400">
                      <h.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-paper">{t(h.key)}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* right images */}
        <div className="lg:col-span-7">
          <motion.div
            className="overflow-hidden rounded-2xl border border-line"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1, ease: EASE }}
          >
            <img
              src="/about-control-room.jpg"
              alt={t('about.overview.alt1')}
              className="aspect-video w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </motion.div>
          <p className="mt-3 font-mono text-xs tracking-[0.08em] text-dim">
            {t('about.overview.caption1')}
          </p>

          <motion.div
            className="mt-10 overflow-hidden rounded-2xl border-4 border-abyss shadow-2xl lg:-ml-10 lg:w-[85%]"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
          >
            <img
              src="/about-field.jpg"
              alt={t('about.overview.alt2')}
              className="aspect-video w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </motion.div>
          <p className="mt-3 font-mono text-xs tracking-[0.08em] text-dim lg:-ml-10">
            {t('about.overview.caption2')}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Section 3 — 使命 · 愿景 · 价值观 ---------------- */

const VALUES_NOTES = [
  { k: 'about.mission.values.v1k', v: 'about.mission.values.v1v' },
  { k: 'about.mission.values.v2k', v: 'about.mission.values.v2v' },
  { k: 'about.mission.values.v3k', v: 'about.mission.values.v3v' },
  { k: 'about.mission.values.v4k', v: 'about.mission.values.v4v' },
]

function Mission() {
  const { t } = useLang()
  return (
    <section className="bg-ink-900 py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal delay={0}>
            <GlowCard
              icon={<Target className="h-5 w-5" />}
              title={t('about.mission.missionTitle')}
              description={t('about.mission.missionDesc')}
              className="h-full"
            />
          </Reveal>
          <Reveal delay={120}>
            <GlowCard
              icon={<Telescope className="h-5 w-5 text-volt-400" />}
              title={t('about.mission.visionTitle')}
              description={t('about.mission.visionDesc')}
              className="h-full"
            />
          </Reveal>
          <Reveal delay={240}>
            <GlowCard
              icon={<Compass className="h-5 w-5" />}
              title={t('about.mission.valuesTitle')}
              className="h-full"
            >
              <p className="mt-3 text-sm leading-7 text-mist">{t('about.mission.valuesLine')}</p>
              <ul className="mt-5 space-y-3 border-t border-line pt-5">
                {VALUES_NOTES.map((n) => (
                  <li key={n.k} className="flex items-baseline gap-3">
                    <span className="shrink-0 text-xs font-bold text-solar-300">{t(n.k)}</span>
                    <span className="text-xs text-dim">{t(n.v)}</span>
                  </li>
                ))}
              </ul>
            </GlowCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Section 4 — 发展历程（时间轴） ---------------- */

const MILESTONES = [
  { year: '2022', title: 'about.milestones.y2022.title', desc: 'about.milestones.y2022.desc' },
  { year: '2023', title: 'about.milestones.y2023.title', desc: 'about.milestones.y2023.desc' },
  { year: '2024', title: 'about.milestones.y2024.title', desc: 'about.milestones.y2024.desc' },
]

function Timeline() {
  const { t } = useLang()
  const lineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 75%', 'end 60%'],
  })

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading eyebrow="MILESTONES" title={t('about.milestones.heading')} />
        </Reveal>

        <div ref={lineRef} className="relative mt-16 lg:mt-20">
          {/* base line */}
          <span className="absolute left-4 top-0 h-full w-px bg-line lg:left-1/2 lg:-translate-x-1/2" />
          {/* progress line */}
          <motion.span
            className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-solar-300 via-solar-400 to-solar-500 lg:left-1/2 lg:-translate-x-1/2"
            style={{ scaleY: scrollYProgress }}
          />

          <ol className="space-y-12 lg:space-y-16">
            {MILESTONES.map((m, i) => {
              const left = i % 2 === 0
              return (
                <li key={m.year} className="relative lg:grid lg:grid-cols-2 lg:gap-16">
                  {/* node dot */}
                  <span className="absolute left-4 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-solar-400 bg-abyss lg:left-1/2" />
                  <motion.div
                    className={cn(
                      'pl-12 lg:pl-0',
                      left ? 'lg:pr-16 lg:text-right' : 'lg:col-start-2 lg:pl-16',
                    )}
                    initial={{ opacity: 0, x: left ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-25% 0px' }}
                    transition={{ duration: 0.9, ease: EASE }}
                  >
                    <motion.p
                      className="font-display text-4xl font-bold tracking-[-0.02em] text-solar-400 lg:text-5xl"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: '-25% 0px' }}
                      transition={{ duration: 0.7, ease: EASE }}
                    >
                      {m.year}
                    </motion.p>
                    <h3 className="mt-3 text-lg font-bold text-paper">{t(m.title)}</h3>
                    <p className={cn('mt-2 text-sm leading-7 text-mist', left && 'lg:ml-auto lg:max-w-md')}>
                      {t(m.desc)}
                    </p>
                  </motion.div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Section 6 — ESG 承诺 ---------------- */

const ESG_CARDS = [
  { icon: Leaf, k: 'about.esg.green.k', v: 'about.esg.green.v' },
  { icon: HeartHandshake, k: 'about.esg.community.k', v: 'about.esg.community.v' },
  { icon: ShieldCheck, k: 'about.esg.governance.k', v: 'about.esg.governance.v' },
]

function HonorsEsg() {
  const { t } = useLang()
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-[1280px] gap-16 px-6 lg:px-10">
        {/* ESG */}
        <div>
          <Reveal>
            <h3 className="text-xl font-bold text-paper lg:text-2xl">{t('about.esg.title')}</h3>
          </Reveal>
          <div className="mt-8 space-y-4">
            {ESG_CARDS.map((c, i) => (
              <motion.div
                key={c.k}
                className="flex items-start gap-4 rounded-xl border border-line bg-ink-800 px-5 py-4 transition-colors duration-300 hover:border-line-strong"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-ink-850 text-solar-400">
                  <c.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-paper">{t(c.k)}</p>
                  <p className="mt-1 text-xs leading-6 text-mist">{t(c.v)}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-8 border-t border-line pt-6 text-sm leading-7 text-mist">{t('about.esg.note')}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Section 7 — CTA Band ---------------- */

function AboutCTA() {
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
            {t('about.cta.title')}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-7 text-mist">{t('about.cta.desc')}</p>
        </Reveal>
        <Reveal delay={150}>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/business"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-7 py-3.5 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.02] hover:glow-gold active:scale-[0.97]"
            >
              {t('about.cta.primary')}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-line-strong px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:border-solar-400 hover:bg-solar-400/[0.08] hover:text-solar-300"
            >
              {t('about.cta.secondary')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Page ---------------- */

export default function About() {
  const { t } = useLang()

  useEffect(() => {
    document.title = t('about.meta.title')
  }, [t])

  return (
    <>
      <PageHero
        breadcrumb={[t('about.hero.crumbHome'), t('about.hero.crumbAbout')]}
        title={t('about.hero.title')}
        lead={t('about.hero.lead')}
        image="/about-hero.jpg"
        coord="20.0440° N · 110.1989° E / EST. 2022"
      />
      <Overview />
      <Mission />
      <Timeline />
      <HonorsEsg />
      <AboutCTA />
    </>
  )
}
