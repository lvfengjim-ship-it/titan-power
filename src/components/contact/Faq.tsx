import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import SectionHeading from '@/components/SectionHeading'
import Reveal from '@/components/Reveal'
import { useLang } from '@/i18n'

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'] as const

/** Section 4 — 合作常见问题 FAQ */
export default function Faq() {
  const { t } = useLang()
  return (
    <section className="border-t border-line bg-ink-900 py-24">
      <div className="mx-auto max-w-[760px] px-6">
        <Reveal>
          <SectionHeading
            eyebrow={t('contact.faq.eyebrow')}
            eyebrowColor="volt"
            title={t('contact.faq.title')}
            description={t('contact.faq.desc')}
          />
        </Reveal>

        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_KEYS.map((key, i) => (
              <Reveal key={key} delay={i * 80} y={16}>
                <AccordionItem value={`faq-${i}`} className="border-line">
                  <AccordionTrigger className="py-5 text-left text-base font-bold text-paper hover:text-solar-300 hover:no-underline [&[data-state=open]]:text-solar-300">
                    {t(`contact.faq.items.${key}.q`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-[1.9] text-mist">
                    {t(`contact.faq.items.${key}.a`)}
                  </AccordionContent>
                </AccordionItem>
              </Reveal>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
