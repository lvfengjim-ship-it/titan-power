import { createRouter, publicQuery } from "./middleware";
import { videosRouter } from "./routers/videos";
import { contactsRouter } from "./routers/contacts";

// ===== 接口鉴权约定（2026-09 安全审计结论）=====
// 本站是公开官网：videos/contacts 的数据本来就是公开展示与公开提交的，
// 因此使用 publicQuery 是设计使然，不构成数据泄露（审计 H-1 已评审：不改造）。
// 约定：今后新增任何涉及非公开数据、管理操作、用户信息、内部配置的
// procedure，必须先实现鉴权中间件（isAuthenticated/isAdmin）再挂载，
// 禁止直接挂在 publicQuery 下。滥用防护由 boot.ts 的限流中间件负责。

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  videos: videosRouter,
  contacts: contactsRouter,
});

export type AppRouter = typeof appRouter;
