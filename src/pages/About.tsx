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
} from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionHeading from '@/components/SectionHeading'
import GlowCard from '@/components/GlowCard'
import StatBlock from '@/components/StatBlock'
import Reveal from '@/components/Reveal'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ---------------- Section 2 — 公司概览 ---------------- */

const HIGHLIGHTS = [
  { icon: Building2, text: '总部北京 · 多地办事处' },
  { icon: Users, text: '核心团队 60+ 人' },
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
                泰坦能源，让绿色资产持续生长
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 leading-[1.85] text-mist">
                泰坦能源成立于 2016 年，总部位于北京，是一家聚焦新能源电站资产的专业投资运营商。公司以『投资—并购—运营』一体化模式，累计投资规模逾
                45 亿元，管理光伏、风电及储能电站 38 座，总装机容量超过 1.2 GW。
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 leading-[1.85] text-mist">
                我们相信，能源转型的确定性来自两点：优质的资产，与精益的运营。泰坦能源以金融的严谨与产业的耐心，陪伴每一座电站穿越
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
              alt="泰坦能源智慧集控中心"
              className="aspect-video w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </motion.div>
          <p className="mt-3 font-mono text-xs tracking-[0.08em] text-dim">
            TITAN OCC · 智慧集控中心
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
  { year: '2016', title: '公司成立', desc: '首个分布式光伏项目投资落地（浙江）。' },
  { year: '2018', title: '首轮融资', desc: '完成首轮机构融资，管理规模突破 10 亿元。' },
  { year: '2020', title: '进入风电领域', desc: '内蒙古 200MW 风电项目并网。' },
  { year: '2022', title: '并购业务成型', desc: '完成首批 3 座存量电站收购；智慧集控中心投运。' },
  { year: '2023', title: '布局独立储能', desc: '江苏 200MWh 电网侧储能电站投运；管理装机突破 1GW。' },
  { year: '2025', title: '开放平台能力', desc: '发布 AI 投资评估工具与前沿技术洞察平台，开放行业共享。' },
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

/* ---------------- Section 5 — 核心团队 ---------------- */

const TEAM = [
  {
    img: '/team-1.jpg',
    name: '陈屹川',
    role: '创始人 & CEO',
    bio: '曾任大型能源央企投资部负责人，主导超 80 亿元新能源项目投资。',
  },
  {
    img: '/team-2.jpg',
    name: '苏明蔚',
    role: '合伙人 · 投资负责人',
    bio: '深耕新能源并购 12 年，完成 20+ 电站交易。',
  },
  {
    img: '/team-3.jpg',
    name: '高劲风',
    role: 'CTO · 技术与数字化负责人',
    bio: '前头部整机商研发总监，主导智慧运维平台建设。',
  },
  {
    img: '/team-4.jpg',
    name: '郑拓野',
    role: 'COO · 运营负责人',
    bio: '管理过 3GW 存量电站运营，电力市场化交易专家。',
  },
]

function Team() {
  return (
    <section className="bg-ink-900 py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="LEADERSHIP"
            title="核心团队"
            description="兼具产业运营与金融投资基因的复合型团队。"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="group relative overflow-hidden rounded-2xl border border-line bg-ink-800 transition-all duration-500 hover:-translate-y-1.5 hover:border-line-strong">
                <div className="relative overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-800" />
                  {/* bottom gold edge */}
                  <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-solar-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="relative -mt-10 p-6">
                  <h3 className="font-serif text-xl font-bold text-paper">{t.name}</h3>
                  <p className="mt-1 text-sm font-medium text-solar-400">{t.role}</p>
                  <p className="mt-3 text-sm leading-6 text-mist line-clamp-2 transition-all duration-500 group-hover:line-clamp-none">
                    {t.bio}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Section 6 — 资质荣誉 + ESG ---------------- */

const HONORS = [
  '电力工程施工总承包资质',
  '高新技术企业',
  '中国可再生能源学会会员单位',
  '年度最佳新能源投资机构（占位）',
  'ISO 9001 质量管理体系',
  '安全生产标准化二级',
]

function HonorsEsg() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-[1280px] gap-16 px-6 lg:grid-cols-2 lg:px-10">
        {/* honors */}
        <div>
          <Reveal>
            <h3 className="text-xl font-bold text-paper lg:text-2xl">资质与荣誉</h3>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {HONORS.map((h, i) => (
              <motion.div
                key={h}
                className="flex items-center gap-3 rounded-xl border border-line bg-ink-800 px-5 py-4 transition-colors duration-300 hover:border-line-strong"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              >
                <Award className="h-5 w-5 shrink-0 text-solar-400" />
                <span className="text-sm font-medium text-paper">{h}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ESG */}
        <div>
          <Reveal>
            <h3 className="text-xl font-bold text-paper lg:text-2xl">ESG 承诺</h3>
          </Reveal>
          <div className="mt-8 grid grid-cols-3 gap-6">
            <StatBlock value={150} suffix="万吨" label="年 CO₂ 减排" note="CO₂ REDUCTION / YR" />
            <StatBlock value={1800} suffix="户" label="光伏惠民覆盖农户" note="RURAL HOUSEHOLDS" />
            <StatBlock value={100} suffix="%" label="水土保持达标率" note="SOIL CONSERVATION" />
          </div>
          <Reveal delay={200}>
            <p className="mt-8 border-t border-line pt-6 text-sm leading-7 text-mist">
              我们将环境、社会与治理因素纳入每一项投资决策：从电站选址的生态评估，到运维期的水土保持与社区共建，再到光伏惠民工程的长期投入。泰坦能源相信，可持续的回报只来自可持续的经营。（占位文案）
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
            与泰坦同行，共赴能源转型
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
    document.title = '关于我们 — 泰坦能源 Titan Power'
  }, [])

  return (
    <>
      <PageHero
        breadcrumb={['首页', '关于我们']}
        title="以产业深度，做能源资产的长期持有者"
        lead="泰坦能源投资有限公司是一家专注于分布式能源领域的投资运营商，业务覆盖光伏、风电、储能电站的投资、并购与全生命周期运营。"
        image="/about-hero.jpg"
        coord="39.9042° N · 116.4074° E / EST. 2016"
      />
      <Overview />
      <Mission />
      <Timeline />
      <Team />
      <HonorsEsg />
      <AboutCTA />
    </>
  )
}
