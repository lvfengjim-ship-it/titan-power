import PageHero from './PageHero'
import CTABand from './CTABand'

interface Props {
  crumb: string
  title: string
  lead: string
  image?: string
}

/** 子页面占位骨架，由页面代理替换为完整实现 */
export default function StubPage({ crumb, title, lead, image }: Props) {
  return (
    <>
      <PageHero breadcrumb={['首页', crumb]} title={title} lead={lead} image={image} />
      <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10">
        <p className="font-mono text-xs tracking-[0.2em] text-dim">UNDER CONSTRUCTION</p>
        <p className="mt-4 max-w-xl text-base leading-8 text-mist">
          本页面内容正在建设中，敬请期待。您可先体验全站开放的投资评估工具，或浏览首页了解彭田环保的业务版图。
        </p>
      </section>
      <CTABand />
    </>
  )
}
