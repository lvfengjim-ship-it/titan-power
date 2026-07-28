import { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import TagBadge from '@/components/TagBadge'
import Reveal from '@/components/Reveal'
import { cn } from '@/lib/utils'
import type { Project } from './data'

/** 单个脉冲点：无限涟漪动画隔离在 memo 微组件中 */
const PulseDot = memo(function PulseDot({
  project,
  index,
  active,
  onSelect,
}: {
  project: Project
  index: number
  active: boolean
  onSelect: (p: Project) => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <motion.button
      type="button"
      aria-label={project.name}
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${project.map.x}%`, top: `${project.map.y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.5, type: 'spring', bounce: 0.45 }}
      onMouseEnter={() => {
        setHover(true)
        onSelect(project)
      }}
      onMouseLeave={() => setHover(false)}
      onFocus={() => onSelect(project)}
      onClick={() => onSelect(project)}
    >
      {/* ripple rings — 2.4s loop, staggered 0.4s */}
      {[0, 1].map((r) => (
        <span
          key={r}
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border',
            active || hover ? 'border-solar-400/70' : 'border-solar-400/40',
          )}
          style={{
            animation: `tp-map-ripple 2.4s cubic-bezier(0.22,1,0.36,1) ${index * 0.4 + r * 1.2}s infinite`,
          }}
        />
      ))}
      <span
        className={cn(
          'relative block h-3 w-3 rounded-full transition-all duration-300',
          active
            ? 'scale-125 bg-solar-300 shadow-[0_0_16px_2px_rgba(242,179,61,0.7)]'
            : 'bg-solar-400 shadow-[0_0_10px_1px_rgba(242,179,61,0.5)] group-hover:scale-110',
        )}
      />
      {/* tooltip */}
      <span
        className={cn(
          'pointer-events-none absolute left-1/2 top-full z-10 mt-3 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-ink-900/95 px-3 py-2 backdrop-blur transition-all duration-200',
          hover ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
        )}
      >
        <span className="block text-xs font-bold text-paper">{project.name}</span>
        <span className="mt-0.5 block font-mono text-[10px] tracking-[0.08em] text-solar-400">
          {project.keyData}
        </span>
      </span>
    </motion.button>
  )
})

interface Props {
  projects: Project[]
  selected: Project
  onSelect: (p: Project) => void
}

/** Section 2 — 能源版图：点阵中国地图 + 脉冲点联动信息面板 */
export default function EnergyMap({ projects, selected, onSelect }: Props) {
  const scrollToCard = () => {
    document
      .getElementById(`project-card-${selected.id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10">
      <style>{`@keyframes tp-map-ripple{0%{transform:translate(-50%,-50%) scale(0.4);opacity:0.9}70%{opacity:0.25}100%{transform:translate(-50%,-50%) scale(1.9);opacity:0}}`}</style>
      <Reveal>
        <p className="flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.28em] text-solar-400">
          <span className="inline-block h-px w-6 bg-solar-400" />
          ENERGY MAP
        </p>
        <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.2] text-paper">
          点亮中国能源版图
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        {/* 地图 7 列 */}
        <Reveal className="lg:col-span-7" delay={100}>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-850/60 p-4 lg:p-8">
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.2 }}
            >
              <img
                src="/map-china.svg"
                alt="中国能源版图点阵地图"
                className="h-auto w-full select-none opacity-90"
                draggable={false}
              />
              {projects.map((p, i) => (
                <PulseDot
                  key={p.id}
                  project={p}
                  index={i}
                  active={selected.id === p.id}
                  onSelect={onSelect}
                />
              ))}
            </motion.div>
            <p className="mt-4 font-mono text-[10px] tracking-[0.15em] text-dim">
              38 PLANTS · 12 PROVINCES · DOT MAP ILLUSTRATION
            </p>
          </div>
        </Reveal>

        {/* 联动面板 5 列 */}
        <Reveal className="lg:col-span-5" delay={200}>
          <div className="relative flex h-full min-h-[380px] flex-col rounded-2xl border border-line bg-ink-800 p-7 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-col"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <TagBadge tone={selected.tone}>{selected.type}</TagBadge>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 text-[11px] font-medium text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {selected.status}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-2xl font-bold text-paper">{selected.name}</h3>
                <p className="mt-1 font-mono text-xs tracking-[0.08em] text-dim">
                  {selected.province}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
                  {[
                    { label: '装机容量', value: selected.capacity, note: selected.capacityNote },
                    { label: '年发电量', value: selected.annualGen, note: 'ANNUAL GEN' },
                    { label: '并网年份', value: selected.gridYear, note: 'GRID CONNECTED' },
                    { label: '年 CO₂ 减排', value: selected.co2, note: 'CO₂ REDUCED / YR' },
                  ].map((d) => (
                    <div key={d.label} className="bg-ink-850 p-4">
                      <p className="text-xs text-dim">{d.label}</p>
                      <p className="mt-1.5 font-mono text-lg font-medium text-solar-300 tabular-nums">
                        {d.value}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-dim">
                        {d.note}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-sm leading-7 text-mist">{selected.highlight}</p>

                <button
                  type="button"
                  onClick={scrollToCard}
                  className="group mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-solar-400 transition-colors hover:text-solar-300"
                >
                  查看完整案例
                  <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
