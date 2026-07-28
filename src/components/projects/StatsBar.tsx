import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { SUMMARY_STATS } from './data'

/** 单格 count-up（进入视口触发，1.6s ease-out） */
function Cell({
  value,
  decimals,
  suffix,
  label,
  delay,
}: {
  value: number
  decimals: number
  suffix: string
  label: string
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return
        started.current = true
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setDisplay(value)
          return
        }
        const t0 = performance.now() + delay
        const tick = (t: number) => {
          const p = Math.min(1, Math.max(0, (t - t0) / 1600))
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplay(value * eased)
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, delay])

  return (
    <div ref={ref} className="px-6 py-8 text-center lg:py-10">
      <p className="font-display text-3xl font-bold tracking-[-0.02em] text-solar-400 tabular-nums lg:text-4xl">
        {display.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        <span className="ml-1.5 font-display text-base font-medium text-mist">{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-mist">{label}</p>
    </div>
  )
}

/** Section 3 — 汇总数据条：上下 1px line 的横向数据带（占位数据） */
export default function StatsBar() {
  return (
    <section className="border-y border-line bg-ink-900/40">
      <div
        className={cn(
          'mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-y divide-line px-0 lg:grid-cols-5 lg:divide-y-0',
        )}
      >
        {SUMMARY_STATS.map((s, i) => (
          <Cell
            key={s.label}
            value={s.value}
            decimals={s.decimals}
            suffix={s.suffix}
            label={s.label}
            delay={i * 100}
          />
        ))}
      </div>
    </section>
  )
}
