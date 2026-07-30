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

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ---------------- Section 2 — 三大业务模式 ---------------- */

const MODELS = [
  {
    tag: '模式 01',
    tone: 'gold' as const,
    title: '新能源项目投资',
    image: '/project-zhejiang-rooftop.jpg',
    alt: '工商业屋顶分布式光伏航拍',
    body: '面向具备开发条件的工商业屋顶与园区分布式光伏、分散式风电，以及工商业储能、独立储能与风光储一体化项目，彭田环保以直投或联合开发方式提供资本金支持，覆盖从项目备案、建设到并网的全过程。',
    points: [
      '项目直投与联合开发',
      '工商业屋顶与园区分布式光伏',
      '分散式风电项目孵化',
      '工商业储能与源网荷储一体化',
    ],
    data: 'DIRECT INVESTMENT · JOINT DEVELOPMENT',
  },
  {
    tag: '模式 02',
    tone: 'volt' as const,
    title: '存量电站并购',
    image: '/business-storage.jpg',
    alt: '集装箱式储能电站',
    body: '针对已建成并网的光伏、风电与储能电站，我们提供快速、确定性的整体收购方案。标准化的尽调流程与内部 AI 评估体系，让交易决策更快、更确定。',
    points: [
      '股权整体收购与资产收购',
      '标准化尽调与快速定价',
      '遗留问题结构化解决方案',
      '卖方保留运营参与权的灵活安排',
    ],
    data: 'AI-ASSISTED VALUATION · FAST DD',
  },
  {
    tag: '模式 03',
    tone: 'storage' as const,
    title: '电站智慧运营',
    image: '/business-wind.jpg',
    alt: '草原风电场',
    body: '依托智慧集控中心与专业运维网络，我们为自有及第三方电站提供监控、运维、电力交易与资产管理服务，以发电量提升与交易成本优化兑现资产价值。',
    points: [
      '7×24 智慧集控与无人机巡检',
      '电力现货与中长期交易策略',
      '设备健康管理与技改增效',
      '碳资产与绿证开发',
    ],
    data: 'SMART O&M · PERFORMANCE IMPROVEMENT',
  },
]

function Models() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading eyebrow="BUSINESS MODELS" title="三种方式，与彭田合作" />
        </Reveal>

        <div className="mt-16 space-y-16 lg:space-y-24">
          {MODELS.map((m, i) => {
            const reversed = i % 2 === 1
            return (
              <Reveal key={m.tag} y={48}>
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
                        alt={m.alt}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </motion.div>

                  {/* text */}
                  <div className={cn('lg:col-span-7', reversed && 'lg:order-1')}>
                    <TagBadge tone={m.tone}>{m.tag}</TagBadge>
                    <h3 className="mt-4 text-2xl font-bold text-paper lg:text-[1.5rem]">
                      {m.title}
                    </h3>
                    <p className="mt-4 max-w-2xl leading-[1.85] text-mist">{m.body}</p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {m.points.map((p, j) => (
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

type Cell = { text: string } | null

const MATRIX_COLS = [
  { name: '光伏', en: 'PV', tone: 'gold' as const },
  { name: '风电', en: 'WIND', tone: 'volt' as const },
  { name: '储能', en: 'STORAGE', tone: 'storage' as const },
]

const MATRIX_ROWS: { mode: string; en: string; cells: Cell[] }[] = [
  {
    mode: '投资',
    en: 'INVESTMENT',
    cells: [
      { text: '工商业屋顶 / 园区分布式直投' },
      { text: '分散式 / 园区风电联合开发' },
      { text: '工商业储能与风光储一体化孵化' },
    ],
  },
  {
    mode: '并购',
    en: 'M&A',
    cells: [
      { text: '分布式存量电站整体收购' },
      { text: '在运风电场股权收购' },
      { text: '独立储能容量资产收购' },
    ],
  },
  {
    mode: '运营',
    en: 'O&M',
    cells: [
      { text: '集控监控 + 技改增效' },
      { text: 'SCADA 运维与电力交易' },
      null,
    ],
  },
]

function AssetMatrix() {
  return (
    <section className="bg-ink-900 py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading eyebrow="ASSET MATRIX" title="3 × 3 资产能力矩阵" />
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
                    <th key={c.name} className="p-3 text-left">
                      <TagBadge tone={c.tone}>
                        {c.name} · {c.en}
                      </TagBadge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX_ROWS.map((row, ri) => (
                  <motion.tr
                    key={row.mode}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.7, delay: ri * 0.1, ease: EASE }}
                  >
                    <th className="rounded-xl border border-line bg-ink-850 p-4 text-left align-middle">
                      <span className="block text-sm font-bold text-paper">{row.mode}</span>
                      <span className="mt-1 block font-mono text-[10px] tracking-[0.15em] text-dim">
                        {row.en}
                      </span>
                    </th>
                    {row.cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className={cn(
                          'rounded-xl border p-4 align-middle text-sm transition-all duration-300',
                          cell
                            ? 'border-line bg-ink-800 text-mist hover:border-line-strong hover:bg-ink-700 hover:text-paper'
                            : 'border-dashed border-line/60 bg-transparent text-dim/60',
                        )}
                      >
                        {cell ? cell.text : '— 暂未开展 —'}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={250}>
          <p className="mt-6 text-sm text-dim">
            灰色空格代表暂未开展的业务组合，欢迎与我们探讨新模式。
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Section 4 — 服务流程 ---------------- */

const STEPS = [
  { icon: MessageSquare, title: '初步接洽', desc: '项目信息提交，48 小时内响应' },
  { icon: Search, title: '预评估', desc: 'AI 评估工具快速测算 + 内部初审' },
  { icon: FileSearch, title: '尽职调查', desc: '技术、财务、法务三维尽调' },
  { icon: PenLine, title: '交易执行', desc: 'SPA 签署、交割与并网确认' },
  { icon: Gauge, title: '运营增效', desc: '接入集控中心，启动增效计划' },
]

function Process() {
  const lineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 75%', 'end 55%'],
  })

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading eyebrow="PROCESS" title="从初次接触到资产交付" />
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
                key={s.title}
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
                <h3 className="mt-2 text-base font-bold text-paper">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-mist">{s.desc}</p>
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
  {
    icon: BrainCircuit,
    color: 'text-volt-400',
    title: 'AI 评估体系',
    desc: '内部估值模型与公开版 AI 评估工具同源，参数一致、口径一致。',
  },
  {
    icon: Network,
    color: 'text-solar-400',
    title: '产业资源网络',
    desc: '覆盖开发商、EPC、整机商、电网与金融机构的深度合作网络。',
  },
  {
    icon: MonitorDot,
    color: 'text-volt-400',
    title: '智慧集控平台',
    desc: '全量电站数据秒级接入，发电量预测与故障诊断自动化。',
  },
  {
    icon: Landmark,
    color: 'text-solar-400',
    title: '结构化融资能力',
    desc: '与多家银行、租赁与产业基金的项目融资合作通道。',
  },
]

function Capabilities() {
  return (
    <section className="bg-ink-900 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1280px] gap-14 px-6 lg:grid-cols-3 lg:gap-12 lg:px-10">
        {/* left */}
        <div>
          <Reveal>
            <h2 className="font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.2] text-paper">
              一体化能力闭环
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-5 leading-[1.85] text-mist">
              投资眼光、交易效率与运营颗粒度，三者缺一不可。
            </p>
          </Reveal>
          <div className="mt-10 space-y-10 border-t border-line pt-10">
            <Reveal delay={200}>
              <p className="font-serif text-2xl font-bold text-paper">高效交割执行</p>
              <p className="mt-2 text-sm leading-6 text-mist">
                标准化尽调流程与 AI 辅助定价，让交易决策快速而确定。
              </p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.15em] text-dim">
                DEAL EXECUTION
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="font-serif text-2xl font-bold text-paper">精细化发电提升管理</p>
              <p className="mt-2 text-sm leading-6 text-mist">
                集控监控与技改增效并举，持续兑现电站资产价值。
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
            <Reveal key={c.title} delay={i * 100}>
              <GlowCard
                icon={<c.icon className={cn('h-5 w-5', c.color)} />}
                title={c.title}
                description={c.desc}
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
  return (
    <section className="relative overflow-hidden bg-ink-800">
      <img src="/cta-band-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-800/60 via-ink-800/80 to-ink-800/95" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(242,179,61,0.14),transparent)]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(44,224,190,0.10),transparent)]" />

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-10 px-6 py-20 lg:flex-row lg:items-center lg:px-10">
        <Reveal>
          <h3 className="font-serif text-2xl font-bold leading-snug text-paper lg:text-3xl">
            手上有项目？让我们帮你算一算
          </h3>
          <p className="mt-4 max-w-xl text-base leading-7 text-mist">
            用 AI 工具快速预评估项目价值，或直接提交项目信息，与投资团队取得联系。
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/ai-tool"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-7 py-3.5 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.02] hover:glow-gold active:scale-[0.97]"
            >
              <Sparkles className="h-4 w-4" />
              用 AI 工具预评估
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-line-strong px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:border-solar-400 hover:bg-solar-400/[0.08] hover:text-solar-300"
            >
              提交项目信息
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Page ---------------- */

export default function Business() {
  useEffect(() => {
    document.title = '业务领域 — 光伏风电储能投资·并购·运营 | 彭田环保'
  }, [])

  return (
    <>
      <PageHero
        breadcrumb={['首页', '业务领域']}
        title={
          <>
            投资 · 并购 · 运营
            <span className="mt-3 block font-serif text-[clamp(1.1rem,2vw,1.5rem)] font-bold leading-snug text-mist">
              光伏 × 风电 × 储能的全生命周期资产管理
            </span>
          </>
        }
        lead="彭田环保围绕三类核心资产，构建『投得准、并得进、管得好』的一体化能力闭环。"
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
