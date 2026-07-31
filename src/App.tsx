import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'

// 路由级代码分割：非首页按需加载（AiTool 含 recharts、Insights 含视频墙，显著减小首屏包）
const About = lazy(() => import('./pages/About'))
const Business = lazy(() => import('./pages/Business'))
const AiTool = lazy(() => import('./pages/AiTool'))
const Insights = lazy(() => import('./pages/Insights'))
const Contact = lazy(() => import('./pages/Contact'))

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-abyss">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-solar-400" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
        <Route path="business" element={<Suspense fallback={<PageLoader />}><Business /></Suspense>} />
        <Route path="ai-tool" element={<Suspense fallback={<PageLoader />}><AiTool /></Suspense>} />
        <Route path="insights" element={<Suspense fallback={<PageLoader />}><Insights /></Suspense>} />
        <Route path="contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
