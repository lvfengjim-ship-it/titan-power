import { Info } from 'lucide-react'
import { useLang } from '@/i18n'
import { cn } from '@/lib/utils'

/** AI 工具与报告下方免责声明条 */
export default function Disclaimer({
  text,
  className,
}: {
  text?: string
  className?: string
}) {
  const { t } = useLang()
  const content = text ?? t('common.shared.disclaimer')
  return (
    <p className={cn('flex items-start gap-2 text-xs leading-5 text-dim', className)}>
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      {content}
    </p>
  )
}
