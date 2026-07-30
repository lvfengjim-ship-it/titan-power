import { Clock } from 'lucide-react'
import QRConnectCard from '@/components/QRConnectCard'
import Reveal from '@/components/Reveal'

/** 订阅与关注：公众号 / 视频号打通（青金渐变描边大卡） */
export default function SubscribeSection() {
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
                前沿解读，同步抵达你的微信
              </h3>
              <p className="mt-4 text-base leading-7 text-mist">
                彭田环保公众号与视频号即将开通。每日精选的前沿技术解读、AI
                评估工具更新与行业动态，将第一时间推送。
              </p>
              <p className="mt-5 flex items-center gap-2 text-sm font-medium text-volt-300">
                <Clock className="h-4 w-4 animate-pulse" />
                账号申请中 · 敬请期待
              </p>
            </div>

            <div className="relative flex flex-col gap-4 sm:flex-row">
              <div className="transition-transform duration-500 hover:rotate-1 hover:scale-[1.06]">
                <QRConnectCard
                  src="/qr-wechat-official.png"
                  platform="公众号"
                  title="彭田环保·公众号"
                  accent="gold"
                />
              </div>
              <div className="transition-transform duration-500 hover:-rotate-1 hover:scale-[1.06]">
                <QRConnectCard
                  src="/qr-wechat-channel.png"
                  platform="视频号"
                  title="彭田环保·视频号"
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
