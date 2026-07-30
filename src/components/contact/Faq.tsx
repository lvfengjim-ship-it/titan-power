import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import SectionHeading from '@/components/SectionHeading'
import Reveal from '@/components/Reveal'

const FAQS = [
  {
    q: '什么样的项目适合与彭田合作？',
    a: '已备案、在建或在运的光伏、风电、储能项目均可洽谈。开发项目建议规模 20MW 以上；具备合规手续与清晰产权的项目将获得优先评估。',
  },
  {
    q: '电站出售的流程和周期？',
    a: '标准流程为：初步接洽 → AI 预评估 → 尽职调查 → 签约交割，全流程高效推进。资料完备的在运项目可进一步压缩周期。',
  },
  {
    q: '是否接受小体量分布式项目？',
    a: '接受。小体量分布式项目可采用区域内打包合作模式，单项目可与同区域项目组合评估、组合交易，降低单体交易成本。',
  },
  {
    q: '如何获取 AI 评估工具的深度版？',
    a: '公开版 AI 投资评估工具完全免费，覆盖常规财务测算与解读。深度合作客户可接入内部模型与历史项目数据库，如有需要请在合作表单中注明。',
  },
]

/** Section 4 — 合作常见问题 FAQ */
export default function Faq() {
  return (
    <section className="border-t border-line bg-ink-900 py-24">
      <div className="mx-auto max-w-[760px] px-6">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            eyebrowColor="volt"
            title="合作常见问题"
            description="关于项目合作、电站出售与 AI 工具的高频问题。其他疑问欢迎通过表单或邮件直接联系。"
          />
        </Reveal>

        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 80} y={16}>
                <AccordionItem value={`faq-${i}`} className="border-line">
                  <AccordionTrigger className="py-5 text-left text-base font-bold text-paper hover:text-solar-300 hover:no-underline [&[data-state=open]]:text-solar-300">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-[1.9] text-mist">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              </Reveal>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
