import type { ReactNode } from 'react'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  image: string
  title: ReactNode
  badge?: ReactNode
  description?: string
  meta?: ReactNode
  aspect?: 'video' | 'portrait'
  playable?: boolean
  footer?: ReactNode
  className?: string
  onClick?: () => void
}

/** 图片卡：底部压暗渐变 + hover 图缩放 + 播放按钮浮现 */
export default function MediaCard({
  image,
  title,
  badge,
  description,
  meta,
  aspect = 'video',
  playable = false,
  footer,
  className,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-line bg-ink-800 transition-all duration-500 hover:-translate-y-1.5 hover:border-line-strong',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      <div className={cn('relative overflow-hidden', aspect === 'video' ? 'aspect-video' : 'aspect-[4/5]')}>
        <img
          src={image}
          alt={typeof title === 'string' ? title : ''}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-800/0 via-ink-800/0 to-[rgba(5,8,15,0.7)]" />
        {playable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 scale-90 items-center justify-center rounded-full border border-white/30 bg-black/40 opacity-0 backdrop-blur transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
            </span>
          </div>
        )}
        {badge && <div className="absolute left-4 top-4">{badge}</div>}
        {/* bottom gold edge on hover */}
        <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-solar-400 transition-transform duration-500 group-hover:scale-x-100" />
      </div>
      <div className="p-5">
        <h3 className="font-sans text-base font-bold leading-snug text-paper">{title}</h3>
        {description && <p className="mt-2 text-sm leading-6 text-mist">{description}</p>}
        {meta && <div className="mt-3 font-mono text-xs tracking-[0.08em] text-dim">{meta}</div>}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  )
}
