import { memo } from 'react'
import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import Reveal from '@/components/Reveal'
import { useLang } from '@/i18n'
import { cn } from '@/lib/utils'

/** 地图定位点（无限涟漪隔离在 memo 微组件中） */
const MapPinDot = memo(function MapPinDot({
  x,
  y,
  tone,
  label,
  delay,
}: {
  x: number
  y: number
  tone: 'gold' | 'volt'
  label: string
  delay: number
}) {
  const dot =
    tone === 'gold'
      ? 'bg-solar-400 shadow-[0_0_12px_2px_rgba(242,179,61,0.55)]'
      : 'bg-volt-400 shadow-[0_0_12px_2px_rgba(44,224,190,0.45)]'
  const ring = tone === 'gold' ? 'border-solar-400/50' : 'border-volt-400/50'
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ delay, duration: 0.5, type: 'spring', bounce: 0.45 }}
    >
      {[0, 1].map((r) => (
        <span
          key={r}
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border',
            ring,
          )}
          style={{
            animation: `tp-office-ripple 2.4s cubic-bezier(0.22,1,0.36,1) ${delay + r * 1.2}s infinite`,
          }}
        />
      ))}
      <span className={cn('relative block h-3 w-3 rounded-full', dot)} />
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.1em] text-dim">
        {label}
      </span>
    </motion.div>
  )
})

const OFFICE_KEYS = ['hq', 'east', 'north'] as const

/** Section 3 — 总部与区域布局：抽象版图 + 机构行 */
export default function OfficeMap() {
  const { t } = useLang()
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10">
      <style>{`@keyframes tp-office-ripple{0%{transform:translate(-50%,-50%) scale(0.4);opacity:0.9}70%{opacity:0.25}100%{transform:translate(-50%,-50%) scale(1.9);opacity:0}}`}</style>
      <Reveal>
        <SectionHeading
          eyebrow={t('contact.map.eyebrow')}
          title={t('contact.map.title')}
          description={t('contact.map.desc')}
        />
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* 地图 7 列 */}
        <Reveal className="lg:col-span-7" delay={100}>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-850 p-4 lg:p-8">
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.2 }}
            >
              <img
                src="/map-china.svg"
                alt={t('contact.map.imgAlt')}
                className="h-auto w-full select-none opacity-90"
                draggable={false}
              />
              {/* 海口 HQ · 华东（上海）· 华北（北京） */}
              <MapPinDot x={59.5} y={82.5} tone="gold" label={t('contact.map.pinHq')} delay={0.3} />
              <MapPinDot x={73.5} y={52.5} tone="volt" label={t('contact.map.pinEast')} delay={0.45} />
              <MapPinDot x={67.7} y={37.4} tone="volt" label={t('contact.map.pinNorth')} delay={0.6} />
            </motion.div>
            <p className="mt-4 font-mono text-[10px] tracking-[0.15em] text-dim">
              HEADQUARTERS & REGIONAL OFFICES · DOT MAP ILLUSTRATION
            </p>
          </div>
        </Reveal>

        {/* 机构行 5 列 */}
        <div className="flex flex-col justify-center gap-5 lg:col-span-5">
          {OFFICE_KEYS.map((key, i) => (
            <Reveal key={key} delay={150 + i * 100} y={24}>
              <div className="flex items-start gap-4 rounded-2xl border border-line bg-ink-800 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-line-strong">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-ink-850 text-solar-400">
                  <Building2 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-paper">{t(`contact.map.offices.${key}.name`)}</h3>
                  <p className="mt-1 text-sm leading-6 text-dim">{t(`contact.map.offices.${key}.role`)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
