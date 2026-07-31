import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { marked } from 'marked'
import { Calendar, ExternalLink, Sparkles, Youtube } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import type { InsightVideo } from './data'
import { formatDate } from './data'
import CategoryBadge from './CategoryBadge'
import { useLang } from '@/i18n'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface Props {
  video: InsightVideo | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Markdown 正文样式（Tailwind arbitrary variants） */
const MD_CLASSES = [
  '[&_h1]:mt-5 [&_h1]:font-sans [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-paper',
  '[&_h2]:mt-5 [&_h2]:font-sans [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-paper',
  '[&_h3]:mt-5 [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2 [&_h3]:font-sans [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-volt-300',
  '[&_h3]:before:inline-block [&_h3]:before:h-3 [&_h3]:before:w-1 [&_h3]:before:rounded-full [&_h3]:before:bg-volt-400',
  '[&_h4]:mt-4 [&_h4]:font-sans [&_h4]:text-sm [&_h4]:font-bold [&_h4]:text-paper',
  '[&_p]:mt-2.5 [&_p]:text-sm [&_p]:leading-7 [&_p]:text-mist',
  '[&_ul]:mt-2.5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:leading-7 [&_ul]:text-mist',
  '[&_ol]:mt-2.5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ol]:text-sm [&_ol]:leading-7 [&_ol]:text-mist',
  '[&_strong]:font-bold [&_strong]:text-paper',
  '[&_a]:text-volt-400 [&_a]:underline',
  '[&_blockquote]:mt-3 [&_blockquote]:border-l-2 [&_blockquote]:border-volt-400/50 [&_blockquote]:pl-3 [&_blockquote]:text-sm [&_blockquote]:text-mist',
].join(' ')

/** 视频详情模态：左播放器 / 右 AI 全文解读 */
export default function VideoDetailDialog({ video, open, onOpenChange }: Props) {
  const { t } = useLang()
  const isFallback = (video?.id ?? 0) < 0
  // 后端条目追加拉取 aiContent 全文；fallback 条目自带全文
  const detailQuery = trpc.videos.detail.useQuery(
    { id: video?.id ?? 0 },
    { enabled: open && !!video && !isFallback, retry: 1 },
  )

  const content = isFallback
    ? video?.aiContent
    : (detailQuery.data?.aiContent ?? video?.aiContent ?? detailQuery.data?.aiSummary ?? video?.aiSummary)

  const html = useMemo(() => {
    if (!content) return ''
    return marked.parse(content, { async: false }) as string
  }, [content])

  const loadingDetail = !isFallback && detailQuery.isLoading && !content

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90dvh] w-[calc(100vw-2rem)] max-w-5xl gap-0 overflow-hidden rounded-2xl border-line bg-ink-900 p-0 shadow-[0_24px_80px_-16px_rgba(0,0,0,0.8)] data-[state=open]:animate-none sm:rounded-2xl"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{video?.aiTitle || video?.title || t('insights.dialog.titleFallback')}</DialogTitle>
        {video && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid max-h-[90dvh] overflow-y-auto lg:grid-cols-12 lg:overflow-hidden"
          >
            {/* 左栏：播放器 */}
            <div className="p-5 lg:col-span-7 lg:overflow-y-auto lg:p-7">
              <div className="aspect-video overflow-hidden rounded-xl border border-line bg-abyss">
                {open && (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                )}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <p className="mt-5 text-sm italic leading-6 text-mist">{video.title}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-dim">
                  <span className="flex items-center gap-1.5">
                    <Youtube className="h-3.5 w-3.5" />
                    {video.channelTitle || t('insights.grid.channelFallback')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(video.publishedAt)}
                  </span>
                  <a
                    href={video.videoUrl || `https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-volt-400 transition-colors hover:text-volt-300"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t('insights.dialog.originalLink')}
                  </a>
                </div>
              </motion.div>
            </div>

            {/* 右栏：AI 深度解读 */}
            <div className="border-t border-line p-5 lg:col-span-5 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:p-7">
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
              >
                <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                  <CategoryBadge category={video.category} />
                </motion.div>
                <motion.h3
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  className="mt-3 font-serif text-xl font-bold leading-snug text-paper"
                >
                  {video.aiTitle || video.title}
                </motion.h3>
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  className="mt-4 flex items-center gap-2 text-xs font-medium text-volt-400"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {t('insights.dialog.aiDeepLabel')}
                </motion.p>

                <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                  {loadingDetail ? (
                    <div className="mt-3 space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-3.5 animate-pulse rounded bg-ink-700"
                          style={{ width: `${88 - i * 12}%` }}
                        />
                      ))}
                    </div>
                  ) : html ? (
                    <div className={MD_CLASSES} dangerouslySetInnerHTML={{ __html: html }} />
                  ) : (
                    <p className="mt-3 text-sm leading-7 text-dim">{t('insights.dialog.noContent')}</p>
                  )}
                </motion.div>

                <motion.p
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  className="mt-6 border-t border-line pt-4 font-mono text-[10px] leading-5 tracking-[0.06em] text-dim"
                >
                  {t('insights.dialog.disclaimer')}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}
