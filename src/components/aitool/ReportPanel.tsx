import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { marked } from 'marked'
import { toast } from 'sonner'
import {
  BrainCircuit,
  Loader2,
  AlertTriangle,
  ClipboardCopy,
  Download,
  RefreshCw,
  ArrowDown,
} from 'lucide-react'
import TagBadge from '@/components/TagBadge'
import Disclaimer from '@/components/Disclaimer'
import { cn } from '@/lib/utils'
import { PROJECT_TYPE_LABEL } from './finance'
import type { ProjectType } from './finance'
import type { ReportState } from './useReport'
import './report.css'

const STAGE_TEXTS = ['解析参数', '对标行业基准', '评估风险', '撰写结论']

const TONE: Record<ProjectType, 'gold' | 'volt' | 'storage'> = {
  pv: 'gold',
  wind: 'volt',
  storage: 'storage',
  pvStorage: 'gold',
}

interface Props {
  type: ProjectType
  report: ReportState
  onRetry: () => void
}

export default function ReportPanel({ type, report, onRetry }: Props) {
  const { status, content, rating, error, generatedAt } = report
  const [stage, setStage] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [follow, setFollow] = useState(true)

  // 生成阶段提示轮播（每 2s 换）
  useEffect(() => {
    if (status !== 'streaming') return
    const id = window.setInterval(() => setStage((s) => (s + 1) % STAGE_TEXTS.length), 2000)
    return () => window.clearInterval(id)
  }, [status])

  const html = useMemo(() => {
    if (!content) return ''
    return marked.parse(content, { async: false }) as string
  }, [content])

  // 流式渲染自动贴底；用户上滚时暂停跟随
  useEffect(() => {
    if (!follow || !scrollRef.current) return
    const el = scrollRef.current
    el.scrollTop = el.scrollHeight
  }, [html, follow])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setFollow(el.scrollTop + el.clientHeight >= el.scrollHeight - 60)
  }

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('报告已复制到剪贴板')
    } catch {
      toast.error('复制失败，请手动选择文本')
    }
  }

  const downloadMd = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pt-momentum-ai-report-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Markdown 报告已开始下载')
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
      <AnimatePresence mode="wait">
        {status === 'idle' ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line px-6 py-20 text-center"
          >
            <BrainCircuit className="h-16 w-16 text-volt-400" strokeWidth={1.2} />
            <p className="text-mist">完成上方参数设置后，点击生成您的专属投资解读</p>
            <p className="font-mono text-xs tracking-[0.15em] text-dim">
              DEEPSEEK-CHAT · STREAMING
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl border border-line bg-ink-900"
          >
            {/* 头部 */}
            <div className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-4 lg:px-8">
              <TagBadge tone={TONE[type]}>{PROJECT_TYPE_LABEL[type]}项目</TagBadge>
              {generatedAt && (
                <span className="font-mono text-xs text-dim">
                  {generatedAt.toLocaleString('zh-CN', { hour12: false })}
                </span>
              )}
              {status === 'streaming' && (
                <span className="font-mono text-xs text-volt-400">
                  STREAMING <span className="tp-caret" />
                </span>
              )}
              <div className="ml-auto">
                {status === 'done' && rating && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className="tp-rating-pulse flex h-14 w-14 flex-col items-center justify-center rounded-full bg-gradient-to-br from-solar-300 via-solar-400 to-solar-500 font-display font-bold text-abyss"
                  >
                    <span className="text-[10px] font-medium leading-none tracking-widest">评级</span>
                    <span className="text-xl leading-tight">{rating}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* 生成状态条 */}
            {status === 'streaming' && (
              <div className="flex items-center gap-3 border-b border-line bg-ink-850 px-6 py-3 lg:px-8">
                <Loader2 className="h-4 w-4 animate-spin text-volt-400" />
                <p className="text-sm text-mist">
                  AI 正在分析您的项目…
                  <span className="ml-2 text-volt-300">{STAGE_TEXTS[stage]}</span>
                </p>
              </div>
            )}

            {/* 错误态 */}
            {status === 'error' && (
              <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
                <AlertTriangle className="h-12 w-12 text-danger" strokeWidth={1.4} />
                <p className="text-mist">{error ?? 'AI 服务暂时繁忙，请稍后重试'}</p>
                <p className="text-xs text-dim">财务测算结果不受影响，仍可在上方继续使用。</p>
                <button
                  onClick={onRetry}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl border border-line-strong px-6 py-2.5 text-sm font-medium text-paper transition-all hover:border-volt-400 hover:bg-volt-400/[0.08] hover:text-volt-300"
                >
                  <RefreshCw className="h-4 w-4" />
                  重试生成
                </button>
              </div>
            )}

            {/* 正文 */}
            {status !== 'error' && (
              <div className="relative">
                <div
                  ref={scrollRef}
                  onScroll={onScroll}
                  className="max-h-[72vh] overflow-y-auto px-6 py-8 lg:px-8"
                >
                  <div className="mx-auto max-w-3xl">
                    {html ? (
                      <div
                        className={cn('tp-report', status === 'streaming' && 'tp-caret')}
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    ) : (
                      /* Skeleton：首包到达前 */
                      <div className="space-y-4">
                        <div className="h-7 w-2/5 animate-pulse rounded-lg bg-ink-700" />
                        <div className="h-4 w-full animate-pulse rounded bg-ink-700/70" />
                        <div className="h-4 w-11/12 animate-pulse rounded bg-ink-700/70" />
                        <div className="h-4 w-4/5 animate-pulse rounded bg-ink-700/70" />
                        <div className="h-7 w-1/3 animate-pulse rounded-lg bg-ink-700" />
                        <div className="h-4 w-full animate-pulse rounded bg-ink-700/70" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-ink-700/70" />
                      </div>
                    )}
                  </div>
                </div>
                {!follow && status === 'streaming' && (
                  <button
                    onClick={() => {
                      setFollow(true)
                      const el = scrollRef.current
                      if (el) el.scrollTop = el.scrollHeight
                    }}
                    className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-line bg-ink-800/95 px-4 py-2 text-xs text-mist shadow-lg backdrop-blur transition-colors hover:border-volt-400 hover:text-volt-300"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                    回到底部
                  </button>
                )}
              </div>
            )}

            {/* 底部操作条 */}
            {status !== 'error' && (
              <div className="flex flex-wrap items-center gap-3 border-t border-line px-6 py-4 lg:px-8">
                <button
                  onClick={copyReport}
                  disabled={status !== 'done'}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-xs font-medium text-mist transition-all enabled:hover:border-volt-400 enabled:hover:text-volt-300 disabled:opacity-40"
                >
                  <ClipboardCopy className="h-3.5 w-3.5" />
                  复制报告
                </button>
                <button
                  onClick={downloadMd}
                  disabled={status !== 'done'}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-xs font-medium text-mist transition-all enabled:hover:border-volt-400 enabled:hover:text-volt-300 disabled:opacity-40"
                >
                  <Download className="h-3.5 w-3.5" />
                  下载 Markdown
                </button>
                <button
                  onClick={onRetry}
                  disabled={status === 'streaming'}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-xs font-medium text-mist transition-all enabled:hover:border-solar-400 enabled:hover:text-solar-300 disabled:opacity-40"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', status === 'streaming' && 'animate-spin')} />
                  重新生成
                </button>
                <Disclaimer className="ml-auto max-w-md" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
