import { createRouter, publicQuery } from "./middleware";
import { videosRouter } from "./routers/videos";
import { contactsRouter } from "./routers/contacts";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  videos: videosRouter,
  contacts: contactsRouter,
});

export type AppRouter = typeof appRouter;
