import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

/** AI 工具与报告下方免责声明条 */
export default function Disclaimer({
  text = '本结果由模型自动生成，仅供参考，不构成任何投资建议。',
  className,
}: {
  text?: string
  className?: string
}) {
  return (
    <p className={cn('flex items-start gap-2 text-xs leading-5 text-dim', className)}>
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      {text}
    </p>
  )
}
