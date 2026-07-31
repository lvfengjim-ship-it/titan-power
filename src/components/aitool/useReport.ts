import { useCallback, useRef, useState } from 'react'
import { useLang } from '@/i18n'
import { PROJECT_TYPE_LABEL, sanitizeParamsForReport } from './finance'
import type { FinancialMetrics, ProjectParams, ProjectType } from './finance'

export type ReportStatus = 'idle' | 'streaming' | 'done' | 'error'

export interface ReportState {
  status: ReportStatus
  /** 已拼接的 Markdown 全文 */
  content: string
  /** 从报告末尾解析的评级（A+/A/B/C），无则 null */
  rating: string | null
  error: string | null
  generatedAt: Date | null
  generate: (type: ProjectType, params: ProjectParams, metrics: FinancialMetrics) => void
}

/** 错误码 → 友好提示（按界面语言） */
function friendlyError(status: number, fallback: string, t: (key: string) => string): string {
  if (status === 429) return t('aitool.report.err429')
  if (status === 503) return t('aitool.report.err503')
  if (status === 502) return t('aitool.report.err502')
  return fallback || t('aitool.report.errBusy')
}

/** 从 Markdown 报告解析评级：优先 A+/A/B/C 徽章，其次中文评级映射（兼容英文 "Rating"） */
export function parseRating(md: string): string | null {
  const tail = md.slice(-1500)
  const m = tail.match(/(?:评级|Rating)[】\]：:】]?\s*[`*_]*\**\s*(A\+|A|B|C)(?![a-zA-Z])/i)
  if (m) return m[1].toUpperCase()
  const badge = tail.match(/^\s*#+\s*(?:综合评级|评级|Overall Rating|Rating)[^\n]*?\b(A\+|A|B|C)\b/im)
  if (badge) return badge[1].toUpperCase()
  if (tail.includes('强烈关注')) return 'A+'
  if (tail.includes('可关注')) return 'A'
  if (tail.includes('谨慎')) return 'B'
  if (tail.includes('回避')) return 'C'
  return null
}

/**
 * AI 投资解读报告 — SSE 流式生成（POST /api/ai/report，OpenAI 兼容 SSE）
 * 逐行解析 data: {...}，拼接 choices[0].delta.content，data: [DONE] 结束
 */
export function useAiReport(): ReportState {
  const { lang, t } = useLang()
  const [status, setStatus] = useState<ReportStatus>('idle')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const generate = useCallback(
    (projectType: ProjectType, params: ProjectParams, metrics: FinancialMetrics) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setStatus('streaming')
      setContent('')
      setRating(null)
      setError(null)
      setGeneratedAt(new Date())

      void (async () => {
        try {
          const res = await fetch('/api/ai/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              // 传入后端的中文类型名（光伏 / 风电 / 储能 / 光伏+储能一体化），后端直接写入 prompt
              projectType: PROJECT_TYPE_LABEL[projectType],
              // 按类型裁剪参数，避免无关默认字段（如纯光伏携带储能参数）误导 AI
              params: sanitizeParamsForReport(projectType, params),
              metrics: {
                equityIRR: metrics.equityIRR,
                projectIRR: metrics.projectIRR,
                lcoe: metrics.lcoe,
                dynamicPayback: metrics.dynamicPayback,
                staticPayback: metrics.staticPayback,
                npv: metrics.npv,
                capex: metrics.capex,
                equity: metrics.equity,
                loan: metrics.loan,
                firstYearGeneration: metrics.firstYearGeneration,
                totalGeneration: metrics.totalGeneration,
                operationYears: metrics.operationYears,
                sensitivity: metrics.sensitivity,
              },
              // 界面语言：后端据此生成对应语言的报告
              lang,
            }),
            signal: controller.signal,
          })

          if (!res.ok) {
            let serverMsg = ''
            try {
              const data = (await res.json()) as { error?: string }
              serverMsg = data.error ?? ''
            } catch {
              /* ignore */
            }
            throw new Error(friendlyError(res.status, serverMsg, t))
          }
          if (!res.body) throw new Error(t('aitool.report.errBadResponse'))

          const reader = res.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ''
          let acc = ''

          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const frames = buffer.split('\n\n')
            buffer = frames.pop() ?? ''
            for (const frame of frames) {
              for (const line of frame.split('\n')) {
                const trimmed = line.trim()
                if (!trimmed.startsWith('data:')) continue
                const payload = trimmed.slice(5).trim()
                if (payload === '[DONE]') continue
                try {
                  const json = JSON.parse(payload) as {
                    choices?: { delta?: { content?: string } }[]
                  }
                  const delta = json.choices?.[0]?.delta?.content
                  if (delta) {
                    acc += delta
                    setContent(acc)
                  }
                } catch {
                  /* 非 JSON 帧（如注释心跳），忽略 */
                }
              }
            }
          }

          if (!acc.trim()) throw new Error(t('aitool.report.errEmpty'))
          setContent(acc)
          setRating(parseRating(acc))
          setStatus('done')
        } catch (e) {
          if ((e as Error).name === 'AbortError') return
          setError(e instanceof Error ? e.message : t('aitool.report.errBusy'))
          setStatus('error')
        }
      })()
    },
    [lang, t],
  )

  return { status, content, rating, error, generatedAt, generate }
}
