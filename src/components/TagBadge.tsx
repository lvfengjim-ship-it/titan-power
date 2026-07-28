import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const STYLES: Record<string, string> = {
  gold: 'border-solar-400/40 text-solar-300 bg-solar-400/10',
  volt: 'border-volt-400/40 text-volt-300 bg-volt-400/10',
  storage: 'border-[#7A8CFF]/40 text-[#7A8CFF] bg-[#7A8CFF]/10',
  hydrogen: 'border-[#5EECD4]/40 text-[#5EECD4] bg-[#5EECD4]/10',
  nuclear: 'border-[#F2994A]/40 text-[#F2994A] bg-[#F2994A]/10',
}

interface Props {
  children: ReactNode
  tone?: keyof typeof STYLES
  className?: string
}

/** 圆角描边小徽章：光伏=金、风电=青、储能=紫蓝、氢能、核能 */
export default function TagBadge({ children, tone = 'gold', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
        STYLES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
