import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { listInsights } from "../queries/insights";

// 国内政策/项目快讯：公开展示内容，与 videos 一样属于官网公开数据（见 router.ts 鉴权约定）
export const insightsRouter = createRouter({
  list: publicQuery
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).optional(),
    }).optional())
    .query(({ input }) => listInsights(input ?? {})),
});
