import { Link } from 'react-router'
import { MapPin, Mail, Building2, Clock, Sparkles, ArrowRight } from 'lucide-react'
import GlowCard from '@/components/GlowCard'
import QRConnectCard from '@/components/QRConnectCard'
import Reveal from '@/components/Reveal'
import { useLang } from '@/i18n'

const CONTACT_ROW_KEYS = [
  { icon: MapPin, key: 'hq' },
  { icon: Building2, key: 'region' },
  { icon: Mail, key: 'mail' },
  { icon: Clock, key: 'hours' },
] as const

/** Section 2.2 — 信息侧栏（3 卡纵向堆叠） */
export default function ContactSidebar() {
  const { t } = useLang()
  return (
    <div className="flex flex-col gap-6">
      {/* 联系方式卡 */}
      <Reveal delay={0} y={24}>
        <GlowCard title={t('contact.sidebar.cardTitle')}>
          <ul className="mt-5 space-y-4">
            {CONTACT_ROW_KEYS.map((row) => {
              const Icon = row.icon
              return (
                <li key={row.key} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-ink-850 text-solar-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs text-dim">{t(`contact.sidebar.rows.${row.key}.label`)}</span>
                    <span className="mt-0.5 block text-sm text-paper">{t(`contact.sidebar.rows.${row.key}.value`)}</span>
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
          <h3 className="font-sans text-lg font-bold text-paper">{t('contact.sidebar.follow.title')}</h3>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <QRConnectCard
              src="/qr-wechat-official.png"
              platform={t('contact.sidebar.follow.official')}
              status={t('contact.sidebar.follow.status')}
              accent="gold"
              compact
            />
            <QRConnectCard
              src="/qr-wechat-channel.png"
              platform={t('contact.sidebar.follow.channel')}
              status={t('contact.sidebar.follow.status')}
              accent="volt"
              compact
            />
          </div>
          <p className="mt-4 text-xs leading-6 text-dim">{t('contact.sidebar.follow.note')}</p>
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
              <p className="text-base font-bold text-paper">{t('contact.sidebar.quick.title')}</p>
              <p className="mt-0.5 text-sm text-mist">{t('contact.sidebar.quick.desc')}</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-volt-400 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </Reveal>
    </div>
  )
}
