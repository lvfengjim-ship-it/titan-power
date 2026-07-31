import { Clock } from 'lucide-react'
import QRConnectCard from '@/components/QRConnectCard'
import Reveal from '@/components/Reveal'
import { useLang } from '@/i18n'

/** 订阅与关注：公众号 / 视频号打通（青金渐变描边大卡） */
export default function SubscribeSection() {
  const { t } = useLang()
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10">
      <Reveal y={40}>
        <div className="relative overflow-hidden rounded-2xl bg-ink-800 p-[1px]">
          {/* 青金渐变描边 */}
          <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(242,179,61,0.5),rgba(44,224,190,0.5))]" />
          <div className="relative flex flex-col gap-10 rounded-2xl bg-ink-800 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(242,179,61,0.12),transparent)]" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(44,224,190,0.10),transparent)]" />

            <div className="relative max-w-xl">
              <h3 className="font-serif text-2xl font-bold leading-snug text-paper lg:text-3xl">
                {t('insights.subscribe.title')}
              </h3>
              <p className="mt-4 text-base leading-7 text-mist">
                {t('insights.subscribe.desc')}
              </p>
              <p className="mt-5 flex items-center gap-2 text-sm font-medium text-volt-300">
                <Clock className="h-4 w-4 animate-pulse" />
                {t('insights.subscribe.pending')}
              </p>
            </div>

            <div className="relative flex flex-col gap-4 sm:flex-row">
              <div className="transition-transform duration-500 hover:rotate-1 hover:scale-[1.06]">
                <QRConnectCard
                  src="/qr-wechat-official.png"
                  platform={t('insights.subscribe.qrOfficialPlatform')}
                  title={t('insights.subscribe.qrOfficialTitle')}
                  status={t('insights.subscribe.qrStatus')}
                  accent="gold"
                />
              </div>
              <div className="transition-transform duration-500 hover:-rotate-1 hover:scale-[1.06]">
                <QRConnectCard
                  src="/qr-wechat-channel.png"
                  platform={t('insights.subscribe.qrChannelPlatform')}
                  title={t('insights.subscribe.qrChannelTitle')}
                  status={t('insights.subscribe.qrStatus')}
                  accent="volt"
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
