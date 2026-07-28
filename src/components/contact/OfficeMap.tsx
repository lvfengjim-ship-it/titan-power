import { memo } from 'react'
import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import Reveal from '@/components/Reveal'
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

const OFFICES = [
  { name: '北京总部', role: '投资决策 · 并购交易 · 数字化平台' },
  { name: '华东办事处（南京，占位）', role: '分布式项目开发 · 运维响应' },
  { name: '西北办事处（兰州，占位）', role: '大基地项目管理 · 政府事务' },
]

/** Section 3 — 总部与区域布局：抽象版图 + 机构行 */
export default function OfficeMap() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10">
      <style>{`@keyframes tp-office-ripple{0%{transform:translate(-50%,-50%) scale(0.4);opacity:0.9}70%{opacity:0.25}100%{transform:translate(-50%,-50%) scale(1.9);opacity:0}}`}</style>
      <Reveal>
        <SectionHeading
          eyebrow="OFFICES"
          title="总部与区域布局"
          description="以北京为投资决策中枢，华东、西北两大区域机构贴近项目一线，形成覆盖全国主要资源区的响应网络。"
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
                alt="中国版图点阵地图"
                className="h-auto w-full select-none opacity-90"
                draggable={false}
              />
              {/* 北京 HQ · 华东（南京）· 西北（兰州） */}
              <MapPinDot x={67.7} y={37.4} tone="gold" label="北京 HQ" delay={0.3} />
              <MapPinDot x={71.2} y={55.9} tone="volt" label="华东 · 南京" delay={0.45} />
              <MapPinDot x={49.3} y={46.4} tone="volt" label="西北 · 兰州" delay={0.6} />
            </motion.div>
            <p className="mt-4 font-mono text-[10px] tracking-[0.15em] text-dim">
              HEADQUARTERS & REGIONAL OFFICES · DOT MAP ILLUSTRATION
            </p>
          </div>
        </Reveal>

        {/* 机构行 5 列 */}
        <div className="flex flex-col justify-center gap-5 lg:col-span-5">
          {OFFICES.map((o, i) => (
            <Reveal key={o.name} delay={150 + i * 100} y={24}>
              <div className="flex items-start gap-4 rounded-2xl border border-line bg-ink-800 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-line-strong">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-ink-850 text-solar-400">
                  <Building2 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-paper">{o.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-dim">{o.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
