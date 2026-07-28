import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Sun,
  Wind,
  BatteryCharging,
  Factory,
  Zap,
  Coins,
  Wallet,
  Landmark,
  RotateCcw,
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import type { ProjectParams, ProjectType } from './finance'

/* ---------- 基础控件 ---------- */

function ValueText({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[13px] tabular-nums text-volt-300">{children}</span>
  )
}

interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  digits?: number
  onChange: (v: number) => void
}

function SliderRow({ label, value, min, max, step, unit, digits = 0, onChange }: SliderRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-mist">{label}</span>
        <ValueText>
          {value.toFixed(digits)}
          {unit && <span className="ml-1 text-[11px] text-dim">{unit}</span>}
        </ValueText>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="[&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-volt-500 [&_[data-slot=slider-range]]:to-volt-400 [&_[data-slot=slider-thumb]]:border-volt-400 [&_[data-slot=slider-thumb]]:bg-ink-900 [&_[data-slot=slider-thumb]]:shadow-[0_0_12px_rgba(44,224,190,0.5)] [&_[data-slot=slider-track]]:bg-ink-700"
      />
    </div>
  )
}

interface NumberRowProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  digits?: number
  onChange: (v: number) => void
}

function NumberRow({ label, value, min, max, step, unit, digits = 2, onChange }: NumberRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-mist">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={Number(value.toFixed(digits))}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = parseFloat(e.target.value)
            if (Number.isNaN(v)) return
            onChange(Math.min(max, Math.max(min, v)))
          }}
          className="w-24 rounded-lg border border-line bg-ink-850 px-2.5 py-1.5 text-right font-mono text-[13px] tabular-nums text-volt-300 outline-none transition-all focus:border-volt-400 focus:shadow-[0_0_0_3px_rgba(44,224,190,0.15)]"
        />
        {unit && <span className="w-16 text-[11px] text-dim">{unit}</span>}
      </div>
    </div>
  )
}

interface SwitchRowProps {
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}

function SwitchRow({ label, hint, checked, onChange }: SwitchRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-mist">
        {label}
        {hint && <span className="ml-2 text-[11px] text-dim">{hint}</span>}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

/* ---------- 项目类型分段控件 ---------- */

const TYPE_TABS: { key: ProjectType; label: string; icon: ReactNode; active: string }[] = [
  { key: 'pv', label: '光伏', icon: <Sun className="h-4 w-4" />, active: 'text-solar-300' },
  { key: 'wind', label: '风电', icon: <Wind className="h-4 w-4" />, active: 'text-volt-300' },
  {
    key: 'storage',
    label: '储能',
    icon: <BatteryCharging className="h-4 w-4" />,
    active: 'text-[#7A8CFF]',
  },
]

function TypeTabs({
  value,
  onChange,
}: {
  value: ProjectType
  onChange: (t: ProjectType) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-ink-850 p-1">
      {TYPE_TABS.map((tab) => {
        const active = value === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              'relative flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors',
              active ? tab.active : 'text-dim hover:text-mist',
            )}
          >
            {active && (
              <motion.span
                layoutId="aitool-type-tab"
                className="absolute inset-0 rounded-lg border border-line-strong bg-ink-700"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ---------- 参数面板 ---------- */

interface Props {
  type: ProjectType
  params: ProjectParams
  onTypeChange: (t: ProjectType) => void
  onParamsChange: (p: ProjectParams) => void
  onReset: () => void
}

export default function ParamsPanel({ type, params, onTypeChange, onParamsChange, onReset }: Props) {
  const set = <K extends keyof ProjectParams>(key: K, v: ProjectParams[K]) =>
    onParamsChange({ ...params, [key]: v })

  const isWind = type === 'wind'
  const isStorage = type === 'storage'

  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6 p-6 lg:p-8"
    >
      {/* 步骤 1 — 项目类型 */}
      <div>
        <p className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.15em] text-dim">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-volt-400/40 text-[10px] text-volt-400">1</span>
          项目类型 / PROJECT TYPE
        </p>
        <TypeTabs value={type} onChange={onTypeChange} />
      </div>

      {/* 步骤 2 — 参数表单 */}
      <div>
        <p className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.15em] text-dim">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-volt-400/40 text-[10px] text-volt-400">2</span>
          参数设置 / PARAMETERS
        </p>

        <Accordion
          type="multiple"
          defaultValue={['a', 'b', 'c', 'd', 'e']}
          className="space-y-2"
        >
          {/* A. 建设规模 */}
          <AccordionItem value="a" className="rounded-xl border border-line bg-ink-850/60 px-4">
            <AccordionTrigger className="py-3.5 text-sm font-bold text-paper hover:no-underline [&[data-state=open]>svg]:text-volt-400">
              <span className="flex items-center gap-2.5">
                <Factory className="h-4 w-4 text-volt-400" />
                建设规模
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
              <SliderRow
                label={isStorage ? '装机功率' : '装机容量'}
                value={params.capacityMW}
                min={1}
                max={500}
                step={1}
                unit="MW"
                onChange={(v) => set('capacityMW', v)}
              />
              {isStorage && (
                <SliderRow
                  label="储能时长"
                  value={params.storageHours}
                  min={1}
                  max={4}
                  step={0.5}
                  unit="h"
                  digits={1}
                  onChange={(v) => set('storageHours', v)}
                />
              )}
              {isStorage && (
                <p className="font-mono text-[11px] text-dim">
                  能量容量 = {params.capacityMW} MW × {params.storageHours} h ={' '}
                  {(params.capacityMW * params.storageHours).toFixed(0)} MWh
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* B. 资源与发电 */}
          <AccordionItem value="b" className="rounded-xl border border-line bg-ink-850/60 px-4">
            <AccordionTrigger className="py-3.5 text-sm font-bold text-paper hover:no-underline [&[data-state=open]>svg]:text-volt-400">
              <span className="flex items-center gap-2.5">
                <Zap className="h-4 w-4 text-volt-400" />
                资源与发电
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
              <SliderRow
                label={isStorage ? '等效满充放次数' : '首年利用小时'}
                value={params.utilizationHours}
                min={isStorage ? 100 : 800}
                max={isStorage ? 500 : 2600}
                step={isStorage ? 5 : 10}
                unit={isStorage ? '次/年' : 'h'}
                onChange={(v) => set('utilizationHours', v)}
              />
              <SliderRow
                label={isStorage ? '容量年衰减率' : '年衰减率'}
                value={params.degradation}
                min={0}
                max={isStorage ? 3 : 1.5}
                step={0.1}
                unit="%"
                digits={1}
                onChange={(v) => set('degradation', v)}
              />
              {!isWind && (
                <SliderRow
                  label={isStorage ? '充放电效率' : '系统效率 PR'}
                  value={params.efficiency}
                  min={75}
                  max={95}
                  step={0.5}
                  unit="%"
                  digits={1}
                  onChange={(v) => set('efficiency', v)}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          {/* C. 电价与收入 */}
          <AccordionItem value="c" className="rounded-xl border border-line bg-ink-850/60 px-4">
            <AccordionTrigger className="py-3.5 text-sm font-bold text-paper hover:no-underline [&[data-state=open]>svg]:text-volt-400">
              <span className="flex items-center gap-2.5">
                <Coins className="h-4 w-4 text-volt-400" />
                电价与收入
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
              {!isStorage && (
                <>
                  <NumberRow
                    label="上网电价"
                    value={params.tariff}
                    min={0.15}
                    max={0.65}
                    step={0.005}
                    digits={3}
                    unit="元/kWh"
                    onChange={(v) => set('tariff', v)}
                  />
                  <SliderRow
                    label="电价年增长率"
                    value={params.tariffGrowth}
                    min={-2}
                    max={3}
                    step={0.1}
                    unit="%"
                    digits={1}
                    onChange={(v) => set('tariffGrowth', v)}
                  />
                </>
              )}
              {isStorage && (
                <>
                  <NumberRow
                    label="容量租赁收入"
                    value={params.capacityLease}
                    min={0}
                    max={400}
                    step={5}
                    digits={0}
                    unit="元/kW·年"
                    onChange={(v) => set('capacityLease', v)}
                  />
                  <NumberRow
                    label="辅助服务/现货套利价差"
                    value={params.arbitrageSpread}
                    min={0.1}
                    max={1}
                    step={0.01}
                    digits={2}
                    unit="元/kWh"
                    onChange={(v) => set('arbitrageSpread', v)}
                  />
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* D. 成本与投资 */}
          <AccordionItem value="d" className="rounded-xl border border-line bg-ink-850/60 px-4">
            <AccordionTrigger className="py-3.5 text-sm font-bold text-paper hover:no-underline [&[data-state=open]>svg]:text-volt-400">
              <span className="flex items-center gap-2.5">
                <Wallet className="h-4 w-4 text-volt-400" />
                成本与投资
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
              <NumberRow
                label="单位造价"
                value={params.unitCapex}
                min={isStorage ? 0.5 : 2}
                max={isStorage ? 2.5 : 10}
                step={0.05}
                digits={2}
                unit={isStorage ? '元/Wh' : '元/W'}
                onChange={(v) => set('unitCapex', v)}
              />
              <NumberRow
                label="年运维成本"
                value={params.omCost}
                min={0}
                max={0.2}
                step={0.005}
                digits={3}
                unit={isStorage ? '元/Wh·年' : '元/W·年'}
                onChange={(v) => set('omCost', v)}
              />
              <NumberRow
                label="土地/租金"
                value={params.landRent}
                min={0}
                max={500}
                step={5}
                digits={0}
                unit="万元/年"
                onChange={(v) => set('landRent', v)}
              />
            </AccordionContent>
          </AccordionItem>

          {/* E. 融资与税费 */}
          <AccordionItem value="e" className="rounded-xl border border-line bg-ink-850/60 px-4">
            <AccordionTrigger className="py-3.5 text-sm font-bold text-paper hover:no-underline [&[data-state=open]>svg]:text-volt-400">
              <span className="flex items-center gap-2.5">
                <Landmark className="h-4 w-4 text-volt-400" />
                融资与税费
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
              <SliderRow
                label="资本金比例"
                value={params.equityRatio}
                min={20}
                max={100}
                step={5}
                unit="%"
                onChange={(v) => set('equityRatio', v)}
              />
              <SliderRow
                label="贷款利率"
                value={params.loanRate}
                min={2.5}
                max={6}
                step={0.05}
                unit="%"
                digits={2}
                onChange={(v) => set('loanRate', v)}
              />
              <SliderRow
                label="贷款期限"
                value={params.loanTerm}
                min={5}
                max={20}
                step={1}
                unit="年"
                onChange={(v) => set('loanTerm', v)}
              />
              <SliderRow
                label="运营期"
                value={params.operationYears}
                min={15}
                max={30}
                step={1}
                unit="年"
                onChange={(v) => set('operationYears', v)}
              />
              <SliderRow
                label="残值率"
                value={params.salvageRate}
                min={0}
                max={10}
                step={0.5}
                unit="%"
                digits={1}
                onChange={(v) => set('salvageRate', v)}
              />
              <SwitchRow
                label="所得税三免三减半"
                hint="前 3 年免征 · 4–6 年减半"
                checked={params.taxHoliday}
                onChange={(v) => set('taxHoliday', v)}
              />
              {!isStorage && (
                <SwitchRow
                  label="增值税即征即退 50%"
                  hint="计入其他收益"
                  checked={params.vatRefund}
                  onChange={(v) => set('vatRefund', v)}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* 底部操作 */}
      <div className="mt-auto flex flex-col gap-3 border-t border-line pt-5">
        <button
          onClick={onReset}
          className="group inline-flex items-center gap-2 self-start text-sm text-mist transition-colors hover:text-solar-300"
        >
          <RotateCcw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" />
          重置为典型参数
        </button>
        <p className="font-mono text-[11px] tracking-[0.08em] text-dim">
          MODEL v1.0 · 测算口径见页面底部说明与免责声明
        </p>
      </div>
    </motion.div>
  )
}
