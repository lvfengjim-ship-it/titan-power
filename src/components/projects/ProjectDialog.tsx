import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { X, Sparkles, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import TagBadge from '@/components/TagBadge'
import type { Project } from './data'

/** 详情数字：打开时 count-up 1s（支持前缀数字 + 中文单位后缀，如 "5.4 亿 kWh"） */
function CountUp({ text }: { text: string }) {
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    const m = text.match(/^([\d,]+(?:\.\d+)?)(.*)$/)
    if (!m || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text)
      return
    }
    const num = parseFloat(m[1].replace(/,/g, ''))
    const decimals = m[1].includes('.') ? m[1].split('.')[1].length : 0
    const hasComma = m[1].includes(',')
    const suffix = m[2]
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1000)
      const eased = 1 - Math.pow(1 - p, 3)
      const v = num * eased
      setDisplay(
        (hasComma
          ? v.toLocaleString('en-US', { maximumFractionDigits: decimals })
          : v.toFixed(decimals)) + suffix,
      )
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text])

  return <span className="tabular-nums">{display}</span>
}

interface Props {
  project: Project | null
  onClose: () => void
}

/** Section 5 — 案例详情 Dialog */
export default function ProjectDialog({ project, onClose }: Props) {
  return (
    <Dialog open={project !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] max-w-4xl gap-0 overflow-y-auto rounded-2xl border-line bg-ink-900 p-0 no-scrollbar sm:rounded-2xl">
        {project && (
          <>
            {/* 顶部大图 */}
            <div className="relative aspect-video w-full overflow-hidden">
              <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-abyss/60 text-mist backdrop-blur transition-colors hover:border-line-strong hover:text-paper"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-8 lg:px-10">
              {/* 标题行 */}
              <div className="flex flex-wrap items-center gap-3">
                <DialogTitle className="font-serif text-2xl font-bold text-paper lg:text-3xl">
                  {project.name}
                </DialogTitle>
                <TagBadge tone={project.tone}>{project.type}</TagBadge>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 text-[11px] font-medium text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {project.status}
                </span>
              </div>
              <p className="mt-2 font-mono text-xs tracking-[0.08em] text-dim">{project.province}</p>

              {/* 数据仪表盘条 */}
              <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-5">
                {[
                  { label: '装机容量', value: project.capacity, note: project.capacityNote },
                  { label: '年发电量', value: project.annualGen, note: '' },
                  { label: '利用小时', value: project.hours, note: '' },
                  { label: '并网年份', value: project.gridYear, note: '' },
                  { label: '年减排', value: project.co2, note: '' },
                ].map((d) => (
                  <div key={d.label} className="bg-ink-850 p-4">
                    <p className="text-[11px] text-dim">{d.label}</p>
                    <p className="mt-1.5 font-mono text-base font-medium text-solar-300">
                      <CountUp text={d.value} />
                      {d.note && (
                        <span className="ml-1 font-mono text-[10px] text-dim">{d.note}</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* 三段正文 */}
              <div className="mt-9 space-y-8">
                {[
                  { title: '项目背景', body: project.background },
                  { title: '交易与建设', body: project.deal },
                  { title: '运营表现', body: project.operation },
                ].map((sec) => (
                  <div key={sec.title}>
                    <h4 className="flex items-center gap-3 text-base font-bold text-paper">
                      <span className="inline-block h-4 w-1 rounded-full bg-gradient-to-b from-solar-300 to-solar-500" />
                      {sec.title}
                    </h4>
                    <p className="mt-3 text-sm leading-[1.9] text-mist">{sec.body}</p>
                  </div>
                ))}
              </div>

              {/* 底部 CTA */}
              <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-line bg-ink-800 p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-paper">有类似项目？</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/ai-tool"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-5 py-2.5 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.02] hover:glow-gold active:scale-[0.97]"
                  >
                    <Sparkles className="h-4 w-4" />
                    用 AI 工具测算
                  </Link>
                  <Link
                    to="/contact"
                    className="group flex items-center gap-2 rounded-xl border border-line-strong px-5 py-2.5 text-sm font-medium text-paper transition-all duration-300 hover:border-solar-400 hover:bg-solar-400/[0.08] hover:text-solar-300"
                  >
                    联系我们
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
