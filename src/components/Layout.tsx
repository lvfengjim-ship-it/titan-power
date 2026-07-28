import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Shared site layout.
 * Navbar is `fixed` (h-16) per design.md → this layout owns the top offset
 * (`pt-16` on the content slot). Pages must NOT add nav-height padding.
 * Full-bleed hero sections opt out inside the page (e.g. `-mt-16`).
 */
export default function Layout() {
  const location = useLocation()
  const lenisRef = useRef<Lenis | null>(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const [showTop, setShowTop] = useState(false)

  // Lenis smooth scrolling (disabled under prefers-reduced-motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1.0 })
    lenis.on('scroll', () => ScrollTrigger.update())
    lenisRef.current = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-[100dvh] bg-abyss text-paper">
      {/* scroll progress bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-solar-400 to-volt-400"
        style={{ scaleX: progress }}
      />
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />

      {/* back to top */}
      <button
        aria-label="回到顶部"
        onClick={() => {
          if (lenisRef.current) lenisRef.current.scrollTo(0)
          else window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        className={`fixed bottom-8 right-8 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ink-800/90 text-mist backdrop-blur transition-all duration-500 hover:border-solar-400/50 hover:text-solar-300 hover:shadow-[0_0_24px_-4px_rgba(242,179,61,0.5)] ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  )
}
