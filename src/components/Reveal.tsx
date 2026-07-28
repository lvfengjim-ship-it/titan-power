import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
}

/** Standard section entrance: fade + rise on viewport entry (20% threshold) */
export default function Reveal({ children, delay = 0, y = 32, className, once = true }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true)
          if (once) io.disconnect()
        } else if (!once) {
          setShown(false)
        }
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={cn('transition-all', className)}
      style={{
        transitionDuration: '900ms',
        transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
        transitionDelay: `${delay}ms`,
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  )
}
