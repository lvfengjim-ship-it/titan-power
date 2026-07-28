import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  icon?: ReactNode
  title: ReactNode
  description?: string
  linkText?: string
  onClick?: () => void
  className?: string
  children?: ReactNode
}

/** ink-800 卡片 + hover 顶部金色光线 */
export default function GlowCard({ icon, title, description, linkText, onClick, className, children }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-line bg-ink-800 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-line-strong',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {/* top gold light sweep */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-solar-400 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
      {icon && (
        <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-ink-850 text-solar-400">
          {icon}
        </div>
      )}
      <h3 className="font-sans text-lg font-bold text-paper">{title}</h3>
      {description && <p className="mt-3 text-sm leading-7 text-mist">{description}</p>}
      {children}
      {linkText && (
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-solar-400">
          {linkText}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      )}
    </div>
  )
}
