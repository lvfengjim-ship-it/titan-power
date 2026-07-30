/**
 * PT Momentum — AI 投资评估工具 · 前端财务测算模块（纯函数，可测试）
 *
 * 口径约定（与 ai-tool.md 一致）：
 * - 金额单位：万元（10k CNY）；能量单位：MWh；容量单位：MW
 * - 年发电量 E_t = 容量 × 利用小时 × (1-衰减率)^(t-1) × PR（风电无 PR 项）
 * - 分布式光伏（自发自用+余电上网）：收入 = E_t × [自用比例 × 自用电价 + (1-自用比例) × 上网电价]
 * - 储能：放电量 = 能量容量 × 等效满充放次数 × (1-容量衰减)^(t-1)
 * - 光伏+储能一体化（简化口径）：
 *   · 光伏收入同纯光伏口径；投资 = PV 投资 + 储能投资，现金流合并计算
 *   · 储能收入 = 储能年放电量 × 峰谷价差；储能年放电量 = 容量 MWh × 年循环次数 × 充放效率
 *   · 储能充电成本 = 储能年充电量（放电量/效率）× 上网电价（机会成本口径，视为用余电充电），从储能收入中扣除
 * - 成本：运维 + 土地租金 + 保险（造价 × 0.25%/年）
 * - 融资：等额本息；所得税 25%，「三免三减半」= 前 3 年免征、第 4–6 年减半
 * - 增值税即征即退 50%（可选开关，风电默认开）：按收入 × 13% × 50% 计入其他收益
 * - IRR：二分迭代（项目全投资 IRR 与资本金 IRR）；LCOE 折现率 = 贷款利率；NPV 折现率 = 8%
 * - 最小规模约束（UI 同步钳制）：光伏 ≥0.5 MW；储能功率 ≥0.5 MW；风电 ≥6 MW
 */

export type ProjectType = 'pv' | 'wind' | 'storage' | 'pvStorage'

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  pv: '光伏',
  wind: '风电',
  storage: '储能',
  pvStorage: '光伏+储能一体化',
}

/** 各类型最小装机规模（MW），滑块与数字输入共用 */
export const MIN_CAPACITY_MW: Record<ProjectType, number> = {
  pv: 0.5,
  wind: 6,
  storage: 0.5,
  pvStorage: 0.5,
}

export interface ProjectParams {
  /** 装机容量 MW */
  capacityMW: number
  /** 储能时长 h（仅储能） */
  storageHours: number
  /** 首年利用小时 h（储能：等效满充放次数） */
  utilizationHours: number
  /** 年衰减率 %（储能：容量衰减） */
  degradation: number
  /** 系统效率 PR %（光伏）/ 充放效率 %（储能），风电不使用 */
  efficiency: number
  /** 上网电价 元/kWh（光伏余电上网/风电；光储亦用作储能充电机会成本） */
  tariff: number
  /** 客户自用电价 元/kWh（分布式光伏/光储，自发自用部分） */
  selfUseTariff: number
  /** 自用比例 %（0–100；上网比例 = 100 − 自用比例） */
  selfUseRatio: number
  /** 电价年增长率 % */
  tariffGrowth: number
  /** 容量租赁收入 元/kW·年（储能） */
  capacityLease: number
  /** 辅助服务/现货套利价差 元/kWh（储能） */
  arbitrageSpread: number
  /** 储能功率 MW（光储一体化） */
  storagePowerMW: number
  /** 储能容量 MWh（光储一体化） */
  storageEnergyMWh: number
  /** 储能年循环次数 次/年（光储一体化） */
  storageCycles: number
  /** 储能充放效率 %（光储一体化） */
  storageEfficiency: number
  /** 储能单位造价 元/Wh（光储一体化） */
  storageUnitCapex: number
  /** 峰谷价差 元/kWh（光储一体化储能收入） */
  peakValleySpread: number
  /** 单位造价 元/W（光伏/风电/光储 PV 部分）或 元/Wh（纯储能） */
  unitCapex: number
  /** 年运维成本 元/W·年（光伏/风电）或 元/Wh·年（储能） */
  omCost: number
  /** 土地/租金 万元/年 */
  landRent: number
  /** 资本金比例 % */
  equityRatio: number
  /** 贷款利率 % */
  loanRate: number
  /** 贷款期限 年 */
  loanTerm: number
  /** 运营期 年 */
  operationYears: number
  /** 残值率 % */
  salvageRate: number
  /** 所得税三免三减半 */
  taxHoliday: boolean
  /** 增值税即征即退 50% */
  vatRefund: boolean
}

export const PRESETS: Record<ProjectType, ProjectParams> = {
  pv: {
    capacityMW: 100,
    storageHours: 2,
    utilizationHours: 1400,
    degradation: 0.5,
    efficiency: 82,
    tariff: 0.35,
    selfUseTariff: 0.75,
    selfUseRatio: 80,
    tariffGrowth: 0,
    capacityLease: 180,
    arbitrageSpread: 0.45,
    storagePowerMW: 2,
    storageEnergyMWh: 4,
    storageCycles: 300,
    storageEfficiency: 88,
    storageUnitCapex: 1.1,
    peakValleySpread: 0.6,
    unitCapex: 3.2,
    omCost: 0.045,
    landRent: 60,
    equityRatio: 30,
    loanRate: 3.6,
    loanTerm: 15,
    operationYears: 25,
    salvageRate: 5,
    taxHoliday: true,
    vatRefund: false,
  },
  wind: {
    capacityMW: 100,
    storageHours: 2,
    utilizationHours: 2400,
    degradation: 0.3,
    efficiency: 82,
    tariff: 0.42,
    selfUseTariff: 0.75,
    selfUseRatio: 80,
    tariffGrowth: 0,
    capacityLease: 180,
    arbitrageSpread: 0.45,
    storagePowerMW: 2,
    storageEnergyMWh: 4,
    storageCycles: 300,
    storageEfficiency: 88,
    storageUnitCapex: 1.1,
    peakValleySpread: 0.6,
    unitCapex: 5.8,
    omCost: 0.08,
    landRent: 40,
    equityRatio: 30,
    loanRate: 3.6,
    loanTerm: 15,
    operationYears: 25,
    salvageRate: 5,
    taxHoliday: true,
    vatRefund: true,
  },
  storage: {
    capacityMW: 100,
    storageHours: 2,
    utilizationHours: 330,
    degradation: 1.5,
    efficiency: 88,
    tariff: 0.35,
    selfUseTariff: 0.75,
    selfUseRatio: 80,
    tariffGrowth: 0,
    capacityLease: 180,
    arbitrageSpread: 0.45,
    storagePowerMW: 2,
    storageEnergyMWh: 4,
    storageCycles: 300,
    storageEfficiency: 88,
    storageUnitCapex: 1.1,
    peakValleySpread: 0.6,
    unitCapex: 1.1,
    omCost: 0.02,
    landRent: 12,
    equityRatio: 30,
    loanRate: 3.6,
    loanTerm: 15,
    operationYears: 15,
    salvageRate: 5,
    taxHoliday: false,
    vatRefund: false,
  },
  pvStorage: {
    capacityMW: 5,
    storageHours: 2,
    utilizationHours: 1300,
    degradation: 0.5,
    efficiency: 82,
    tariff: 0.35,
    selfUseTariff: 0.75,
    selfUseRatio: 80,
    tariffGrowth: 0,
    capacityLease: 180,
    arbitrageSpread: 0.45,
    storagePowerMW: 2,
    storageEnergyMWh: 4,
    storageCycles: 300,
    storageEfficiency: 88,
    storageUnitCapex: 1.1,
    peakValleySpread: 0.6,
    unitCapex: 3.2,
    omCost: 0.045,
    landRent: 20,
    equityRatio: 30,
    loanRate: 3.6,
    loanTerm: 15,
    operationYears: 20,
    salvageRate: 5,
    taxHoliday: true,
    vatRefund: false,
  },
}

export interface YearRow {
  year: number
  /** 当年发电量/放电量 MWh */
  generation: number
  /** 累计电量 MWh */
  cumulativeGeneration: number
  /** 收入 万元 */
  revenue: number
  /** 经营成本（运维+土地+保险）万元 */
  opex: number
  /** 所得税 万元 */
  tax: number
  /** 还本付息 万元（等额本息） */
  debtService: number
  /** 项目（全投资）净现金流 万元 */
  projectCashFlow: number
  /** 资本金净现金流 万元 */
  equityCashFlow: number
  /** 资本金累计现金流 万元 */
  cumulativeEquityCashFlow: number
  /** 项目累计现金流 万元 */
  cumulativeProjectCashFlow: number
}

export interface SensitivityItem {
  key: string
  label: string
  /** 不利方向变化后的资本金 IRR（%） */
  low: number | null
  /** 有利方向变化后的资本金 IRR（%） */
  high: number | null
}

export interface FinancialMetrics {
  projectType: ProjectType
  /** 总投资 万元 */
  capex: number
  /** 资本金 万元 */
  equity: number
  /** 贷款 万元 */
  loan: number
  /** 资本金 IRR %（可能无解 → null） */
  equityIRR: number | null
  /** 项目全投资 IRR % */
  projectIRR: number | null
  /** LCOE / LCOS 元/kWh */
  lcoe: number
  /** 动态投资回收期（全投资，折现 8%）年 */
  dynamicPayback: number | null
  /** 静态投资回收期（全投资）年 */
  staticPayback: number | null
  /** 项目净现值 NPV（折现 8%）万元 */
  npv: number
  /** 首年发电量 MWh */
  firstYearGeneration: number
  /** 运营期总发电量 MWh */
  totalGeneration: number
  /** 运营期 */
  operationYears: number
  /** 是否储能（LCOE 显示为 LCOS） */
  isStorage: boolean
  years: YearRow[]
  sensitivity: SensitivityItem[]
}

const NPV_DISCOUNT = 0.08
const INSURANCE_RATE = 0.0025
const INCOME_TAX_RATE = 0.25
const VAT_RATE = 0.13
const DEP_YEARS = 20
const SALVAGE_TAX_BASE = 0.05

/** 二分迭代求 IRR；无解返回 null */
export function irrBisection(cashFlows: number[], lo = -0.5, hi = 1.0): number | null {
  const npv = (r: number) => cashFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + r, t), 0)
  let fLo = npv(lo)
  const fHi = npv(hi)
  if (Number.isNaN(fLo) || Number.isNaN(fHi)) return null
  if (fLo === 0) return lo
  if (fLo * fHi > 0) return null
  let a = lo
  let b = hi
  for (let i = 0; i < 200; i++) {
    const mid = (a + b) / 2
    const fMid = npv(mid)
    if (Math.abs(fMid) < 1e-10) return mid
    if (fLo * fMid < 0) {
      b = mid
    } else {
      a = mid
      fLo = fMid
    }
  }
  return (a + b) / 2
}

/** 回收期（年，线性插值）；cumulative[0] 为第 0 年投资 */
function paybackYear(cumulative: number[]): number | null {
  for (let t = 1; t < cumulative.length; t++) {
    if (cumulative[t] >= 0) {
      const prev = cumulative[t - 1]
      const annual = cumulative[t] - prev
      if (annual <= 0) return t
      const frac = Math.min(1, Math.max(0, -prev / annual))
      return t - 1 + frac
    }
  }
  return null
}

/** 等额本息还款计划：每年 { payment, interest }（贷款期后补 0） */
function annuitySchedule(loan: number, ratePct: number, term: number, years: number) {
  const r = ratePct / 100
  const out = Array.from({ length: years }, () => ({ payment: 0, interest: 0 }))
  if (loan <= 0 || term <= 0) return out
  const payment =
    r === 0 ? loan / term : (loan * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1)
  let balance = loan
  for (let t = 0; t < Math.min(term, years); t++) {
    const interest = balance * r
    const principal = payment - interest
    balance = Math.max(0, balance - principal)
    out[t] = { payment, interest }
  }
  return out
}

/** 所得税率（三免三减半：1–3 年 0，4–6 年减半，之后 25%） */
function taxRateForYear(year: number, holiday: boolean): number {
  if (!holiday) return INCOME_TAX_RATE
  if (year <= 3) return 0
  if (year <= 6) return INCOME_TAX_RATE / 2
  return INCOME_TAX_RATE
}

interface CoreResult {
  capex: number
  equity: number
  loan: number
  equityCF: number[]
  projectCF: number[]
  rows: YearRow[]
  totalGeneration: number
  lcoeCostPV: number
  lcoeEnergyPV: number
}

/** 分布式光伏混合电价：自用比例 × 自用电价 + 上网比例 × 上网电价 */
function blendedTariff(p: ProjectParams): number {
  const self = Math.min(100, Math.max(0, p.selfUseRatio)) / 100
  return self * p.selfUseTariff + (1 - self) * p.tariff
}

/** 核心现金流计算（被主测算与敏感性分析共用） */
function computeCashFlows(type: ProjectType, p: ProjectParams): CoreResult {
  const isStorage = type === 'storage'
  const isPvStorage = type === 'pvStorage'
  const years = Math.round(p.operationYears)
  const deg = p.degradation / 100
  const pr = type === 'wind' ? 1 : p.efficiency / 100

  const energyMWh = isStorage ? p.capacityMW * p.storageHours : 0
  // 光储一体化：合并投资 = PV 投资 + 储能投资（元/W × MW 与 元/Wh × MWh 均换算为万元）
  const capex = isStorage
    ? energyMWh * p.unitCapex * 100
    : isPvStorage
      ? p.capacityMW * p.unitCapex * 100 + p.storageEnergyMWh * p.storageUnitCapex * 100
      : p.capacityMW * p.unitCapex * 100
  const equity = (capex * p.equityRatio) / 100
  const loan = capex - equity
  const schedule = annuitySchedule(loan, p.loanRate, Math.round(p.loanTerm), years)
  const discount = p.loanRate / 100

  const insurance = capex * INSURANCE_RATE
  const depreciation =
    (capex * (1 - SALVAGE_TAX_BASE)) / Math.min(DEP_YEARS, Math.max(1, years))
  const salvage = (capex * p.salvageRate) / 100

  const rows: YearRow[] = []
  const projectCF: number[] = [-capex]
  const equityCF: number[] = [-equity]
  let cumEq = -equity
  let cumProj = -capex
  let totalGen = 0
  let lcoeCostPV = capex
  let lcoeEnergyPV = 0

  for (let t = 1; t <= years; t++) {
    const decay = Math.pow(1 - deg, t - 1)
    // E_t = 容量 × 利用小时 × (1-衰减)^(t-1) × PR；风电无 PR 项，储能 PR=充放效率
    const base = isStorage ? energyMWh : p.capacityMW
    const growthT = Math.pow(1 + p.tariffGrowth / 100, t - 1)
    let gen = base * p.utilizationHours * decay * pr

    let revenue: number
    if (isStorage) {
      revenue = gen * p.arbitrageSpread * 0.1 + p.capacityMW * p.capacityLease * 0.1
    } else if (isPvStorage) {
      // 光伏收入：同纯光伏口径（自发自用 + 余电上网）
      const pvRevenue = gen * blendedTariff(p) * growthT * 0.1
      // 储能收入 = 年放电量 × 峰谷价差；年放电量 = 容量 MWh × 年循环次数 × 充放效率
      const effS = p.storageEfficiency / 100
      const discharge = p.storageEnergyMWh * p.storageCycles * effS
      const storageRevenue = discharge * p.peakValleySpread * 0.1
      // 储能充电成本 = 年充电量（放电量/效率）× 上网电价（机会成本口径：视为用余电充电），从储能收入中扣除
      const chargeCost = (effS > 0 ? discharge / effS : 0) * p.tariff * 0.1
      revenue = pvRevenue + storageRevenue - chargeCost
      // 合并电量口径（用于 LCOE 与图表）：光伏发电量 + 储能放电量
      gen = gen + discharge
    } else if (type === 'pv') {
      // 分布式光伏：收入 = 年发电量 × [自用比例 × 自用电价 + (1−自用比例) × 上网电价]
      revenue = gen * blendedTariff(p) * growthT * 0.1
    } else {
      const tariffT = p.tariff * growthT
      revenue = gen * tariffT * 0.1
    }
    totalGen += gen

    const vatIncome = p.vatRefund && !isStorage ? revenue * VAT_RATE * 0.5 : 0
    const opexBase = isStorage
      ? energyMWh * p.omCost * 100
      : isPvStorage
        ? (p.capacityMW + p.storagePowerMW) * p.omCost * 100
        : p.capacityMW * p.omCost * 100
    const opex = opexBase + p.landRent + insurance

    const interest = schedule[t - 1].interest
    const dep = t <= DEP_YEARS ? depreciation : 0
    const taxable = revenue + vatIncome - opex - dep - interest
    const tax = taxable > 0 ? taxable * taxRateForYear(t, p.taxHoliday) : 0

    const debtService = schedule[t - 1].payment
    const residual = t === years ? salvage : 0
    const projCF = revenue + vatIncome - opex - tax + residual
    const eqCF = projCF - debtService

    cumEq += eqCF
    cumProj += projCF
    projectCF.push(projCF)
    equityCF.push(eqCF)

    lcoeCostPV += opex / Math.pow(1 + discount, t)
    lcoeEnergyPV += gen / Math.pow(1 + discount, t)

    rows.push({
      year: t,
      generation: gen,
      cumulativeGeneration: totalGen,
      revenue,
      opex,
      tax,
      debtService,
      projectCashFlow: projCF,
      equityCashFlow: eqCF,
      cumulativeEquityCashFlow: cumEq,
      cumulativeProjectCashFlow: cumProj,
    })
  }

  return { capex, equity, loan, equityCF, projectCF, rows, totalGeneration: totalGen, lcoeCostPV, lcoeEnergyPV }
}

function equityIRR(type: ProjectType, p: ProjectParams): number | null {
  const core = computeCashFlows(type, p)
  const r = irrBisection(core.equityCF)
  return r === null ? null : r * 100
}

/** 主测算入口：由项目类型 + 参数计算全部指标与逐年现金流 */
export function computeMetrics(type: ProjectType, p: ProjectParams): FinancialMetrics {
  const core = computeCashFlows(type, p)
  const { capex, equity, loan, projectCF, equityCF, rows } = core
  const years = Math.round(p.operationYears)

  const eqIRR = irrBisection(equityCF)
  const projIRR = irrBisection(projectCF)
  const npv = projectCF.reduce((acc, cf, t) => acc + cf / Math.pow(1 + NPV_DISCOUNT, t), 0)
  // LCOE：全生命周期成本现值 / 电量现值（万元/MWh × 10 → 元/kWh）
  const lcoe = core.lcoeEnergyPV > 0 ? (core.lcoeCostPV * 10) / core.lcoeEnergyPV : 0

  const cumStatic: number[] = [-capex]
  const cumDynamic: number[] = [-capex]
  for (let t = 1; t <= years; t++) {
    cumStatic.push(cumStatic[t - 1] + projectCF[t])
    cumDynamic.push(cumDynamic[t - 1] + projectCF[t] / Math.pow(1 + NPV_DISCOUNT, t))
  }

  return {
    projectType: type,
    capex,
    equity,
    loan,
    equityIRR: eqIRR === null ? null : eqIRR * 100,
    projectIRR: projIRR === null ? null : projIRR * 100,
    lcoe,
    dynamicPayback: paybackYear(cumDynamic),
    staticPayback: paybackYear(cumStatic),
    npv,
    firstYearGeneration: rows[0]?.generation ?? 0,
    totalGeneration: core.totalGeneration,
    operationYears: years,
    isStorage: type === 'storage',
    years: rows,
    sensitivity: computeSensitivity(type, p),
  }
}

/** 敏感性分析：电价/造价/利用小时 ±10%、利率 ±1pct 对资本金 IRR 的影响（按影响幅度排序） */
export function computeSensitivity(type: ProjectType, p: ProjectParams): SensitivityItem[] {
  const isStorage = type === 'storage'
  const isPvStorage = type === 'pvStorage'
  const priceLabel = isStorage
    ? '套利价差 ±10%'
    : isPvStorage
      ? '电价/峰谷价差 ±10%'
      : type === 'pv'
        ? '电价（自用/上网）±10%'
        : '上网电价 ±10%'
  const raw: (SensitivityItem & { span: number })[] = [
    {
      key: 'price',
      label: priceLabel,
      low: equityIRR(type, {
        ...p,
        arbitrageSpread: isStorage ? p.arbitrageSpread * 0.9 : p.arbitrageSpread,
        tariff: isStorage ? p.tariff : p.tariff * 0.9,
        selfUseTariff: type === 'pv' || isPvStorage ? p.selfUseTariff * 0.9 : p.selfUseTariff,
        peakValleySpread: isPvStorage ? p.peakValleySpread * 0.9 : p.peakValleySpread,
      }),
      high: equityIRR(type, {
        ...p,
        arbitrageSpread: isStorage ? p.arbitrageSpread * 1.1 : p.arbitrageSpread,
        tariff: isStorage ? p.tariff : p.tariff * 1.1,
        selfUseTariff: type === 'pv' || isPvStorage ? p.selfUseTariff * 1.1 : p.selfUseTariff,
        peakValleySpread: isPvStorage ? p.peakValleySpread * 1.1 : p.peakValleySpread,
      }),
      span: 0,
    },
    {
      key: 'capex',
      label: '单位造价 ±10%',
      low: equityIRR(type, {
        ...p,
        unitCapex: p.unitCapex * 1.1,
        storageUnitCapex: isPvStorage ? p.storageUnitCapex * 1.1 : p.storageUnitCapex,
      }),
      high: equityIRR(type, {
        ...p,
        unitCapex: p.unitCapex * 0.9,
        storageUnitCapex: isPvStorage ? p.storageUnitCapex * 0.9 : p.storageUnitCapex,
      }),
      span: 0,
    },
    {
      key: 'hours',
      label: isStorage ? '循环次数 ±10%' : isPvStorage ? '利用小时/循环次数 ±10%' : '利用小时 ±10%',
      low: equityIRR(type, {
        ...p,
        utilizationHours: p.utilizationHours * 0.9,
        storageCycles: isPvStorage ? p.storageCycles * 0.9 : p.storageCycles,
      }),
      high: equityIRR(type, {
        ...p,
        utilizationHours: p.utilizationHours * 1.1,
        storageCycles: isPvStorage ? p.storageCycles * 1.1 : p.storageCycles,
      }),
      span: 0,
    },
    {
      key: 'rate',
      label: '贷款利率 ±1pct',
      low: equityIRR(type, { ...p, loanRate: p.loanRate + 1 }),
      high: equityIRR(type, { ...p, loanRate: Math.max(0, p.loanRate - 1) }),
      span: 0,
    },
  ]
  for (const it of raw) {
    it.span = Math.abs((it.high ?? -999) - (it.low ?? -999))
  }
  return raw
    .sort((a, b) => b.span - a.span)
    .map(({ key, label, low, high }) => ({ key, label, low, high }))
}

/* ---------- 格式化工具 ---------- */

export function fmtPct(v: number | null, digits = 1): string {
  return v === null || Number.isNaN(v) ? '—' : v.toFixed(digits)
}

export function fmtYears(v: number | null): string {
  return v === null ? '—' : v.toFixed(1)
}

/** 万元 → 亿元 / 万元字符串 */
export function fmtMoneyWan(wan: number): string {
  const abs = Math.abs(wan)
  if (abs >= 10000) return `${(wan / 10000).toFixed(2)} 亿元`
  return `${Math.round(wan).toLocaleString('zh-CN')} 万元`
}

/** MWh → 亿/万 kWh */
export function fmtEnergy(mwh: number): string {
  const kwh = mwh * 1000
  if (kwh >= 1e8) return `${(kwh / 1e8).toFixed(2)} 亿 kWh`
  if (kwh >= 1e4) return `${(kwh / 1e4).toFixed(0)} 万 kWh`
  return `${kwh.toFixed(0)} kWh`
}

export function fmtNumber(v: number, digits = 0): string {
  return v.toLocaleString('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}
