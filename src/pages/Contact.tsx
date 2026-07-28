import PageHero from '@/components/PageHero'
import { Toaster } from '@/components/ui/sonner'
import ContactForm from '@/components/contact/ContactForm'
import ContactSidebar from '@/components/contact/ContactSidebar'
import OfficeMap from '@/components/contact/OfficeMap'
import Faq from '@/components/contact/Faq'

export default function Contact() {
  return (
    <>
      {/* sonner Toaster（深色主题）— 本页表单提交反馈 */}
      <Toaster theme="dark" position="top-center" />

      {/* Section 1 — PageHero */}
      <PageHero
        breadcrumb={['首页', '联系我们']}
        title="让我们谈谈您的项目"
        lead="无论是项目合作、电站出售、资金合作还是加入泰坦，我们承诺 48 小时内响应。"
        image="/cta-band-bg.jpg"
        coord="RESPONSE WITHIN 48H"
      />

      {/* Section 2 — 合作意向表单 + 信息侧栏 */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <ContactSidebar />
          </div>
        </div>
      </section>

      {/* Section 3 — 总部与区域布局 */}
      <OfficeMap />

      {/* Section 4 — FAQ */}
      <Faq />

      {/* Section 5 — Footer 由共享 Layout 提供；本页不重复 CTA Band */}
    </>
  )
}
