import { Link } from 'react-router'
import { MapPin, Mail, Phone, Clock, Sparkles, ArrowRight } from 'lucide-react'
import GlowCard from '@/components/GlowCard'
import QRConnectCard from '@/components/QRConnectCard'
import Reveal from '@/components/Reveal'

const CONTACT_ROWS = [
  { icon: MapPin, label: '地址', value: '北京市朝阳区（占位地址）' },
  { icon: Mail, label: '邮箱', value: 'contact@titan-power.cn' },
  { icon: Phone, label: '电话', value: '010-0000-0000（占位）' },
  { icon: Clock, label: '工作时间', value: '工作日 9:00–18:00' },
]

/** Section 2.2 — 信息侧栏（3 卡纵向堆叠） */
export default function ContactSidebar() {
  return (
    <div className="flex flex-col gap-6">
      {/* 联系方式卡 */}
      <Reveal delay={0} y={24}>
        <GlowCard title="联系方式">
          <ul className="mt-5 space-y-4">
            {CONTACT_ROWS.map((row) => {
              const Icon = row.icon
              return (
                <li key={row.label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-ink-850 text-solar-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs text-dim">{row.label}</span>
                    <span className="mt-0.5 block text-sm text-paper">{row.value}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </GlowCard>
      </Reveal>

      {/* 关注我们卡 */}
      <Reveal delay={120} y={24}>
        <div className="rounded-2xl border border-line bg-ink-800 p-7">
          <h3 className="font-sans text-lg font-bold text-paper">关注我们</h3>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <QRConnectCard
              src="/qr-wechat-official.png"
              platform="公众号"
              status="申请中"
              accent="gold"
              compact
            />
            <QRConnectCard
              src="/qr-wechat-channel.png"
              platform="视频号"
              status="申请中"
              accent="volt"
              compact
            />
          </div>
          <p className="mt-4 text-xs leading-6 text-dim">前沿洞察与行业动态将同步推送。</p>
        </div>
      </Reveal>

      {/* 快速入口卡 */}
      <Reveal delay={240} y={24}>
        <Link
          to="/ai-tool"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-ink-800 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-volt-400/50"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-ink-850 text-volt-400">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-bold text-paper">先自己算一算？</p>
              <p className="mt-0.5 text-sm text-mist">AI 投资评估工具，免费开放</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-volt-400 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </Reveal>
    </div>
  )
}
