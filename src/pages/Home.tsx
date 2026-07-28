import { Link } from 'react-router'
import { TrendingUp, Handshake, Activity } from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'
import PhilosophySection from '@/components/home/PhilosophySection'
import AiToolSection from '@/components/home/AiToolSection'
import InsightsSection from '@/components/home/InsightsSection'
import GallerySection from '@/components/home/GallerySection'
import SectionHeading from '@/components/SectionHeading'
import StatBlock from '@/components/StatBlock'
import TagBadge from '@/components/TagBadge'
import MediaCard from '@/components/MediaCard'
import GlowCard from '@/components/GlowCard'
import QRConnectCard from '@/components/QRConnectCard'
import CTABand from '@/components/CTABand'
import Reveal from '@/components/Reveal'

const BUSINESS_CARDS = [
  {
    img: '/business-pv.jpg',
    tone: 'gold' as const,
    tag: '光伏',
    title: '集中式与分布式光伏投资',
    desc: '戈壁基地、工商业屋顶、整县推进，全场景光伏资产开发与投资。',
    meta: 'PV / 640 MW IN PORTFOLIO',
  },
  {
    img: '/business-wind.jpg',
    tone: 'volt' as const,
    tag: '风电',
    title: '陆上及海上风电布局',
    desc: '聚焦优质风资源区，布局陆上大基地与近海风电项目。',
    meta: 'WIND / 380 MW',
  },
  {
    img: '/business-storage.jpg',
    tone: 'storage' as const,
    tag: '储能',
    title: '独立储能与风光储一体化',
    desc: '电网侧独立储能、共享储能、源网荷储一体化项目投资与容量运营。',
    meta: 'STORAGE / 200 MWh',
  },
]

const MODES = [
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: '投资 Investment',
    desc: '项目直投、联合开发，覆盖从资源评估到并网投运的全流程。',
  },
  {
    icon: <Handshake className="h-5 w-5" />,
    title: '并购 M&A',
    desc: '存量电站收购、股权并购，以专业尽调与定价能力获取优质资产。',
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: '运营 O&M',
    desc: '智慧运维、电力交易、资产管理，持续提升电站全周期收益。',
  },
]

const STATS: { value: number; decimals?: number; suffix: string; label: string; note: string }[] = [
  { value: 45, suffix: '亿元', label: '累计投资规模', note: 'TOTAL INVESTED' },
  { value: 1.2, decimals: 1, suffix: 'GW+', label: '累计管理装机', note: 'CAPACITY UNDER MGMT' },
  { value: 38, suffix: '座', label: '在运电站', note: 'PLANTS IN OPERATION' },
  { value: 18, suffix: '亿 kWh', label: '年绿色发电量', note: 'ANNUAL GENERATION' },
  { value: 12, suffix: '个', label: '覆盖省/自治区', note: 'PROVINCES COVERED' },
  { value: 150, suffix: '万吨', label: '年 CO₂ 减排量', note: 'CO₂ REDUCED / YEAR' },
]

const PARTNERS = ['国家电网', '华能集团', '金风科技', '宁德时代', '隆基绿能', '阳光电源', '国家电投', '三峡能源']

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Section 2 — 业务矩阵 */}
      <section className="mx-auto max-w-[1280px] px-6 py-32 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Our Business"
            title="投资 · 并购 · 运营，贯穿电站全生命周期"
            description="从项目开发投资、存量电站并购到智慧化运营，泰坦能源构建了覆盖新能源资产全生命周期的能力闭环。"
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BUSINESS_CARDS.map((c, i) => (
            <Reveal key={c.tag} delay={i * 120} y={40}>
              <MediaCard
                image={c.img}
                aspect="portrait"
                title={<span className="font-serif text-lg">{c.title}</span>}
                badge={<TagBadge tone={c.tone}>{c.tag}</TagBadge>}
                description={c.desc}
                meta={c.meta}
              />
            </Reveal>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {MODES.map((m, i) => (
            <Reveal key={m.title} delay={i * 120}>
              <GlowCard icon={m.icon} title={m.title} description={m.desc} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Section 3 — 核心数据 */}
      <section className="relative overflow-hidden bg-ink-900 py-24">
        <svg
          className="tp-drift pointer-events-none absolute -right-40 -top-20 h-[480px] w-[720px] opacity-[0.06]"
          viewBox="0 0 720 480"
          fill="none"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M-20 ${80 + i * 64} C 180 ${40 + i * 64}, 300 ${120 + i * 64}, 480 ${80 + i * 64} S 660 ${120 + i * 64}, 760 ${80 + i * 64}`}
              stroke="#9AA8BF"
              strokeWidth="1"
            />
          ))}
        </svg>
        <div className="relative mx-auto flex max-w-[1440px] flex-col gap-16 px-6 lg:flex-row lg:items-center lg:px-10">
          <div className="lg:w-1/3">
            <Reveal>
              <h2 className="font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.2] text-paper">
                用数据说话
              </h2>
              <p className="mt-5 max-w-sm text-base leading-8 text-mist">
                十年深耕，泰坦能源以稳健的投资纪律与精益的运营体系，持续创造穿越周期的回报。
              </p>
              <Link
                to="/projects"
                className="mt-8 inline-block rounded-xl border border-line-strong px-6 py-3 text-sm font-medium text-paper transition-all duration-300 hover:border-solar-400 hover:bg-solar-400/[0.08] hover:text-solar-300"
              >
                查看项目案例
              </Link>
            </Reveal>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 100} y={24}>
                <StatBlock
                  value={s.value}
                  decimals={s.decimals ?? 0}
                  suffix={s.suffix}
                  label={s.label}
                  note={s.note}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — 投资理念 pin 叙事 */}
      <PhilosophySection />

      {/* Section 5 — AI 工具转化区 */}
      <AiToolSection />

      {/* Section 6 — 前沿视频精选 */}
      <InsightsSection />

      {/* Section 7 — 项目横滚画廊 */}
      <GallerySection />

      {/* Section 8 — 合作生态 + 关注我们 */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10">
        <Reveal>
          <p className="flex items-center justify-center gap-3 font-display text-xs font-medium uppercase tracking-[0.28em] text-solar-400">
            <span className="inline-block h-px w-6 bg-solar-400" />
            Ecosystem
            <span className="inline-block h-px w-6 bg-solar-400" />
          </p>
          <h3 className="mt-4 text-center font-serif text-xl font-bold text-paper lg:text-2xl">
            与产业伙伴共建绿色资产生态
          </h3>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative mt-10 overflow-hidden border-y border-line py-8 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="tp-marquee flex w-max items-center gap-10">
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <span key={i} className="flex items-center gap-10">
                  <span className="whitespace-nowrap font-serif text-lg font-semibold text-dim transition-colors hover:text-mist">
                    {p}
                  </span>
                  <span className="text-dim/50">✦</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col items-center gap-10 lg:flex-row lg:justify-center lg:gap-16">
          <Reveal>
            <QRConnectCard
              src="/qr-wechat-official.png"
              platform="公众号"
              title="泰坦能源·公众号"
              accent="gold"
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="max-w-xs text-center lg:text-left">
              <h4 className="font-sans text-lg font-bold text-paper">前沿洞察，同步抵达</h4>
              <p className="mt-3 text-sm leading-7 text-mist">
                公众号与视频号即将开通，前沿技术解读与行业动态将同步推送，敬请期待。
              </p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <QRConnectCard
              src="/qr-wechat-channel.png"
              platform="视频号"
              title="泰坦能源·视频号"
              accent="volt"
            />
          </Reveal>
        </div>
      </section>

      {/* Section 9 — CTA Band */}
      <CTABand />
    </>
  )
}
