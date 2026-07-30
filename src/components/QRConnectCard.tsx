import { cn } from '@/lib/utils'

interface Props {
  src: string
  platform: string
  status?: string
  accent?: 'gold' | 'volt'
  title?: string
  compact?: boolean
  className?: string
}

/** 公众号/视频号二维码连接卡 */
export default function QRConnectCard({
  src,
  platform,
  status = '申请中',
  accent = 'gold',
  title,
  compact = false,
  className,
}: Props) {
  const border =
    accent === 'gold'
      ? 'hover:border-solar-400/50'
      : 'hover:border-volt-400/50'
  const badge =
    accent === 'gold'
      ? 'border-solar-400/40 text-solar-300'
      : 'border-volt-400/40 text-volt-300'

  if (compact) {
    return (
      <div
        className={cn(
          'group rounded-xl border border-line bg-ink-800 p-2 transition-all duration-300 hover:-translate-y-1',
          border,
          className,
        )}
      >
        <img src={src} alt={platform} className="h-20 w-20 rounded-lg" width={80} height={80} />
        <p className="mt-2 text-center text-xs text-mist">{platform}</p>
        <p className="text-center text-[10px] text-dim">{status}</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-5 rounded-2xl border border-line bg-ink-800 p-5 transition-all duration-300 hover:-translate-y-1',
        border,
        className,
      )}
    >
      <img src={src} alt={platform} className="h-24 w-24 rounded-xl" width={96} height={96} />
      <div>
        <p className="font-sans text-base font-bold text-paper">{title ?? `彭田环保·${platform}`}</p>
        <span
          className={cn(
            'mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[11px]',
            badge,
          )}
        >
          {status}
        </span>
        <p className="mt-2 text-xs text-dim">扫码关注 · 即将开通</p>
      </div>
    </div>
  )
}
