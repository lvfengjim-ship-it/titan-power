import { Link } from 'react-router'
import QRConnectCard from './QRConnectCard'
import { useLang } from '@/i18n'

const NAV = [
  { to: '/', labelKey: 'common.nav.home' },
  { to: '/about', labelKey: 'common.nav.about' },
  { to: '/business', labelKey: 'common.nav.business' },
  { to: '/insights', labelKey: 'common.nav.insights' },
  { to: '/contact', labelKey: 'common.nav.contact' },
] as const

const BIZ = [
  { to: '/business', labelKey: 'common.footer.biz.invest' },
  { to: '/business', labelKey: 'common.footer.biz.ma' },
  { to: '/business', labelKey: 'common.footer.biz.ops' },
  { to: '/ai-tool', labelKey: 'common.footer.biz.aiTool' },
  { to: '/insights', labelKey: 'common.footer.biz.insights' },
] as const

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="relative border-t border-line bg-ink-900">
      {/* faint grid-line decoration */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 h-40 w-full opacity-[0.05]"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 120 L180 120 220 80 400 80 440 120 700 120 760 40 900 40 940 100 1160 100 1200 60 1440 60"
          stroke="#EDF2F9"
          strokeWidth="1"
        />
        <path
          d="M0 140 L260 140 300 110 560 110 610 140 840 140 900 90 1120 90 1180 130 1440 130"
          stroke="#2CE0BE"
          strokeWidth="1"
        />
      </svg>

      <div className="relative mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* brand */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt={t('common.brand.name')} className="h-6 w-auto" />
              <div className="leading-none">
                <p className="font-serif text-lg font-bold text-paper">{t('common.brand.name')}</p>
                <p className="mt-1 font-display text-[10px] font-medium tracking-[0.3em] text-dim">
                  {t('common.brand.sub')}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-mist">{t('common.footer.desc')}</p>
            <p className="mt-6 font-mono text-xs text-dim">{t('common.footer.icp')}</p>
            <p className="mt-1 text-xs text-dim">{t('common.footer.copyright')}</p>
          </div>

          {/* nav */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] text-dim">
              {t('common.footer.headings.navigate')}
            </h4>
            <ul className="mt-5 space-y-3">
              {NAV.map((i) => (
                <li key={i.labelKey}>
                  <Link
                    to={i.to}
                    className="group relative text-sm text-mist transition-colors hover:text-paper"
                  >
                    {t(i.labelKey)}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-solar-400 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* business */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] text-dim">
              {t('common.footer.headings.business')}
            </h4>
            <ul className="mt-5 space-y-3">
              {BIZ.map((i) => (
                <li key={i.labelKey}>
                  <Link
                    to={i.to}
                    className="group relative text-sm text-mist transition-colors hover:text-paper"
                  >
                    {t(i.labelKey)}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-solar-400 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* follow */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] text-dim">
              {t('common.footer.headings.follow')}
            </h4>
            <div className="mt-5 flex gap-4">
              <QRConnectCard
                src="/qr-wechat-official.png"
                platform={t('common.footer.qr.official')}
                status={t('common.footer.qr.pending')}
                accent="gold"
                compact
              />
              <QRConnectCard
                src="/qr-wechat-channel.png"
                platform={t('common.footer.qr.channel')}
                status={t('common.footer.qr.pending')}
                accent="volt"
                compact
              />
            </div>
            <a
              href="mailto:sales@titan-power.cn"
              className="mt-5 block font-mono text-sm text-mist transition-colors hover:text-paper"
            >
              sales@titan-power.cn
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <div className="flex gap-6 text-xs text-dim">
            <span className="cursor-pointer transition-colors hover:text-mist">
              {t('common.footer.legal.statement')}
            </span>
            <span className="cursor-pointer transition-colors hover:text-mist">
              {t('common.footer.legal.privacy')}
            </span>
            <span className="cursor-pointer transition-colors hover:text-mist">
              {t('common.footer.legal.disclaimer')}
            </span>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-dim">
            {t('common.footer.slogan')}
          </p>
        </div>
      </div>
    </footer>
  )
}
