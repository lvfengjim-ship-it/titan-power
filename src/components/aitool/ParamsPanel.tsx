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
import { useLang } from '@/i18n'
import { MIN_CAPACITY_MW } from './finance'
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

const TYPE_TABS: { key: ProjectType; icon: ReactNode; active: string }[] = [
  { key: 'pv', icon: <Sun className="h-4 w-4" />, active: 'text-solar-300' },
  { key: 'wind', icon: <Wind className="h-4 w-4" />, active: 'text-volt-300' },
  {
    key: 'storage',
    icon: <BatteryCharging className="h-4 w-4" />,
    active: 'text-[#7A8CFF]',
  },
  {
    key: 'pvStorage',
    icon: (
      <span className="flex items-center">
        <Sun className="h-3.5 w-3.5" />
        <BatteryCharging className="h-3.5 w-3.5" />
      </span>
    ),
    active: 'text-solar-300',
  },
]

function TypeTabs({
  value,
  onChange,
}: {
  value: ProjectType
  onChange: (t: ProjectType) => void
}) {
  const { t } = useLang()
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-ink-850 p-1 sm:grid-cols-4">
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
              {t(`aitool.types.tab.${tab.key}`)}
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
  const { t } = useLang()
  const set = <K extends keyof ProjectParams>(key: K, v: ProjectParams[K]) =>
    onParamsChange({ ...params, [key]: v })

  const isWind = type === 'wind'
  const isStorage = type === 'storage'
  const isPv = type === 'pv'
  const isPvStorage = type === 'pvStorage'
  /** 含光伏子模型（纯光伏 / 光储一体化）→ 使用双电价 + 自用比例 */
  const hasPvPart = isPv || isPvStorage
  /** 容量滑块最小规模约束（光伏 0.5 / 风电 6 / 储能 0.5 MW） */
  const capMin = MIN_CAPACITY_MW[type]

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
          {t('aitool.params.step1')}
        </p>
        <TypeTabs value={type} onChange={onTypeChange} />
      </div>

      {/* 步骤 2 — 参数表单 */}
      <div>
        <p className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.15em] text-dim">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-volt-400/40 text-[10px] text-volt-400">2</span>
          {t('aitool.params.step2')}
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
                {t('aitool.params.secCapacity')}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
              <SliderRow
                label={
                  isStorage
                    ? t('aitool.params.capacityPower')
                    : isPvStorage
                      ? t('aitool.params.pvCapacity')
                      : t('aitool.params.capacity')
                }
                value={params.capacityMW}
                min={capMin}
                max={500}
                step={isWind ? 1 : 0.5}
                unit="MW"
                digits={isWind ? 0 : 1}
                onChange={(v) => set('capacityMW', v)}
              />
              {isStorage && (
                <SliderRow
                  label={t('aitool.params.storageHours')}
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
                  {t('aitool.params.energyCapacity')} = {params.capacityMW} MW ×{' '}
                  {params.storageHours} h = {(params.capacityMW * params.storageHours).toFixed(0)}{' '}
                  MWh
                </p>
              )}
              {isPvStorage && (
                <SliderRow
                  label={t('aitool.params.storagePower')}
                  value={params.storagePowerMW}
                  min={0.5}
                  max={100}
                  step={0.5}
                  unit="MW"
                  digits={1}
                  onChange={(v) => set('storagePowerMW', v)}
                />
              )}
              {isPvStorage && (
                <SliderRow
                  label={t('aitool.params.storageEnergy')}
                  value={params.storageEnergyMWh}
                  min={1}
                  max={200}
                  step={0.5}
                  unit="MWh"
                  digits={1}
                  onChange={(v) => set('storageEnergyMWh', v)}
                />
              )}
              {isPvStorage && (
                <p className="font-mono text-[11px] text-dim">
                  {t('aitool.params.pvStorageConfig')
                    .replace('{pv}', String(params.capacityMW))
                    .replace('{p}', String(params.storagePowerMW))
                    .replace('{e}', String(params.storageEnergyMWh))
                    .replace(
                      '{h}',
                      params.storagePowerMW > 0
                        ? (params.storageEnergyMWh / params.storagePowerMW).toFixed(1)
                        : '—',
                    )}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* B. 资源与发电 */}
          <AccordionItem value="b" className="rounded-xl border border-line bg-ink-850/60 px-4">
            <AccordionTrigger className="py-3.5 text-sm font-bold text-paper hover:no-underline [&[data-state=open]>svg]:text-volt-400">
              <span className="flex items-center gap-2.5">
                <Zap className="h-4 w-4 text-volt-400" />
                {t('aitool.params.secResource')}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
              <SliderRow
                label={
                  isStorage
                    ? t('aitool.params.equivCycles')
                    : isPvStorage
                      ? t('aitool.params.pvFirstYearHours')
                      : t('aitool.params.firstYearHours')
                }
                value={params.utilizationHours}
                min={isStorage ? 100 : 800}
                max={isStorage ? 500 : 2600}
                step={isStorage ? 5 : 10}
                unit={isStorage ? t('aitool.units.cyclesPerYear') : 'h'}
                onChange={(v) => set('utilizationHours', v)}
              />
              <SliderRow
                label={
                  isStorage
                    ? t('aitool.params.capacityDegradation')
                    : isPvStorage
                      ? t('aitool.params.pvDegradation')
                      : t('aitool.params.degradation')
                }
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
                  label={isStorage ? t('aitool.params.chargeEfficiency') : t('aitool.params.systemPR')}
                  value={params.efficiency}
                  min={75}
                  max={95}
                  step={0.5}
                  unit="%"
                  digits={1}
                  onChange={(v) => set('efficiency', v)}
                />
              )}
              {isPvStorage && (
                <SliderRow
                  label={t('aitool.params.storageCycles')}
                  value={params.storageCycles}
                  min={100}
                  max={500}
                  step={5}
                  unit={t('aitool.units.cyclesPerYear')}
                  onChange={(v) => set('storageCycles', v)}
                />
              )}
              {isPvStorage && (
                <SliderRow
                  label={t('aitool.params.storageEfficiency')}
                  value={params.storageEfficiency}
                  min={75}
                  max={95}
                  step={0.5}
                  unit="%"
                  digits={1}
                  onChange={(v) => set('storageEfficiency', v)}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          {/* C. 电价与收入 */}
          <AccordionItem value="c" className="rounded-xl border border-line bg-ink-850/60 px-4">
            <AccordionTrigger className="py-3.5 text-sm font-bold text-paper hover:no-underline [&[data-state=open]>svg]:text-volt-400">
              <span className="flex items-center gap-2.5">
                <Coins className="h-4 w-4 text-volt-400" />
                {t('aitool.params.secTariff')}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
              {isWind && (
                <NumberRow
                  label={t('aitool.params.feedInTariff')}
                  value={params.tariff}
                  min={0.15}
                  max={0.65}
                  step={0.005}
                  digits={3}
                  unit={t('aitool.units.yuanKwh')}
                  onChange={(v) => set('tariff', v)}
                />
              )}
              {hasPvPart && (
                <>
                  <NumberRow
                    label={t('aitool.params.selfUseTariff')}
                    value={params.selfUseTariff}
                    min={0.3}
                    max={1.5}
                    step={0.01}
                    digits={2}
                    unit={t('aitool.units.yuanKwh')}
                    onChange={(v) => set('selfUseTariff', v)}
                  />
                  <NumberRow
                    label={t('aitool.params.surplusTariff')}
                    value={params.tariff}
                    min={0.15}
                    max={0.65}
                    step={0.005}
                    digits={3}
                    unit={t('aitool.units.yuanKwh')}
                    onChange={(v) => set('tariff', v)}
                  />
                  <SliderRow
                    label={t('aitool.params.selfUseRatio')}
                    value={params.selfUseRatio}
                    min={0}
                    max={100}
                    step={1}
                    unit="%"
                    onChange={(v) => set('selfUseRatio', v)}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-mist">{t('aitool.params.gridRatio')}</span>
                    <ValueText>
                      {(100 - params.selfUseRatio).toFixed(0)}
                      <span className="ml-1 text-[11px] text-dim">{t('aitool.params.gridRatioNote')}</span>
                    </ValueText>
                  </div>
                </>
              )}
              {!isStorage && (
                <SliderRow
                  label={t('aitool.params.tariffGrowth')}
                  value={params.tariffGrowth}
                  min={-2}
                  max={3}
                  step={0.1}
                  unit="%"
                  digits={1}
                  onChange={(v) => set('tariffGrowth', v)}
                />
              )}
              {isPvStorage && (
                <NumberRow
                  label={t('aitool.params.peakValleySpread')}
                  value={params.peakValleySpread}
                  min={0.1}
                  max={1.5}
                  step={0.01}
                  digits={2}
                  unit={t('aitool.units.yuanKwh')}
                  onChange={(v) => set('peakValleySpread', v)}
                />
              )}
              {isStorage && (
                <>
                  <NumberRow
                    label={t('aitool.params.capacityLease')}
                    value={params.capacityLease}
                    min={0}
                    max={400}
                    step={5}
                    digits={0}
                    unit={t('aitool.units.yuanKwYear')}
                    onChange={(v) => set('capacityLease', v)}
                  />
                  <NumberRow
                    label={t('aitool.params.arbitrageSpread')}
                    value={params.arbitrageSpread}
                    min={0.1}
                    max={1}
                    step={0.01}
                    digits={2}
                    unit={t('aitool.units.yuanKwh')}
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
                {t('aitool.params.secCost')}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
              <NumberRow
                label={isPvStorage ? t('aitool.params.pvUnitCapex') : t('aitool.params.unitCapex')}
                value={params.unitCapex}
                min={isStorage ? 0.5 : 2}
                max={isStorage ? 2.5 : 10}
                step={0.05}
                digits={2}
                unit={isStorage ? t('aitool.units.yuanWh') : t('aitool.units.yuanW')}
                onChange={(v) => set('unitCapex', v)}
              />
              {isPvStorage && (
                <NumberRow
                  label={t('aitool.params.storageUnitCapex')}
                  value={params.storageUnitCapex}
                  min={0.5}
                  max={2.5}
                  step={0.05}
                  digits={2}
                  unit={t('aitool.units.yuanWh')}
                  onChange={(v) => set('storageUnitCapex', v)}
                />
              )}
              <NumberRow
                label={t('aitool.params.omCost')}
                value={params.omCost}
                min={0}
                max={0.2}
                step={0.005}
                digits={3}
                unit={isStorage ? t('aitool.units.yuanWhYear') : t('aitool.units.yuanWYear')}
                onChange={(v) => set('omCost', v)}
              />
              <NumberRow
                label={t('aitool.params.landRent')}
                value={params.landRent}
                min={0}
                max={500}
                step={5}
                digits={0}
                unit={t('aitool.units.wanPerYear')}
                onChange={(v) => set('landRent', v)}
              />
            </AccordionContent>
          </AccordionItem>

          {/* E. 融资与税费 */}
          <AccordionItem value="e" className="rounded-xl border border-line bg-ink-850/60 px-4">
            <AccordionTrigger className="py-3.5 text-sm font-bold text-paper hover:no-underline [&[data-state=open]>svg]:text-volt-400">
              <span className="flex items-center gap-2.5">
                <Landmark className="h-4 w-4 text-volt-400" />
                {t('aitool.params.secFinance')}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-5 pt-1">
              <SliderRow
                label={t('aitool.params.equityRatio')}
                value={params.equityRatio}
                min={20}
                max={100}
                step={5}
                unit="%"
                onChange={(v) => set('equityRatio', v)}
              />
              <SliderRow
                label={t('aitool.params.loanRate')}
                value={params.loanRate}
                min={2.5}
                max={6}
                step={0.05}
                unit="%"
                digits={2}
                onChange={(v) => set('loanRate', v)}
              />
              <SliderRow
                label={t('aitool.params.loanTerm')}
                value={params.loanTerm}
                min={5}
                max={20}
                step={1}
                unit={t('aitool.units.year')}
                onChange={(v) => set('loanTerm', v)}
              />
              <SliderRow
                label={t('aitool.params.operationYears')}
                value={params.operationYears}
                min={15}
                max={30}
                step={1}
                unit={t('aitool.units.year')}
                onChange={(v) => set('operationYears', v)}
              />
              <SliderRow
                label={t('aitool.params.salvageRate')}
                value={params.salvageRate}
                min={0}
                max={10}
                step={0.5}
                unit="%"
                digits={1}
                onChange={(v) => set('salvageRate', v)}
              />
              <SwitchRow
                label={t('aitool.params.taxHoliday')}
                hint={t('aitool.params.taxHolidayHint')}
                checked={params.taxHoliday}
                onChange={(v) => set('taxHoliday', v)}
              />
              {!isStorage && (
                <SwitchRow
                  label={t('aitool.params.vatRefund')}
                  hint={t('aitool.params.vatRefundHint')}
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
          {t('aitool.params.reset')}
        </button>
        <p className="font-mono text-[11px] tracking-[0.08em] text-dim">
          {t('aitool.params.modelNote')}
        </p>
      </div>
    </motion.div>
  )
}
