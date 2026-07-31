import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Check, Sparkles } from 'lucide-react'
import Reveal from '@/components/Reveal'
import TagBadge from '@/components/TagBadge'

const FEATURES = ['财务模型实时测算', 'AI 深度解读', '敏感性分析', '完全免费 · 无需注册']
const TYPE_TEXT = '本项目资本金内部收益率优于行业基准，建议关注电价政策与消纳风险…'

/** 微缩仪表盘 mock（纯 UI，非图片） */
function DashboardMock() {
  const wrap = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 4, ry: -8 })
  const [irr, setIrr] = useState(12.8)
  const [typed, setTyped] = useState('')
  const pathRef = useRef<SVGPathElement>(null)
  const [drawn, setDrawn] = useState(false)

  // tilt follows mouse (desktop)
  useEffect(() => {
    const el = wrap.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      setTilt({ rx: 4 - py * 6, ry: -8 + px * 8 })
    }
    const onLeave = () => setTilt({ rx: 4, ry: -8 })
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // IRR count-up loop demo
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    let raf = 0
    const t0 = performance.now()
    const loop = (t: number) => {
      const cycle = ((t - t0) / 4000) % 1
      const eased = 1 - Math.pow(1 - Math.min(1, cycle / 0.4), 3)
      setIrr(10.2 + (12.8 - 10.2) * (cycle < 0.4 ? eased : 1))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // cashflow path draw on view
  useEffect(() => {
    const p = pathRef.current
    if (!p) return
    const len = p.getTotalLength()
    p.style.strokeDasharray = `${len}`
    p.style.strokeDashoffset = `${len}`
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting && !drawn) {
          setDrawn(true)
          p.style.transition = 'stroke-dashoffset 2s ease-out'
          p.style.strokeDashoffset = '0'
        }
      },
      { threshold: 0.4 },
    )
    io.observe(p)
    return () => io.disconnect()
  }, [drawn])

  // typewriter loop
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setTyped(TYPE_TEXT)
      return
    }
    let i = 0
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      i = (i + 1) % (TYPE_TEXT.length + 60)
      setTyped(TYPE_TEXT.slice(0, Math.min(i, TYPE_TEXT.length)))
      timer = setTimeout(tick, i > TYPE_TEXT.length ? 80 : 40)
    }
    timer = setTimeout(tick, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={wrap} style={{ perspective: '1200px' }}>
      <div
        className="animate-[tp-float_6s_ease-in-out_infinite] rounded-2xl border border-line bg-ink-850 p-6 shadow-2xl transition-transform duration-200"
        style={{
          transform: `rotateY(${tilt.ry}deg) rotateX(${tilt.rx}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs tracking-[0.15em] text-dim">PT AI · PROJECT EVAL</p>
          <span className="flex h-2 w-2">
            <span className="absolute h-2 w-2 animate-ping rounded-full bg-volt-400 opacity-60" />
            <span className="h-2 w-2 rounded-full bg-volt-400" />
          </span>
        </div>

        {/* sliders */}
        <div className="mt-5 space-y-4">
          {[
            { label: '装机容量', val: '120 MW', w: '72%' },
            { label: '利用小时', val: '1350 h', w: '58%' },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between text-xs">
                <span className="text-mist">{s.label}</span>
                <span className="font-mono text-paper">{s.val}</span>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-ink-700">
                <div className="h-1 rounded-full bg-gradient-to-r from-volt-400 to-solar-400" style={{ width: s.w }} />
              </div>
            </div>
          ))}
        </div>

        {/* IRR */}
        <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
          <div>
            <p className="font-mono text-xs text-dim">资本金 IRR</p>
            <p className="mt-1 font-display text-4xl font-bold text-solar-400 tabular-nums">
              {irr.toFixed(1)}%
            </p>
          </div>
          <div className="text-right text-xs text-mist">
            <p>
              LCOE <span className="font-mono text-paper">0.241 元/kWh</span>
            </p>
            <p className="mt-1">
              回收期 <span className="font-mono text-paper">8.6 年</span>
            </p>
          </div>
        </div>

        {/* cashflow mini chart */}
        <svg viewBox="0 0 280 72" className="mt-5 w-full">
          <path
            ref={pathRef}
            d="M0 60 C 30 58, 45 40, 70 38 S 115 30, 140 26 S 200 16, 230 12 L 280 8"
            fill="none"
            stroke="#F2B33D"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M0 60 C 30 58, 45 40, 70 38 S 115 30, 140 26 S 200 16, 230 12 L 280 8 L 280 72 L 0 72 Z"
            fill="url(#ai-mock-fill)"
          />
          <defs>
            <linearGradient id="ai-mock-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F2B33D" stopOpacity="0.25" />
              <stop offset="1" stopColor="#F2B33D" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* AI 解读 typewriter */}
        <div className="mt-4 rounded-xl border border-volt-400/20 bg-volt-400/5 p-3">
          <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] text-volt-400">
            <Sparkles className="h-3 w-3" /> AI 解读
          </p>
          <p className="mt-1.5 min-h-[1.25rem] text-xs leading-5 text-mist">
            {typed}
            <span className="ml-0.5 inline-block h-3 w-px animate-pulse bg-volt-400 align-middle" />
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AiToolSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-32 lg:px-10">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-3xl bg-ink-800 p-8 lg:p-14"
          style={{
            border: '1px solid transparent',
            backgroundImage:
              'linear-gradient(#111A2E, #111A2E), linear-gradient(135deg, rgba(242,179,61,0.5), rgba(44,224,190,0.5))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(44,224,190,0.10),transparent)]" />
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* copy */}
            <div>
              <TagBadge tone="volt">AI 驱动 · 免费开放</TagBadge>
              <h3 className="mt-5 font-serif text-2xl font-bold leading-snug text-paper lg:text-3xl">
                10 分钟，算清一座电站的投资账
              </h3>
              <p className="mt-4 max-w-lg text-base leading-8 text-mist">
                输入装机容量、利用小时、电价、造价与融资参数，即刻获得 IRR、LCOE、投资回收期等专业指标，并由
                AI 大模型生成专属投资解读报告。
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-paper">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-volt-400/15 text-volt-400">
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/ai-tool"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-7 py-3.5 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.02] hover:glow-gold active:scale-[0.97]"
              >
                <Sparkles className="h-4 w-4" />
                立即开始评估
              </Link>
            </div>
            {/* product mock */}
            <Reveal delay={300}>
              <DashboardMock />
            </Reveal>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
