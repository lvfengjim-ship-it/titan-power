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
import { useLang } from '@/i18n'

const BUSINESS_CARDS = [
  {
    img: '/project-zhejiang-rooftop.jpg',
    tone: 'gold' as const,
    key: 'pv',
    meta: 'PV / DISTRIBUTED ROOFTOP',
  },
  {
    img: '/business-wind.jpg',
    tone: 'volt' as const,
    key: 'wind',
    meta: 'WIND / DISTRIBUTED',
  },
  {
    img: '/business-storage.jpg',
    tone: 'storage' as const,
    key: 'storage',
    meta: 'STORAGE / C&I + GRID-SIDE',
  },
]

const MODES = [
  {
    icon: <TrendingUp className="h-5 w-5" />,
    key: 'invest',
  },
  {
    icon: <Handshake className="h-5 w-5" />,
    key: 'ma',
  },
  {
    icon: <Activity className="h-5 w-5" />,
    key: 'om',
  },
]

const PARTNERS = [
  { zh: '华为太阳能', en: 'Huawei Solar' },
  { zh: '晶科能源', en: 'JinkoSolar' },
  { zh: '固德威', en: 'GoodWe' },
  { zh: '南网综能', en: 'CSG Integrated Energy' },
  { zh: '中新春兴', en: 'Sino-Singapore Chunxing' },
  { zh: '长春英利', en: 'Yingli Changchun' },
]

export default function Home() {
  const { lang, t } = useLang()
  const navigate = useNavigate()

  return (
    <>
      <HeroSection />

      {/* Section 2 — 业务矩阵 */}
      <section className="mx-auto max-w-[1280px] px-6 py-32 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Our Business"
            title={t('home.business.title')}
            description={t('home.business.description')}
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BUSINESS_CARDS.map((c, i) => (
            <Reveal key={c.key} delay={i * 120} y={40}>
              <MediaCard
                image={c.img}
                aspect="portrait"
                title={
                  <span className="font-serif text-lg">{t(`home.business.cards.${c.key}.title`)}</span>
                }
                badge={
                  <TagBadge tone={c.tone}>{t(`home.business.cards.${c.key}.tag`)}</TagBadge>
                }
                description={t(`home.business.cards.${c.key}.desc`)}
                meta={c.meta}
              />
            </Reveal>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {MODES.map((m, i) => (
            <Reveal key={m.key} delay={i * 120}>
              <GlowCard
                icon={m.icon}
                title={t(`home.business.modes.${m.key}.title`)}
                description={t(`home.business.modes.${m.key}.desc`)}
              />
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
              title={t('home.whyUs.title')}
              description={t('home.whyUs.description')}
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Reveal delay={0}>
              <GlowCard
                icon={<Layers className="h-5 w-5" />}
                title={t('home.whyUs.depth.title')}
                description={t('home.whyUs.depth.desc')}
                className="h-full"
              />
            </Reveal>
            <Reveal delay={100}>
              <GlowCard
                icon={<BrainCircuit className="h-5 w-5 text-volt-400" />}
                title={t('home.whyUs.ai.title')}
                description={t('home.whyUs.ai.desc')}
                linkText={t('home.whyUs.ai.link')}
                onClick={() => navigate('/ai-tool')}
                className="h-full"
              />
            </Reveal>
            <Reveal delay={200}>
              <GlowCard
                icon={<Workflow className="h-5 w-5" />}
                title={t('home.whyUs.integration.title')}
                description={t('home.whyUs.integration.desc')}
                className="h-full"
              />
            </Reveal>
            <Reveal delay={300}>
              <GlowCard
                icon={<Users2 className="h-5 w-5 text-volt-400" />}
                title={t('home.whyUs.ecosystem.title')}
                description={t('home.whyUs.ecosystem.desc')}
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
            {t('home.ecosystem.title')}
          </h3>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative mt-10 overflow-hidden border-y border-line py-8 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="tp-marquee flex w-max items-center gap-10">
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <span key={i} className="flex items-center gap-10">
                  <span className="whitespace-nowrap font-serif text-lg font-semibold text-dim transition-colors hover:text-mist">
                    {p[lang]}
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
              platform={t('home.ecosystem.qr.official.platform')}
              title={t('home.ecosystem.qr.official.title')}
              accent="gold"
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="max-w-xs text-center lg:text-left">
              <h4 className="font-sans text-lg font-bold text-paper">
                {t('home.ecosystem.followTitle')}
              </h4>
              <p className="mt-3 text-sm leading-7 text-mist">
                {t('home.ecosystem.followBody')}
              </p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <QRConnectCard
              src="/qr-wechat-channel.png"
              platform={t('home.ecosystem.qr.channel.platform')}
              title={t('home.ecosystem.qr.channel.title')}
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
