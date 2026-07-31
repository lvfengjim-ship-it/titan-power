import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dict as common } from './dict/common'
import { dict as home } from './dict/home'
import { dict as about } from './dict/about'
import { dict as business } from './dict/business'
import { dict as aitool } from './dict/aitool'
import { dict as insights } from './dict/insights'
import { dict as contact } from './dict/contact'

export type Lang = 'zh' | 'en'

const STORAGE_KEY = 'tp-lang'

const messages = {
  zh: {
    common: common.zh,
    home: home.zh,
    about: about.zh,
    business: business.zh,
    aitool: aitool.zh,
    insights: insights.zh,
    contact: contact.zh,
  },
  en: {
    common: common.en,
    home: home.en,
    about: about.en,
    business: business.en,
    aitool: aitool.en,
    insights: insights.en,
    contact: contact.en,
  },
}

function lookup(obj: unknown, parts: string[]): unknown {
  let cur: unknown = obj
  for (const p of parts) {
    if (cur === null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return cur
}

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const LangContext = createContext<LangContextValue | null>(null)

function readInitialLang(): Lang {
  try {
    if (typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === 'en') {
      return 'en'
    }
  } catch {
    // localStorage unavailable (private mode etc.) — fall back to default
  }
  return 'zh'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore write failures
    }
    setLangState(next)
  }, [])

  const t = useCallback(
    (key: string): string => {
      const parts = key.split('.')
      const cur = lookup(messages[lang], parts)
      if (typeof cur === 'string') return cur
      const fallback = lookup(messages.zh, parts)
      if (typeof fallback === 'string') return fallback
      return key
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) {
    throw new Error('useLang must be used within <LanguageProvider>')
  }
  return ctx
}
