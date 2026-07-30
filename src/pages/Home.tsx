import { useNavigate } from 'react-router'
import { TrendingUp, Handshake, Activity, Layers, BrainCircuit, Workflow, Users2 } from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'
import PhilosophySection from '@/components/home/PhilosophySection'
import AiToolSection from '@/components/home/AiToolSection'
import InsightsSection from '@/components/home/InsightsSection'
import SectionHeading from '@/components/SectionHeading'
import TagBadge from '@/components/TagBadge'
import MediaCard from '@/components/MediaCard'
import GlowCard from '@/components/GlowCard'
import QRConnectCard from '@/components/QRConnectCard'
import CTABand from '@/components/CTABand'
import Reveal from '@/components/Reveal'

const BUSINESS_CARDS = [
  {
    img: '/project-zhejiang-rooftop.jpg',
    tone: 'gold' as const,
    tag: '光伏',
    title: '分布式光伏投资',
    desc: '聚焦工商业屋顶与园区分布式光伏，深耕就近消纳、长期稳定的清洁能源资产。',
    meta: 'PV / DISTRIBUTED ROOFTOP',
  },
  {
    img: '/business-wind.jpg',
    tone: 'volt' as const,
    tag: '风电',
    title: '分布式风电',
    desc: '聚焦分散式与园区风电项目，以灵活装机匹配负荷场景，释放就地绿色电力价值。',
    meta: 'WIND / DISTRIBUTED',
  },
  {
    img: '/business-storage.jpg',
    tone: 'storage' as const,
    tag: '储能',
    title: '工商业储能、独立储能与风光储一体化',
    desc: '工商业储能、电网侧独立储能、共享储能、源网荷储一体化项目投资与容量运营。',
    meta: 'STORAGE / C&I + GRID-SIDE',
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

const PARTNERS = ['华为太阳能', '晶科能源', '固德威', '南网综能', '中新春兴', '长春英利']

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <HeroSection />

      {/* Section 2 — 业务矩阵 */}
      <section className="mx-auto max-w-[1280px] px-6 py-32 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Our Business"
            title="投资 · 并购 · 运营，贯穿电站全生命周期"
            description="从项目开发投资、存量电站并购到智慧化运营，彭田环保构建了覆盖新能源资产全生命周期的能力闭环。"
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

      {/* Section 3 — 为什么选择彭田环保 */}
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
        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              eyebrow="Why Us"
              title="为什么选择彭田环保"
              description="以产业深度与长期主义为底色，用 AI 与一体化能力，做值得信赖的绿色资产伙伴。"
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Reveal delay={0}>
              <GlowCard
                icon={<Layers className="h-5 w-5" />}
                title="产业深度，长期持有"
                description="以资产全周期视角做决策，陪伴每一座电站穿越完整生命周期，追求穿越周期的稳健回报。"
                className="h-full"
              />
            </Reveal>
            <Reveal delay={100}>
              <GlowCard
                icon={<BrainCircuit className="h-5 w-5 text-volt-400" />}
                title="AI 驱动的投资方法论"
                description="内部估值模型与公开版 AI 评估工具同源，用数据与算法提升投资判断的确定性。"
                linkText="体验 AI 投资评估"
                onClick={() => navigate('/ai-tool')}
                className="h-full"
              />
            </Reveal>
            <Reveal delay={200}>
              <GlowCard
                icon={<Workflow className="h-5 w-5" />}
                title="开发-并购-运营一体化能力"
                description="开发、并购、运营三位一体，从项目孵化到资产交付形成能力闭环，全链条把控资产质量。"
                className="h-full"
              />
            </Reveal>
            <Reveal delay={300}>
              <GlowCard
                icon={<Users2 className="h-5 w-5 text-volt-400" />}
                title="产融结合的伙伴生态"
                description="连接产业伙伴与金融机构，以开放协同的生态网络，与伙伴共享绿色资产的长期收益。"
                className="h-full"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 4 — 投资理念 pin 叙事 */}
      <PhilosophySection />

      {/* Section 5 — AI 工具转化区 */}
      <AiToolSection />

      {/* Section 6 — 前沿视频精选 */}
      <InsightsSection />

      {/* Section 7 — 合作生态 + 关注我们 */}
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
              title="彭田环保·公众号"
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
              title="彭田环保·视频号"
              accent="volt"
            />
          </Reveal>
        </div>
      </section>

      {/* Section 8 — CTA Band */}
      <CTABand />
    </>
  )
}
