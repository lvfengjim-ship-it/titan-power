import { useState } from 'react'
import { Link } from 'react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, TrendingUp, Wrench, UserPlus, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { trpc } from '@/providers/trpc'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Reveal from '@/components/Reveal'
import { cn } from '@/lib/utils'

const INTENTS = [
  { value: 'project', label: '项目合作/出售', desc: '光伏、风电、储能项目开发、并购与出售', icon: Zap },
  { value: 'fund', label: '资金合作', desc: '产业资本、金融机构与联合投资', icon: TrendingUp },
  { value: 'om', label: '运维委托', desc: '电站智慧运维与资产管理服务', icon: Wrench },
  { value: 'join', label: '加入我们', desc: '投资、工程与数字化岗位机会', icon: UserPlus },
] as const

const schema = z.object({
  intent: z.enum(['project', 'fund', 'om', 'join']),
  name: z.string().min(1, '请填写姓名'),
  org: z.string().min(1, '请填写机构/公司名称'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请填写有效的 11 位手机号'),
  email: z.union([z.literal(''), z.string().email('请填写有效的电子邮箱')]),
  projectType: z.string().optional(),
  projectSize: z.string().optional(),
  projectSizeUnit: z.enum(['MW', 'MWh']).optional(),
  message: z.string().max(2000, '留言请勿超过 2000 字').optional(),
})

type FormValues = z.infer<typeof schema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs text-danger">{message}</p>
}

/** Section 2.1 — 合作意向表单（react-hook-form + zod + tRPC） */
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      intent: 'project',
      name: '',
      org: '',
      phone: '',
      email: '',
      projectType: undefined,
      projectSize: '',
      projectSizeUnit: 'MW',
      message: '',
    },
  })

  const intent = watch('intent')

  const mutation = trpc.contacts.submit.useMutation({
    onSuccess: () => {
      toast.success('已收到您的信息，我们将在 48 小时内联系您')
      setSubmitted(true)
    },
    onError: () => {
      toast.error('提交失败，请稍后重试或直接邮件 contact@titan-power.cn')
    },
  })

  const onSubmit = (values: FormValues) => {
    const intentLabel = INTENTS.find((i) => i.value === values.intent)?.label ?? values.intent
    const parts: string[] = []
    if (values.intent === 'project') {
      if (values.projectType) parts.push(`项目类型：${values.projectType}`)
      if (values.projectSize)
        parts.push(`项目规模：${values.projectSize} ${values.projectSizeUnit ?? 'MW'}`)
    }
    if (values.message) parts.push(values.message)
    mutation.mutate({
      name: values.name,
      org: values.org,
      phone: values.phone,
      email: values.email,
      type: intentLabel,
      message: parts.join('\n'),
      source: 'contact',
    })
  }

  return (
    <Reveal>
      <div className="rounded-2xl border border-line bg-ink-900 p-8 lg:p-10">
        <AnimatePresence mode="wait">
          {submitted ? (
            /* 成功态卡 */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
              className="flex min-h-[420px] flex-col items-center justify-center py-10 text-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-volt-400/40 bg-volt-400/10">
                <CheckCircle2 className="h-10 w-10 text-volt-400" />
              </span>
              <h3 className="mt-6 font-serif text-2xl font-bold text-paper">提交成功</h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-mist">
                我们已收到您的信息，将在 48 小时内通过您留下的联系方式与您沟通。
              </p>
              <Link
                to="/ai-tool"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-solar-400 transition-colors hover:text-solar-300"
              >
                还可以：试试 AI 投资评估
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="font-sans text-xl font-bold text-paper">提交项目信息</h3>
              <p className="mt-2 text-sm text-mist">信息仅用于合作评估，我们将严格保密。</p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8" noValidate>
                {/* 意向类型 */}
                <Controller
                  control={control}
                  name="intent"
                  render={({ field }) => (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {INTENTS.map((item) => {
                        const Icon = item.icon
                        const active = field.value === item.value
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => field.onChange(item.value)}
                            className={cn(
                              'flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200',
                              active
                                ? 'border-solar-400 bg-solar-400/[0.08]'
                                : 'border-line bg-ink-850 hover:border-line-strong',
                            )}
                          >
                            <span
                              className={cn(
                                'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200',
                                active
                                  ? 'border-solar-400/50 text-solar-400'
                                  : 'border-line text-dim',
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            <span>
                              <span className="block text-sm font-bold text-paper">
                                {item.label}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-dim">
                                {item.desc}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                />

                {/* 基础字段 */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cf-name" className="text-sm text-mist">
                      姓名 <span className="text-solar-400">*</span>
                    </Label>
                    <Input
                      id="cf-name"
                      placeholder="您的姓名"
                      className="mt-2 border-line bg-ink-850 focus-visible:border-volt-400 focus-visible:ring-[3px] focus-visible:ring-volt-400/15"
                      {...register('name')}
                    />
                    <FieldError message={errors.name?.message} />
                  </div>
                  <div>
                    <Label htmlFor="cf-org" className="text-sm text-mist">
                      机构/公司 <span className="text-solar-400">*</span>
                    </Label>
                    <Input
                      id="cf-org"
                      placeholder="所在机构或公司名称"
                      className="mt-2 border-line bg-ink-850 focus-visible:border-volt-400 focus-visible:ring-[3px] focus-visible:ring-volt-400/15"
                      {...register('org')}
                    />
                    <FieldError message={errors.org?.message} />
                  </div>
                  <div>
                    <Label htmlFor="cf-phone" className="text-sm text-mist">
                      联系电话 <span className="text-solar-400">*</span>
                    </Label>
                    <Input
                      id="cf-phone"
                      inputMode="tel"
                      placeholder="11 位手机号"
                      className="mt-2 border-line bg-ink-850 focus-visible:border-volt-400 focus-visible:ring-[3px] focus-visible:ring-volt-400/15"
                      {...register('phone')}
                    />
                    <FieldError message={errors.phone?.message} />
                  </div>
                  <div>
                    <Label htmlFor="cf-email" className="text-sm text-mist">
                      电子邮箱
                    </Label>
                    <Input
                      id="cf-email"
                      type="email"
                      placeholder="name@company.com"
                      className="mt-2 border-line bg-ink-850 focus-visible:border-volt-400 focus-visible:ring-[3px] focus-visible:ring-volt-400/15"
                      {...register('email')}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>
                </div>

                {/* 条件字段：仅"项目合作"时显示 */}
                <AnimatePresence initial={false}>
                  {intent === 'project' && (
                    <motion.div
                      key="project-fields"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-5 pt-5 sm:grid-cols-2">
                        <div>
                          <Label className="text-sm text-mist">项目类型</Label>
                          <Controller
                            control={control}
                            name="projectType"
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="mt-2 w-full border-line bg-ink-850">
                                  <SelectValue placeholder="选择项目类型" />
                                </SelectTrigger>
                                <SelectContent>
                                  {['光伏', '风电', '储能', '风光储一体化', '其他'].map((t) => (
                                    <SelectItem key={t} value={t}>
                                      {t}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cf-size" className="text-sm text-mist">
                            项目规模
                          </Label>
                          <div className="mt-2 flex gap-2">
                            <Input
                              id="cf-size"
                              inputMode="decimal"
                              placeholder="如 100"
                              className="border-line bg-ink-850 focus-visible:border-volt-400 focus-visible:ring-[3px] focus-visible:ring-volt-400/15"
                              {...register('projectSize')}
                            />
                            <Controller
                              control={control}
                              name="projectSizeUnit"
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-28 shrink-0 border-line bg-ink-850">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="MW">MW</SelectItem>
                                    <SelectItem value="MWh">MWh</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 留言 */}
                <div className="mt-5">
                  <Label htmlFor="cf-message" className="text-sm text-mist">
                    留言
                  </Label>
                  <Textarea
                    id="cf-message"
                    rows={5}
                    placeholder="请简要描述项目阶段、地点、资源情况或您的需求…"
                    className="mt-2 border-line bg-ink-850 focus-visible:border-volt-400 focus-visible:ring-[3px] focus-visible:ring-volt-400/15"
                    {...register('message')}
                  />
                  <FieldError message={errors.message?.message} />
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 text-sm font-bold text-abyss transition-all duration-300 hover:scale-[1.01] hover:glow-gold active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mutation.isPending ? '提交中…' : '提交信息'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
}
