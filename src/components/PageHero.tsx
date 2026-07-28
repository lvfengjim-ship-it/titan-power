import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'

interface Props {
  breadcrumb: string[]
  title: ReactNode
  lead?: string
  image?: string
  coord?: string
}

/** 内页页头：面包屑 + Display 标题 + 导语 + 氛围图 + 渐隐 */
export default function PageHero({
  breadcrumb,
  title,
  lead,
  image = '/hero-poster.jpg',
  coord = '39.9042° N, 116.4074° E',
}: Props) {
  return (
    <section className="relative -mt-16 flex min-h-[400px] items-end overflow-hidden pt-16" style={{ height: '52vh' }}>
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        <img src={image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/40 to-abyss" />
        <div className="absolute inset-0 bg-grid-faint opacity-60" />
      </motion.div>

      <span className="absolute left-6 top-20 font-mono text-[10px] tracking-[0.15em] text-dim lg:left-10">
        {coord}
      </span>

      <div className="relative mx-auto w-full max-w-[1280px] px-6 pb-14 lg:px-10">
        <motion.nav
          className="flex items-center gap-2 text-xs text-dim"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {breadcrumb.map((b, i) => (
            <span key={b} className="flex items-center gap-2 font-mono">
              {i > 0 && <span className="text-dim/60">/</span>}
              {i === 0 ? (
                <Link to="/" className="transition-colors hover:text-mist">
                  {b}
                </Link>
              ) : (
                <span className="text-mist">{b}</span>
              )}
            </span>
          ))}
        </motion.nav>
        <motion.h1
          className="mt-5 font-serif text-[clamp(2.25rem,4.5vw,3.75rem)] font-bold leading-[1.15] text-paper"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h1>
        {lead && (
          <motion.p
            className="mt-5 max-w-2xl text-lg leading-[1.8] text-mist"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {lead}
          </motion.p>
        )}
      </div>
    </section>
  )
}
