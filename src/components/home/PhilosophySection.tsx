import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  {
    no: '01',
    title: '长期主义',
    body: '电站是 25 年的资产。我们以持有人的耐心做每一笔投资，不追逐短期价差，只赚取时间与运营的钱。',
  },
  {
    no: '02',
    title: '数据驱动',
    body: '从辐照资源到限电率，从电价政策到设备衰减，每一个决策都建立在数据模型之上——这也是我们开放 AI 评估工具的原因。',
  },
  {
    no: '03',
    title: '产业共生',
    body: '与开发商、电网、金融机构与地方政府共建生态，让绿色资产的价值链每个环节都能获益。',
  },
]

/** ScrollTrigger pin 叙事：三段理念依次点亮 */
export default function PhilosophySection() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!root.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduced) return
      gsap.fromTo(
        '.phil-title',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'cubic-bezier(0.22,1,0.36,1)',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        },
      )
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        onUpdate: (self) => {
          const idx = Math.min(2, Math.floor(self.progress * 3))
          setActive(idx)
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative min-h-[100dvh] overflow-hidden bg-abyss">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1280px] flex-col justify-center gap-16 px-6 py-24 lg:flex-row lg:items-center lg:px-10">
        {/* left fixed column */}
        <div className="phil-title lg:w-[40%]">
          <p className="flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.28em] text-solar-400">
            <span className="inline-block h-px w-6 bg-solar-400" />
            Philosophy
          </p>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.2] text-paper">
            我们的投资信条
          </h2>
          {/* progress dots */}
          <div className="mt-10 hidden items-start gap-4 lg:flex">
            <div className="relative h-32 w-px bg-line">
              <div
                className="absolute left-0 top-0 w-px bg-solar-400 transition-all duration-500"
                style={{ height: `${((active + 1) / 3) * 100}%` }}
              />
            </div>
            <div className="flex h-32 flex-col justify-between">
              {ITEMS.map((it, i) => (
                <span
                  key={it.no}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all duration-500',
                    i <= active ? 'bg-solar-400' : 'bg-ink-700',
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* right cards */}
        <div className="flex flex-col gap-6 lg:w-[60%]">
          {ITEMS.map((it, i) => {
            const isActive = i === active
            return (
              <div
                key={it.no}
                className={cn(
                  'relative rounded-2xl border bg-ink-800 p-8 transition-all duration-700',
                  isActive
                    ? 'border-line-strong opacity-100'
                    : 'border-line opacity-25 blur-[1px]',
                )}
              >
                <span
                  className={cn(
                    'absolute left-0 top-6 h-[calc(100%-3rem)] w-[3px] rounded-full bg-solar-400 transition-opacity duration-500',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <p
                  className={cn(
                    'font-mono text-sm tracking-[0.2em] transition-colors duration-500',
                    isActive ? 'text-solar-400' : 'text-dim',
                  )}
                >
                  {it.no}
                </p>
                <h3 className="mt-3 font-serif text-xl font-bold text-paper lg:text-2xl">
                  {it.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-8 text-mist">{it.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
