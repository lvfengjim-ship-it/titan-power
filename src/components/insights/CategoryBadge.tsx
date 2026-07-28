import TagBadge from '@/components/TagBadge'
import { CATEGORY_LABEL, CATEGORY_TONE } from './data'
import { cn } from '@/lib/utils'

interface Props {
  category: string
  className?: string
}

/** 分类徽章：复用 TagBadge 配色，other/未知分类用 paper 色 */
export default function CategoryBadge({ category, className }: Props) {
  const tone = CATEGORY_TONE[category] ?? 'paper'
  const label = CATEGORY_LABEL[category] ?? '综合能源'
  if (tone === 'paper') {
    return (
      <TagBadge tone="volt" className={cn('border-paper/40 bg-paper/10 text-paper', className)}>
        {label}
      </TagBadge>
    )
  }
  return (
    <TagBadge tone={tone} className={className}>
      {label}
    </TagBadge>
  )
}
