import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, animate, useMotionValue } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  BarChart,
  Bar,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'
import type { FinancialMetrics } from './finance'
import { fmtEnergy, fmtMoneyWan, fmtNumber, fmtPct, fmtYears } from './finance'

/* ---------- 颜色（design.md 2.4 图表色系） ---------- */
const C_MAIN = '#F2B33D'
const C_SECOND = '#2CE0BE'
const C_THIRD = '#7A8CFF'
const C_NEG = '#F2604C'
const C_GRID = 'rgba(148,163,184,0.08)'
const C_TICK = '#5C6B84'

/* ---------- 数字 tween（参数变动 0.3s 过渡） ---------- */
function TweenNumber({
  value,
  format,
}: {
  value: number | null
  format: (v: number) => string
}) {
  const mv = useMotionValue(value ?? 0)
  const [text, setText] = useState(value === null ? '—' : format(value))
  useEffect(() => {
    if (value === null) {
      setText('—')
      return
    }
    const controls = animate(mv, value, {
      duration: 0.3,
      ease: 'easeOut',
      onUpdate: (v) => setText(format(v)),
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return <span className="tabular-nums">{text}</span>
}

/* ---------- 指标卡 ---------- */
function MetricCard({
  label,
  sub,
  children,
  delay = 0,
}: {
  label: string
  sub: string
  children: ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-line bg-ink-800 p-4 transition-colors duration-300 hover:border-line-strong lg:p-5"
    >
      <p className="font-mono text-[11px] tracking-[0.1em] text-dim">{label}</p>
      <div className="mt-2 font-display text-[clamp(1.6rem,2.4vw,2.5rem)] font-bold leading-none">
        {children}
      </div>
      <p className="mt-2 text-xs text-dim">{sub}</p>
    </motion.div>
  )
}

/* ---------- 深色 Tooltip ---------- */
const tooltipStyle = {
  backgroundColor: '#111A2E',
  border: '1px solid rgba(148,163,184,0.24)',
  borderRadius: '12px',
  fontSize: '12px',
  fontFamily: "'JetBrains Mono', monospace",
  color: '#EDF2F9',
}

const fmtWanAxis = (v: number) =>
  Math.abs(v) >= 10000 ? `${(v / 10000).toFixed(1)}亿` : `${Math.round(v)}万`

/* ---------- Tabs ---------- */
type ChartTab = 'cashflow' | 'degradation' | 'sensitivity'
const CHART_TABS: { key: ChartTab; label: string }[] = [
  { key: 'cashflow', label: '现金流' },
  { key: 'degradation', label: '发电量衰减' },
  { key: 'sensitivity', label: '敏感性分析' },
]

interface Props {
  metrics: FinancialMetrics
  onGenerate: () => void
  generating: boolean
}

export default function ResultsPanel({ metrics, onGenerate, generating }: Props) {
  const [tab, setTab] = useState<ChartTab>('cashflow')
  const m = metrics

  const irrColor =
    m.equityIRR === null
      ? 'text-paper'
      : m.equityIRR >= 10
        ? 'text-gradient-gold'
        : m.equityIRR >= 6
          ? 'text-paper'
          : 'text-danger'

  const cashflowData = m.years.map((y) => ({
    year: `Y${y.year}`,
    net: Math.round(y.equityCashFlow),
    cumulative: Math.round(y.cumulativeEquityCashFlow),
  }))

  const generationData = m.years.map((y) => ({
    year: `Y${y.year}`,
    annual: Math.round(y.generation),
    cumulative: Math.round(y.cumulativeGeneration),
  }))

  const baseIRR = m.equityIRR ?? 0
  const tornadoData = m.sensitivity.map((s) => {
    const lo = Math.min(s.low ?? baseIRR, s.high ?? baseIRR)
    const hi = Math.max(s.low ?? baseIRR, s.high ?? baseIRR)
    return { name: s.label, min: lo, range: Math.max(0.01, hi - lo), lo, hi }
  })

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8">
      {/* 核心指标条 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <MetricCard label="资本金 IRR / EQUITY IRR" sub={m.equityIRR !== null && m.equityIRR >= 10 ? '优于行业基准区间' : '行业基准 8–12%'} delay={0}>
          <span className={irrColor}>
            <TweenNumber value={m.equityIRR} format={(v) => v.toFixed(1)} />
            <span className="ml-1 text-base font-medium">%</span>
          </span>
        </MetricCard>
        <MetricCard
          label={m.isStorage ? 'LCOS 度电成本 / 元每千瓦时' : 'LCOE 度电成本 / 元每千瓦时'}
          sub="全生命周期成本现值 ÷ 电量现值"
          delay={0.08}
        >
          <span className="text-paper">
            <TweenNumber value={m.lcoe} format={(v) => v.toFixed(3)} />
            <span className="ml-1 text-base font-medium text-dim">元/kWh</span>
          </span>
        </MetricCard>
        <MetricCard label="动态投资回收期 / DPP" sub="全投资口径 · 折现率 8%" delay={0.16}>
          <span className="text-paper">
            <TweenNumber value={m.dynamicPayback} format={(v) => v.toFixed(1)} />
            <span className="ml-1 text-base font-medium text-dim">年</span>
          </span>
        </MetricCard>
        <MetricCard label="项目净现值 NPV" sub="全投资口径 · 折现率 8%" delay={0.24}>
          <span className={m.npv >= 0 ? 'text-volt-400' : 'text-danger'}>
            <TweenNumber
              value={m.npv / 10000}
              format={(v) => (Math.abs(v) >= 0.01 ? v.toFixed(2) : '0.00')}
            />
            <span className="ml-1 text-base font-medium text-dim">亿元</span>
          </span>
        </MetricCard>
      </div>

      {/* 副行指标 */}
      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-dim">
        <span>
          项目全投资 IRR{' '}
          <span className="ml-1 font-mono tabular-nums text-mist">{fmtPct(m.projectIRR)}%</span>
        </span>
        <span>
          静态回收期{' '}
          <span className="ml-1 font-mono tabular-nums text-mist">{fmtYears(m.staticPayback)} 年</span>
        </span>
        <span>
          首年{m.isStorage ? '放电量' : '发电量'}{' '}
          <span className="ml-1 font-mono tabular-nums text-mist">{fmtEnergy(m.firstYearGeneration)}</span>
        </span>
        <span>
          运营期总电量{' '}
          <span className="ml-1 font-mono tabular-nums text-mist">{fmtEnergy(m.totalGeneration)}</span>
        </span>
        <span>
          总投资{' '}
          <span className="ml-1 font-mono tabular-nums text-mist">{fmtMoneyWan(m.capex)}</span>
          <span className="ml-2 text-dim">
            （资本金 {fmtMoneyWan(m.equity)}）
          </span>
        </span>
      </div>

      {/* 图表区 */}
      <div>
        <div className="mb-4 flex items-center gap-1 border-b border-line">
          {CHART_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'relative px-4 py-2.5 text-sm font-medium transition-colors',
                tab === t.key ? 'text-paper' : 'text-dim hover:text-mist',
              )}
            >
              {t.label}
              {tab === t.key && (
                <motion.span
                  layoutId="aitool-chart-tab"
                  className="absolute inset-x-2 -bottom-px h-0.5 bg-gradient-to-r from-solar-400 to-volt-400"
                />
              )}
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-[320px] w-full"
        >
          {tab === 'cashflow' && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cashflowData} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                <CartesianGrid stroke={C_GRID} vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: C_TICK, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                  tickLine={false}
                  axisLine={{ stroke: C_GRID }}
                  interval={Math.max(0, Math.floor(cashflowData.length / 10) - 1)}
                />
                <YAxis
                  tickFormatter={fmtWanAxis}
                  tick={{ fill: C_TICK, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                  tickLine={false}
                  axisLine={false}
                  width={64}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number, name: string) => [
                    `${fmtNumber(value)} 万元`,
                    name === 'net' ? '资本金净现金流' : '资本金累计现金流',
                  ]}
                  labelFormatter={(l) => `第 ${String(l).slice(1)} 年`}
                />
                <ReferenceLine y={0} stroke="rgba(148,163,184,0.24)" />
                <Bar dataKey="net" radius={[3, 3, 0, 0]} animationDuration={500}>
                  {cashflowData.map((d, i) => (
                    <Cell key={i} fill={d.net >= 0 ? C_SECOND : C_NEG} fillOpacity={0.85} />
                  ))}
                </Bar>
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke={C_MAIN}
                  strokeWidth={2}
                  fill={C_MAIN}
                  fillOpacity={0.12}
                  animationDuration={500}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {tab === 'degradation' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generationData} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                <CartesianGrid stroke={C_GRID} vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: C_TICK, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                  tickLine={false}
                  axisLine={{ stroke: C_GRID }}
                  interval={Math.max(0, Math.floor(generationData.length / 10) - 1)}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v: number) => fmtEnergy(v).replace(' kWh', '')}
                  tick={{ fill: C_TICK, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                  tickLine={false}
                  axisLine={false}
                  width={72}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(v: number) => fmtEnergy(v).replace(' kWh', '')}
                  tick={{ fill: C_TICK, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                  tickLine={false}
                  axisLine={false}
                  width={72}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number, name: string) => [
                    fmtEnergy(value),
                    name === 'annual' ? '当年电量' : '累计电量',
                  ]}
                  labelFormatter={(l) => `第 ${String(l).slice(1)} 年`}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="annual"
                  stroke={C_SECOND}
                  strokeWidth={2}
                  fill={C_SECOND}
                  fillOpacity={0.15}
                  animationDuration={500}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulative"
                  stroke={C_THIRD}
                  strokeWidth={1.5}
                  dot={false}
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {tab === 'sensitivity' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tornadoData}
                layout="vertical"
                margin={{ top: 8, right: 24, bottom: 0, left: 8 }}
              >
                <CartesianGrid stroke={C_GRID} horizontal={false} />
                <XAxis
                  type="number"
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  tickFormatter={(v: number) => `${v.toFixed(1)}%`}
                  tick={{ fill: C_TICK, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                  tickLine={false}
                  axisLine={{ stroke: C_GRID }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: '#9AA8BF', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(_v: number, _n: string, item: { payload?: { lo: number; hi: number } }) => {
                    const p = item?.payload
                    if (!p) return ['', '资本金 IRR 区间']
                    return [`${p.lo.toFixed(1)}% ~ ${p.hi.toFixed(1)}%`, '资本金 IRR 区间']
                  }}
                />
                <ReferenceLine
                  x={baseIRR}
                  stroke={C_MAIN}
                  strokeDasharray="4 3"
                  label={{
                    value: `基准 ${baseIRR.toFixed(1)}%`,
                    position: 'top',
                    fill: C_MAIN,
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                />
                <Bar dataKey="min" stackId="t" fill="transparent" isAnimationActive={false} />
                <Bar dataKey="range" stackId="t" radius={[3, 3, 3, 3]} animationDuration={500}>
                  {tornadoData.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? C_MAIN : C_SECOND} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
        {tab === 'sensitivity' && (
          <p className="mt-2 text-xs text-dim">
            各因素对资本金 IRR 的影响区间（其余参数保持当前值），按影响幅度排序。
          </p>
        )}
      </div>

      {/* AI 报告触发区 */}
      <div className="mt-auto border-t border-line pt-6">
        <button
          onClick={onGenerate}
          disabled={generating}
          className={cn(
            'flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 text-base font-bold text-abyss transition-all duration-300',
            generating
              ? 'cursor-wait opacity-70'
              : 'hover:scale-[1.01] hover:glow-gold active:scale-[0.98]',
          )}
        >
          <Sparkles className={cn('h-5 w-5', generating && 'animate-pulse')} />
          {generating ? 'DeepSeek 正在生成报告…' : '生成 AI 投资解读报告'}
        </button>
        <p className="mt-3 text-center text-xs text-dim">
          由 DeepSeek 大模型基于您的参数与测算结果生成 · 每 IP 每日限 20 次
        </p>
      </div>
    </div>
  )
}
