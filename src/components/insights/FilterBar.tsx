import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { CATEGORIES } from './data'
import type { CategoryKey } from './data'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type SortKey = 'latest' | 'views'

interface Props {
  activeTab: CategoryKey
  onTabChange: (tab: CategoryKey) => void
  keyword: string
  onKeywordChange: (kw: string) => void
  sort: SortKey
  onSortChange: (s: SortKey) => void
  total: number
  isFallback: boolean
}

/** Tab 激活配色（与 TagBadge 同色系） */
const TAB_ACTIVE: Record<string, string> = {
  all: 'border-volt-400/50 bg-volt-400/10 text-volt-300',
  solar: 'border-solar-400/50 bg-solar-400/10 text-solar-300',
  wind: 'border-volt-400/50 bg-volt-400/10 text-volt-300',
  storage: 'border-[#7A8CFF]/50 bg-[#7A8CFF]/10 text-[#7A8CFF]',
  hydrogen: 'border-[#5EECD4]/50 bg-[#5EECD4]/10 text-[#5EECD4]',
  nuclear: 'border-[#F2994A]/50 bg-[#F2994A]/10 text-[#F2994A]',
  other: 'border-paper/50 bg-paper/10 text-paper',
}

const TAB_BAR: Record<string, string> = {
  all: 'bg-volt-400',
  solar: 'bg-solar-400',
  wind: 'bg-volt-400',
  storage: 'bg-[#7A8CFF]',
  hydrogen: 'bg-[#5EECD4]',
  nuclear: 'bg-[#F2994A]',
  other: 'bg-paper',
}

/** 分类筛选 + 搜索工具条（sticky 玻璃拟态） */
export default function FilterBar({
  activeTab,
  onTabChange,
  keyword,
  onKeywordChange,
  sort,
  onSortChange,
  total,
  isFallback,
}: Props) {
  const [input, setInput] = useState(keyword)

  // 外部（术语卡）回填关键词时同步输入框
  useEffect(() => setInput(keyword), [keyword])

  // 300ms 防抖
  useEffect(() => {
    const t = setTimeout(() => {
      if (input !== keyword) onKeywordChange(input)
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  return (
    <div className="sticky top-16 z-30 mx-auto max-w-[1280px] px-6 pt-4 lg:px-10">
      <div className="rounded-2xl border border-line bg-[rgba(10,15,29,0.8)] px-4 py-3 backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* 分类 Tab（横向可滚） */}
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
            {CATEGORIES.map((c) => {
              const active = activeTab === c.key
              return (
                <button
                  key={c.key}
                  onClick={() => onTabChange(c.key)}
                  className={cn(
                    'relative shrink-0 rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors duration-300',
                    active
                      ? TAB_ACTIVE[c.key]
                      : 'border-transparent text-mist hover:bg-ink-700/60 hover:text-paper',
                  )}
                >
                  {c.label}
                  {active && (
                    <motion.span
                      layoutId="insights-tab-bar"
                      className={cn('absolute inset-x-3 -bottom-[12.5px] h-0.5 rounded-full', TAB_BAR[c.key])}
                      transition={{ type: 'spring', stiffness: 380, damping: 32, duration: 0.35 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* 搜索 + 排序 */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex items-center gap-2 rounded-xl border border-line bg-ink-800 px-3 py-2 transition-all duration-300',
                'focus-within:border-volt-400 focus-within:shadow-[0_0_0_3px_rgba(44,224,190,0.15)]',
                'lg:w-[200px] lg:focus-within:w-[280px]',
              )}
            >
              <Search className="h-4 w-4 shrink-0 text-dim" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="搜索关键词，如：核聚变 / electrolyzer…"
                className="w-full bg-transparent text-sm text-paper outline-none placeholder:text-dim"
              />
            </div>
            <Select value={sort} onValueChange={(v) => onSortChange(v as SortKey)}>
              <SelectTrigger className="w-[118px] rounded-xl border-line bg-ink-800 text-sm text-mist focus:ring-volt-400/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-line bg-ink-800 text-paper">
                <SelectItem value="latest">最新优先</SelectItem>
                <SelectItem value="views">最多播放</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 数量提示 */}
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] tracking-[0.12em] text-dim">
            {total} VIDEOS · {isFallback ? 'CACHED FALLBACK' : 'UPDATED 08:00'}
          </p>
        </div>
      </div>
    </div>
  )
}
