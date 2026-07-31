import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLang } from '@/i18n'

interface Props {
  eyebrow: string
  title: ReactNode
  description?: string
  linkTo?: string
  linkLabel?: string
  eyebrowColor?: 'gold' | 'volt'
  className?: string
}

/** 区块标题：Eyebrow + H2 衬线标题 + 可选描述 / 查看全部链接 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  linkTo,
  linkLabel,
  eyebrowColor = 'gold',
  className,
}: Props) {
  const { t } = useLang()
  const labelText = linkLabel ?? t('common.shared.viewAll')
  return (
    <div
      className={cn(
        'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl">
        <p
          className={cn(
            'flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.28em]',
            eyebrowColor === 'gold' ? 'text-solar-400' : 'text-volt-400',
          )}
        >
          <span
            className={cn(
              'inline-block h-px w-6',
              eyebrowColor === 'gold' ? 'bg-solar-400' : 'bg-volt-400',
            )}
          />
          {eyebrow}
        </p>
        <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.2] text-paper">
          {title}
        </h2>
      </div>
      <div className="flex max-w-md flex-col gap-4">
        {description && <p className="text-sm leading-7 text-mist">{description}</p>}
        {linkTo && (
          <Link
            to={linkTo}
            className="group inline-flex items-center gap-2 text-sm font-medium text-solar-400 transition-colors hover:text-solar-300"
          >
            {labelText}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  )
}
