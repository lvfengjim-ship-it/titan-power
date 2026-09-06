import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const isProd = process.env.NODE_ENV === "production";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  // 安全审计 M-1/L-1：生产环境收敛错误响应——不返回 Zod 校验细节、
  // 不回显 procedure 路径、不暴露内部错误消息，仅保留错误码与 HTTP 状态。
  errorFormatter({ shape, error }) {
    if (!isProd) return shape;
    const generic =
      error.code === "BAD_REQUEST"
        ? "Invalid request"
        : error.code === "NOT_FOUND"
          ? "Not Found"
          : "Internal server error";
    return {
      ...shape,
      message: generic,
      data: { ...shape.data, path: undefined, stack: undefined },
    };
  },
});

export const createRouter = t.router;
export const publicQuery = t.procedure;
