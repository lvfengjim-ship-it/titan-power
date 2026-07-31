import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/i18n'

gsap.registerPlugin(ScrollTrigger)

const EnergyGlobe = lazy(() => import('./EnergyGlobe'))

/** 静态星点背景（150 颗 1px 白点） */
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)
    for (let i = 0; i < 150; i++) {
      ctx.fillStyle = `rgba(237,242,249,${(0.1 + Math.random() * 0.4).toFixed(2)})`
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
    }
  }, [])
  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      aria-hidden
    />
  )
}

export default function HeroSection() {
  const { t } = useLang()
  const root = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)

  const title = t('home.hero.title')
  const heroStats = [
    { key: 'focus', label: t('home.hero.stats.focus.label'), value: t('home.hero.stats.focus.value') },
    { key: 'model', label: t('home.hero.stats.model.label'), value: t('home.hero.stats.model.value') },
    { key: 'method', label: t('home.hero.stats.method.label'), value: t('home.hero.stats.method.value') },
    { key: 'holding', label: t('home.hero.stats.holding.label'), value: t('home.hero.stats.holding.value') },
  ]

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!root.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.hero-char, .hero-fade, .hero-bar', { opacity: 1, y: 0, rotateX: 0 })
        return
      }
      // globe entrance
      gsap.fromTo(
        '.hero-globe',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out', delay: 0.3 },
      )
      // char-level title split
      gsap.fromTo(
        '.hero-char',
        { y: 60, opacity: 0, rotateX: -40 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.07,
          duration: 1,
          ease: 'cubic-bezier(0.22,1,0.36,1)',
          delay: 0.4,
        },
      )
      // lead + buttons
      gsap.fromTo(
        '.hero-fade',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: 'cubic-bezier(0.22,1,0.36,1)',
          delay: 1.0,
        },
      )
      gsap.fromTo('.hero-bar', { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 1.4 })
      // scroll parallax
      gsap.to('.hero-globe', {
        y: 80,
        opacity: 0.4,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-fg', {
        y: -40,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative -mt-16 flex min-h-[100dvh] min-h-[640px] flex-col overflow-hidden"
    >
      {/* radial abyss gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#0A0F1D_0%,#05080F_70%)]" />
      <Starfield />
      {/* globe: right-center on desktop */}
      <div className="hero-globe absolute inset-0 opacity-0 lg:left-[28%]">
        {mounted && (
          <Suspense fallback={null}>
            <EnergyGlobe />
          </Suspense>
        )}
      </div>

      {/* coordinates */}
      <span className="absolute left-6 top-24 z-10 font-mono text-[10px] tracking-[0.15em] text-dim lg:left-10">
        20.0440° N · 110.1989° E / HAIKOU HQ
      </span>

      {/* foreground */}
      <div className="hero-fg relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 items-center px-6 lg:px-10">
        <div className="max-w-[55%] max-lg:max-w-full py-28">
          <p className="hero-fade flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.28em] text-solar-400 opacity-0">
            <span className="inline-block h-px w-6 bg-solar-400" />
            Distributed Energy Investment
          </p>
          <h1
            className="mt-6 font-serif text-[clamp(2.75rem,6.5vw,5.5rem)] font-black leading-[1.08] tracking-[0.01em] text-paper"
            style={{ perspective: '800px' }}
          >
            {title.split('').map((ch, i) => (
              <span key={i} className="hero-char inline-block opacity-0 will-change-transform">
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </h1>
          <p className="hero-fade mt-4 font-serif text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold leading-snug text-paper/90 opacity-0">
            {t('home.hero.slogan')}
          </p>
          <p className="hero-fade mt-6 max-w-xl text-lg leading-[1.8] text-mist opacity-0">
            {t('home.hero.lead')}
          </p>
          <div className="hero-fade mt-10 flex flex-wrap gap-4 opacity-0">
            <Link
              to="/ai-tool"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-7 py-3.5 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.02] hover:glow-gold active:scale-[0.97]"
            >
              <Sparkles className="h-4 w-4" />
              {t('home.hero.ctaAi')}
            </Link>
            <Link
              to="/business"
              className="rounded-xl border border-line-strong px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:border-solar-400 hover:bg-solar-400/[0.08] hover:text-solar-300"
            >
              {t('home.hero.ctaBusiness')}
            </Link>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-24 right-8 z-10 hidden flex-col items-center gap-3 lg:flex">
        <span className="font-mono text-[10px] tracking-[0.3em] text-dim" style={{ writingMode: 'vertical-rl' }}>
          SCROLL
        </span>
        <span className="tp-breathe block h-12 w-px bg-gradient-to-b from-solar-400 to-transparent" />
      </div>

      {/* bottom data bar */}
      <div className="hero-bar relative z-10 border-t border-line bg-abyss/40 opacity-0 backdrop-blur-sm">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-line px-6 lg:grid-cols-4 lg:px-10">
          {heroStats.map((s) => (
            <div key={s.key} className="px-5 py-4">
              <p className="font-mono text-xs text-dim">{s.label}</p>
              <p className="mt-1 font-display text-lg font-bold text-paper tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
