import { Link } from 'react-router'
import QRConnectCard from './QRConnectCard'

const NAV = [
  { to: '/', label: '首页' },
  { to: '/about', label: '关于我们' },
  { to: '/business', label: '业务领域' },
  { to: '/insights', label: '前沿洞察' },
  { to: '/contact', label: '联系我们' },
]

const BIZ = [
  { to: '/business', label: '新能源投资' },
  { to: '/business', label: '电站并购' },
  { to: '/business', label: '智慧运营' },
  { to: '/ai-tool', label: 'AI 投资评估' },
  { to: '/insights', label: '前沿技术洞察' },
]

export default function Footer() {
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
              <img src="/logo.svg" alt="彭田环保" className="h-9 w-9" />
              <div className="leading-none">
                <p className="font-serif text-lg font-bold text-paper">彭田环保</p>
                <p className="mt-1 font-display text-[10px] font-medium tracking-[0.3em] text-dim">
                  PT MOMENTUM
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-mist">
              专注光伏、风电、储能电站的投资、并购与运营。
            </p>
            <p className="mt-6 font-mono text-xs text-dim">京ICP备00000000号-1</p>
            <p className="mt-1 text-xs text-dim">© 2026 海南彭田环保科技有限公司</p>
          </div>

          {/* nav */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] text-dim">导航 / NAVIGATE</h4>
            <ul className="mt-5 space-y-3">
              {NAV.map((i) => (
                <li key={i.label}>
                  <Link
                    to={i.to}
                    className="group relative text-sm text-mist transition-colors hover:text-paper"
                  >
                    {i.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-solar-400 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* business */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] text-dim">业务 / BUSINESS</h4>
            <ul className="mt-5 space-y-3">
              {BIZ.map((i) => (
                <li key={i.label}>
                  <Link
                    to={i.to}
                    className="group relative text-sm text-mist transition-colors hover:text-paper"
                  >
                    {i.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-solar-400 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* follow */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] text-dim">关注我们 / FOLLOW</h4>
            <div className="mt-5 flex gap-4">
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
            <a
              href="mailto:contact@titan-power.cn"
              className="mt-5 block font-mono text-sm text-mist transition-colors hover:text-paper"
            >
              contact@titan-power.cn
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <div className="flex gap-6 text-xs text-dim">
            <span className="cursor-pointer transition-colors hover:text-mist">法律声明</span>
            <span className="cursor-pointer transition-colors hover:text-mist">隐私政策</span>
            <span className="cursor-pointer transition-colors hover:text-mist">免责声明</span>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-dim">
            POWERING THE DISTRIBUTED FUTURE
          </p>
        </div>
      </div>
    </footer>
  )
}
