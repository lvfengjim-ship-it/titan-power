import { ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import Reveal from '@/components/Reveal'
import { GLOSSARY } from './data'
import { useLang } from '@/i18n'

interface Props {
  onFilter: (keyword: string) => void
}

/** 行业普及专栏「术语库」：横向滚动卡带 */
export default function GlossarySection({ onFilter }: Props) {
  const { t } = useLang()
  return (
    <section className="bg-ink-900 py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow={t('insights.glossary.eyebrow')}
            eyebrowColor="volt"
            title={t('insights.glossary.title')}
            description={t('insights.glossary.desc')}
          />
        </Reveal>
      </div>

      <div className="mt-12 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        <div className="mx-auto flex w-max gap-5 px-6 pb-2 lg:px-10">
          {GLOSSARY.map((term, i) => (
            <Reveal key={term.abbr} delay={i * 80} y={0} className="snap-start">
              <div
                className="group relative flex h-[320px] w-[240px] shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-ink-800 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-line-strong"
                style={{ transitionProperty: 'transform, border-color, box-shadow' }}
              >
                {/* 顶部分类色条 */}
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: term.color }}
                />
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-0 blur-[6px] transition-opacity duration-500 group-hover:opacity-80"
                  style={{ backgroundColor: term.color }}
                />

                <p
                  className="font-display text-2xl font-bold leading-tight"
                  style={{ color: term.color }}
                >
                  {term.abbr}
                </p>
                <p className="mt-1.5 text-sm font-medium text-paper">{term.name}</p>
                <p className="mt-4 text-sm leading-6 text-mist">{term.desc}</p>

                <button
                  onClick={() => onFilter(term.keyword)}
                  className="mt-auto flex items-center gap-1.5 pt-4 text-left text-xs font-medium transition-colors"
                  style={{ color: term.color }}
                >
                  {t('insights.glossary.related')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
