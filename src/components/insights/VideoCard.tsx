import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ExternalLink, Play, Sparkles } from 'lucide-react'
import type { InsightVideo } from './data'
import { formatDuration, timeAgo } from './data'
import CategoryBadge from './CategoryBadge'
import { cn } from '@/lib/utils'

interface Props {
  video: InsightVideo
  index: number
  onOpen: (video: InsightVideo) => void
}

/** 视频卡：缩略图 + AI 标题 + 原标题/频道 + AI 速读 + 操作行 */
export default function VideoCard({ video, index, onOpen }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, delay: (index % 12) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-800 transition-colors duration-500 hover:border-volt-400/40 hover:shadow-[0_0_32px_-10px_rgba(44,224,190,0.35)]"
    >
      {/* 缩略图 */}
      <div
        className="relative aspect-video cursor-pointer overflow-hidden"
        onClick={() => onOpen(video)}
      >
        <img
          src={video.thumbnailUrl || '/video-fallback.jpg'}
          alt={video.aiTitle || video.title}
          loading="lazy"
          onError={(e) => {
            const img = e.target as HTMLImageElement
            if (!img.src.endsWith('/video-fallback.jpg')) img.src = '/video-fallback.jpg'
          }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(5,8,15,0.65)]" />
        <div className="absolute left-3 top-3">
          <CategoryBadge category={video.category} className="backdrop-blur-sm" />
        </div>
        <span className="absolute right-3 top-3 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-paper">
          {formatDuration(video.durationSec)}
        </span>
        {/* 播放按钮浮层 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 scale-75 items-center justify-center rounded-full border border-volt-300/50 bg-black/45 opacity-0 backdrop-blur transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <Play className="ml-0.5 h-5 w-5 fill-volt-300 text-volt-300" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* AI 中文标题 */}
        <h3
          className="line-clamp-2 cursor-pointer font-sans text-base font-bold leading-snug text-paper transition-colors hover:text-volt-300"
          onClick={() => onOpen(video)}
        >
          {video.aiTitle || video.title}
        </h3>
        {/* 原标题 + 频道 + 日期 */}
        <p className="mt-2 truncate text-sm italic text-dim" title={video.title}>
          {video.title}
        </p>
        <p className="mt-1 text-xs text-dim">
          {video.channelTitle || 'YouTube 频道'} · {timeAgo(video.publishedAt)}
        </p>

        {/* AI 速读 */}
        {video.aiSummary && (
          <div className="mt-4 rounded-xl bg-ink-850 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-medium text-volt-400">
              <Sparkles className="h-3.5 w-3.5" />
              AI 速读
            </p>
            <p
              className={cn(
                'mt-2 text-sm leading-6 text-mist',
                expanded ? '' : 'line-clamp-2',
              )}
            >
              {video.aiSummary}
            </p>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1.5 flex items-center gap-1 text-xs font-medium text-volt-400 transition-colors hover:text-volt-300"
            >
              {expanded ? '收起' : '展开'}
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition-transform duration-300', expanded && 'rotate-180')}
              />
            </button>
          </div>
        )}

        {/* 操作行 */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <button
            onClick={() => onOpen(video)}
            className="flex items-center gap-2 rounded-xl border border-volt-400/40 bg-volt-400/10 px-4 py-2 text-sm font-medium text-volt-300 transition-all duration-300 hover:bg-volt-400/20 hover:text-volt-300 hover:shadow-[0_0_20px_-6px_rgba(44,224,190,0.5)]"
          >
            <Play className="h-3.5 w-3.5" />
            观看解读
          </button>
          <a
            href={video.videoUrl || `https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-dim transition-colors hover:text-mist"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            原视频
          </a>
        </div>
      </div>
    </motion.article>
  )
}
