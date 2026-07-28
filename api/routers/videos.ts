import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { listVideos, getVideoById } from "../queries/videos";

export const videosRouter = createRouter({
  list: publicQuery
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).optional(),
    }).optional())
    .query(({ input }) => listVideos(input ?? {})),

  detail: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getVideoById(input.id)),
});
