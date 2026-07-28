import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  value: number
  decimals?: number
  suffix?: string
  label: string
  note: string
  className?: string
}

function format(n: number, decimals: number) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** Data Number + 中文标签 + mono 英文小注，进入视口 count-up */
export default function StatBlock({ value, decimals = 0, suffix, label, note, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          if (reduced) {
            setDisplay(value)
            return
          }
          const t0 = performance.now()
          const dur = 1600
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur)
            const eased = 1 - Math.pow(1 - p, 3)
            setDisplay(value * eased)
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return (
    <div ref={ref} className={cn('group', className)}>
      <p className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none tracking-[-0.02em] text-solar-400 tabular-nums">
        {format(display, decimals)}
        {suffix && (
          <span className="ml-2 font-display text-lg font-medium text-mist">{suffix}</span>
        )}
      </p>
      <p className="mt-3 text-base font-medium text-paper">{label}</p>
      <p className="mt-1 font-mono text-xs tracking-[0.08em] text-dim">{note}</p>
    </div>
  )
}
