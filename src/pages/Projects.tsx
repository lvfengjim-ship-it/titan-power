import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import TagBadge from '@/components/TagBadge'
import EnergyMap from '@/components/projects/EnergyMap'
import StatsBar from '@/components/projects/StatsBar'
import ProjectDialog from '@/components/projects/ProjectDialog'
import { PROJECTS, PROJECT_TABS } from '@/components/projects/data'
import type { Project, ProjectType } from '@/components/projects/data'
import { cn } from '@/lib/utils'

type Tab = '全部' | ProjectType

export default function Projects() {
  const [selected, setSelected] = useState<Project>(PROJECTS[0])
  const [tab, setTab] = useState<Tab>('全部')
  const [dialogProject, setDialogProject] = useState<Project | null>(null)

  const filtered = useMemo(
    () => (tab === '全部' ? PROJECTS : PROJECTS.filter((p) => p.type === tab)),
    [tab],
  )

  return (
    <>
      {/* Section 1 — PageHero */}
      <PageHero
        breadcrumb={['首页', '项目案例']}
        title="从戈壁到海岸的能源版图"
        lead="38 座电站，12 个省份，1.2 GW+ 装机。每一座电站，都是一份 25 年的承诺。"
        image="/project-guangdong-offshore.jpg"
        coord="38 PLANTS · 12 PROVINCES · 1.2 GW+"
      />

      {/* Section 2 — 能源版图 */}
      <EnergyMap projects={PROJECTS} selected={selected} onSelect={setSelected} />

      {/* Section 3 — 汇总数据条 */}
      <StatsBar />

      {/* Section 4 — 项目卡片墙 */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10">
        <Reveal>
          <p className="flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.28em] text-solar-400">
            <span className="inline-block h-px w-6 bg-solar-400" />
            PORTFOLIO
          </p>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.2] text-paper">
            代表性项目
          </h2>
        </Reveal>

        {/* 筛选条（sticky 玻璃拟态） */}
        <div className="sticky top-16 z-30 mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-abyss/70 px-4 py-3 backdrop-blur-xl">
            <div className="flex flex-wrap gap-1">
              {PROJECT_TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    'relative rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300',
                    tab === t ? 'text-abyss' : 'text-mist hover:text-paper',
                  )}
                >
                  {tab === t && (
                    <motion.span
                      layoutId="project-tab-indicator"
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative">{t}</span>
                </button>
              ))}
            </div>
            <span className="hidden font-mono text-xs tracking-[0.1em] text-dim sm:block">
              SHOWING {filtered.length} / 38
            </span>
          </div>
        </div>

        {/* 卡片网格（layout 重排动画） */}
        <motion.div layout className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.article
                layout
                key={p.id}
                id={`project-card-${p.id}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  layout: { type: 'spring', bounce: 0.15, duration: 0.45 },
                  opacity: { duration: 0.3, delay: i * 0.06 },
                  scale: { duration: 0.3, delay: i * 0.06 },
                }}
                onClick={() => {
                  setSelected(p)
                  setDialogProject(p)
                }}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-line bg-ink-800 transition-all duration-500 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-[0_12px_40px_-12px_rgba(242,179,61,0.25)]"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform [transition-duration:600ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4">
                    <TagBadge tone={p.tone}>{p.type}</TagBadge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-paper">{p.name}</h3>
                  <p className="mt-1 text-xs text-dim">{p.province}</p>
                  <p className="mt-3 font-mono text-xs tracking-[0.08em] text-mist">{p.keyData}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-solar-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    查看详情
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  {/* hover 金色光边 */}
                  <span className="pointer-events-none mt-4 block h-px origin-left scale-x-0 bg-gradient-to-r from-solar-400 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal delay={100}>
          <p className="mt-10 text-sm text-dim">
            以上为部分代表性项目，完整项目名录涉及商业信息，合作洽谈中可提供。
          </p>
        </Reveal>
      </section>

      {/* Section 5 — 案例详情 Dialog */}
      <ProjectDialog project={dialogProject} onClose={() => setDialogProject(null)} />

      {/* Section 6 — CTA Band */}
      <section className="relative overflow-hidden border-t border-line bg-ink-800">
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
              下一座电站，也许就是您的项目
            </h3>
            <p className="mt-4 text-base leading-7 text-mist">
              提交项目信息，我们的投资团队将在 48 小时内响应；或先用 AI 工具完成一次免费预评估。
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-7 py-3.5 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.02] hover:glow-gold active:scale-[0.97]"
            >
              提交项目信息
            </Link>
            <Link
              to="/ai-tool"
              className="flex items-center gap-2 rounded-xl border border-line-strong px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:border-volt-400 hover:bg-volt-400/[0.08] hover:text-volt-300"
            >
              <Sparkles className="h-4 w-4" />
              AI 预评估
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
