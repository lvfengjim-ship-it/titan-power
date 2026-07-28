import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Menu, X, MessageSquare, PlaySquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export const NAV_LINKS = [
  { to: '/', label: '首页' },
  { to: '/about', label: '关于我们' },
  { to: '/business', label: '业务领域' },
  { to: '/projects', label: '项目案例' },
  { to: '/insights', label: '前沿洞察' },
  { to: '/contact', label: '联系我们' },
]

export const NAV_HEIGHT = 64 // px — h-16; Layout owns this offset

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-16 transition-all duration-500',
        scrolled
          ? 'border-b border-line bg-[rgba(5,8,15,0.72)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-10">
        {/* brand */}
        <Link to="/" className="group flex items-center gap-3">
          <img src="/logo.svg" alt="泰坦能源" className="h-8 w-8" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold text-paper">泰坦能源</span>
            <span className="mt-1 font-display text-[10px] font-medium tracking-[0.3em] text-dim">
              TITAN POWER
            </span>
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group relative py-2 text-[0.925rem] font-medium transition-colors',
                  isActive ? 'text-paper' : 'text-mist hover:text-paper',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-0.5 bg-solar-400 transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full',
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-xs tracking-[0.08em] text-dim xl:block">
            TITAN-POWER.CN
          </span>
          <Link
            to="/ai-tool"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-5 py-2.5 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.02] hover:glow-gold active:scale-[0.97] sm:flex"
          >
            <Sparkles className="h-4 w-4" />
            AI 投资评估
          </Link>
          <button
            className="text-paper lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="打开菜单"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-abyss/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.aside
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col border-l border-line bg-ink-900 px-8 py-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <img src="/logo.svg" alt="泰坦能源" className="h-8 w-8" />
                <button onClick={() => setOpen(false)} aria-label="关闭菜单" className="text-mist">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-12 flex flex-col gap-6">
                {NAV_LINKS.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.1, duration: 0.4 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'font-serif text-2xl font-bold',
                          isActive ? 'text-solar-400' : 'text-paper',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-5">
                <Link
                  to="/ai-tool"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-5 py-3 text-sm font-bold text-abyss"
                >
                  <Sparkles className="h-4 w-4" />
                  AI 投资评估
                </Link>
                <div className="flex items-center gap-6 text-dim">
                  <span className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4" /> 公众号 · 申请中
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <PlaySquare className="h-4 w-4" /> 视频号 · 申请中
                  </span>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
