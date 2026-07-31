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

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ---------------- Section 2 — 公司概览 ---------------- */

const HIGHLIGHTS = [
  { icon: Building2, text: '总部位于海口 · 华东·华南·华北响应网络' },
  { icon: Users, text: '产业与金融复合背景的核心团队' },
  { icon: Award, text: '新能源投资新锐机构（占位）' },
]

function Overview() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1280px] gap-16 px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
        {/* left sticky */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <Reveal>
              <h2 className="font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.2] text-paper">
                彭田环保，让绿色资产持续生长
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 leading-[1.85] text-mist">
                彭田环保是一家聚焦新能源电站资产的专业投资运营商。公司以『投资—并购—运营』一体化模式，长期持有并精细化运营光伏、风电及储能电站资产。
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 leading-[1.85] text-mist">
                我们相信，能源转型的确定性来自两点：优质的资产，与精益的运营。彭田环保以金融的严谨与产业的耐心，陪伴每一座电站穿越
                25 年的生命周期。
              </p>
            </Reveal>
            <Reveal delay={300}>
              <ul className="mt-8 space-y-4">
                {HIGHLIGHTS.map((h) => (
                  <li key={h.text} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-ink-800 text-solar-400">
                      <h.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-paper">{h.text}</span>
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
              alt="彭田环保智慧集控中心"
              className="aspect-video w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </motion.div>
          <p className="mt-3 font-mono text-xs tracking-[0.08em] text-dim">
            PT OCC · 智慧集控中心
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
              alt="电站一线巡检团队"
              className="aspect-video w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </motion.div>
          <p className="mt-3 font-mono text-xs tracking-[0.08em] text-dim lg:-ml-10">
            FIELD TEAM · 电站一线巡检
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Section 3 — 使命 · 愿景 · 价值观 ---------------- */

const VALUES_NOTES = [
  { k: '长期主义', v: '以 25 年资产视角做决策' },
  { k: '数据驱动', v: '让每一度电都可度量' },
  { k: '产业共生', v: '与伙伴共享长期收益' },
  { k: '知行合一', v: '说到做到，兑现承诺' },
]

function Mission() {
  return (
    <section className="bg-ink-900 py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal delay={0}>
            <GlowCard
              icon={<Target className="h-5 w-5" />}
              title="使命"
              description="加速绿色资产的价值释放，让清洁电力成为最可靠的投资标的。"
              className="h-full"
            />
          </Reveal>
          <Reveal delay={120}>
            <GlowCard
              icon={<Telescope className="h-5 w-5 text-volt-400" />}
              title="愿景"
              description="成为中国最受信赖的分布式能源投资运营平台。"
              className="h-full"
            />
          </Reveal>
          <Reveal delay={240}>
            <GlowCard
              icon={<Compass className="h-5 w-5" />}
              title="价值观"
              className="h-full"
            >
              <p className="mt-3 text-sm leading-7 text-mist">
                长期主义 · 数据驱动 · 产业共生 · 知行合一
              </p>
              <ul className="mt-5 space-y-3 border-t border-line pt-5">
                {VALUES_NOTES.map((n) => (
                  <li key={n.k} className="flex items-baseline gap-3">
                    <span className="shrink-0 text-xs font-bold text-solar-300">{n.k}</span>
                    <span className="text-xs text-dim">{n.v}</span>
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
  { year: '2022', title: '公司成立', desc: '专注环保废水处理领域。' },
  { year: '2023', title: '进入新能源领域', desc: '战略布局分布式新能源，开启绿色资产投资之路。' },
  { year: '2024', title: '启动分布式新能源并购', desc: '启动分布式光伏、风电、储能电站资产的并购整合。' },
]

function Timeline() {
  const lineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 75%', 'end 60%'],
  })

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading eyebrow="MILESTONES" title="发展沿革" />
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
                    <h3 className="mt-3 text-lg font-bold text-paper">{m.title}</h3>
                    <p className={cn('mt-2 text-sm leading-7 text-mist', left && 'lg:ml-auto lg:max-w-md')}>
                      {m.desc}
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

function HonorsEsg() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-[1280px] gap-16 px-6 lg:px-10">
        {/* ESG */}
        <div>
          <Reveal>
            <h3 className="text-xl font-bold text-paper lg:text-2xl">ESG 承诺</h3>
          </Reveal>
          <div className="mt-8 space-y-4">
            {[
              {
                icon: Leaf,
                k: '绿色使命',
                v: '将环境因素纳入每一项投资决策，从选址生态评估到运维期水土保持，让清洁电力持续生长。',
              },
              {
                icon: HeartHandshake,
                k: '社区共建',
                v: '与电站所在社区长期同行，通过光伏惠民与属地协作，让绿色资产惠及更多人。',
              },
              {
                icon: ShieldCheck,
                k: '合规治理',
                v: '以规范的治理结构与透明的决策流程为底线，用合规守护每一份长期信任。',
              },
            ].map((c, i) => (
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
                  <p className="text-sm font-bold text-paper">{c.k}</p>
                  <p className="mt-1 text-xs leading-6 text-mist">{c.v}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-8 border-t border-line pt-6 text-sm leading-7 text-mist">
              我们将环境、社会与治理因素纳入每一项投资决策：从电站选址的生态评估，到运维期的水土保持与社区共建，再到光伏惠民工程的长期投入。彭田环保相信，可持续的回报只来自可持续的经营。（占位文案）
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Section 7 — CTA Band ---------------- */

function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-ink-800">
      <img src="/cta-band-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-800/60 via-ink-800/80 to-ink-800/95" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(242,179,61,0.14),transparent)]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(44,224,190,0.10),transparent)]" />

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-10 px-6 py-20 lg:flex-row lg:items-center lg:px-10">
        <Reveal>
          <h3 className="font-serif text-2xl font-bold leading-snug text-paper lg:text-3xl">
            与彭田同行，共赴能源转型
          </h3>
          <p className="mt-4 max-w-xl text-base leading-7 text-mist">
            了解我们的业务模式与能力体系，或直接与我们联系，探讨合作的可能。
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/business"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-7 py-3.5 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.02] hover:glow-gold active:scale-[0.97]"
            >
              查看业务领域
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-line-strong px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:border-solar-400 hover:bg-solar-400/[0.08] hover:text-solar-300"
            >
              联系我们
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Page ---------------- */

export default function About() {
  useEffect(() => {
    document.title = '关于我们 — 彭田环保 PT Momentum'
  }, [])

  return (
    <>
      <PageHero
        breadcrumb={['首页', '关于我们']}
        title="以产业深度，做能源资产的长期持有者"
        lead="海南彭田环保科技有限公司是一家专注于分布式能源领域的投资运营商，业务覆盖光伏、风电、储能电站的投资、并购与全生命周期运营。"
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
