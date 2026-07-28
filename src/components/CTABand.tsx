import { Link } from 'react-router'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  title?: string
  description?: string
  className?: string
}

/** 行动号召带：金青对角光晕 + 双按钮 */
export default function CTABand({
  title = '让每一个能源决策，都有据可依',
  description = '免费使用 AI 投资评估工具，或与我们的投资团队预约一次项目洽谈。',
  className,
}: Props) {
  return (
    <section className={cn('relative overflow-hidden bg-ink-800', className)}>
      <img src="/cta-band-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-800/60 via-ink-800/80 to-ink-800/95" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(242,179,61,0.14),transparent)]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(44,224,190,0.10),transparent)]" />

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-10 px-6 py-20 lg:flex-row lg:items-center lg:px-10">
        <div className="max-w-xl">
          <h3 className="font-serif text-2xl font-bold leading-snug text-paper lg:text-3xl">
            {title}
          </h3>
          <p className="mt-4 text-base leading-7 text-mist">{description}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/ai-tool"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 px-7 py-3.5 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.02] hover:glow-gold active:scale-[0.97]"
          >
            <Sparkles className="h-4 w-4" />
            免费使用 AI 评估
          </Link>
          <Link
            to="/contact"
            className="rounded-xl border border-line-strong px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:border-solar-400 hover:bg-solar-400/[0.08] hover:text-solar-300"
          >
            预约项目洽谈
          </Link>
        </div>
      </div>
    </section>
  )
}
