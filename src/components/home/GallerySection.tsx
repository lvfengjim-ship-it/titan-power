import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '@/components/SectionHeading'
import TagBadge from '@/components/TagBadge'
import Reveal from '@/components/Reveal'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  { name: '青海戈壁光伏基地', cap: '300 MW', tone: 'gold' as const, tag: '光伏', img: '/project-qinghai-pv.jpg' },
  { name: '内蒙古草原风电场', cap: '200 MW', tone: 'volt' as const, tag: '风电', img: '/project-innermongolia-wind.jpg' },
  { name: '江苏电网侧储能', cap: '200 MWh', tone: 'storage' as const, tag: '储能', img: '/project-jiangsu-storage.jpg' },
  { name: '浙江工商业分布式', cap: '50 MW', tone: 'gold' as const, tag: '光伏', img: '/project-zhejiang-rooftop.jpg' },
  { name: '广东海上风电', cap: '150 MW', tone: 'volt' as const, tag: '风电', img: '/project-guangdong-offshore.jpg' },
  { name: '甘肃风光储一体化', cap: '400 MW', tone: 'storage' as const, tag: '一体化', img: '/project-gansu-hybrid.jpg' },
]

/** 项目横滚画廊：桌面 GSAP scrub pin，移动端原生横滑 */
export default function GallerySection() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current || !track.current) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const getDist = () => (track.current?.scrollWidth ?? 0) - (root.current?.clientWidth ?? 0)
        gsap.to(track.current, {
          x: () => -getDist(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${getDist()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        gsap.fromTo(
          '.gallery-card',
          { opacity: 0, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            stagger: 0.08,
            duration: 0.6,
            scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="overflow-hidden py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Portfolio"
            title="从戈壁到海岸，绿电正在发生"
            linkTo="/projects"
            linkLabel="全部项目"
          />
        </Reveal>
      </div>
      <div className="mt-12 overflow-x-auto no-scrollbar max-lg:snap-x max-lg:snap-mandatory lg:overflow-visible">
        <div ref={track} className="flex w-max gap-6 px-6 lg:px-10">
          {PROJECTS.map((p) => (
            <article
              key={p.name}
              className="gallery-card group relative h-[600px] w-[85vw] shrink-0 overflow-hidden rounded-2xl border border-line max-lg:snap-center sm:w-[480px]"
            >
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(5,8,15,0.85)]" />
              <div className="absolute inset-x-0 bottom-0 translate-y-1 p-7 transition-transform duration-500 group-hover:translate-y-0">
                <TagBadge tone={p.tone}>{p.tag}</TagBadge>
                <h3 className="mt-3 font-serif text-xl font-bold text-paper">{p.name}</h3>
                <p className="mt-2 font-mono text-sm tracking-[0.08em] text-solar-300">{p.cap}</p>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-solar-400 transition-transform duration-500 group-hover:scale-x-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
