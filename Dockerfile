# ── Stage 1: build ─────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmmirror.com && npm ci --no-audit --include=dev
COPY . .
RUN npm run build

# ── Stage 2: runtime ───────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
# 全量依赖（drizzle-kit migrate 启动时迁移数据库需要 devDeps）
COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmmirror.com && npm ci --no-audit --include=dev
COPY --from=build /app/dist ./dist
COPY db ./db
COPY drizzle.config.ts tsconfig.server.json ./
COPY api ./api
COPY contracts ./contracts
EXPOSE 3000
# 启动时先应用数据库迁移（幂等），再启动生产服务器
CMD ["sh", "-c", "npm run db:migrate && npm start"]
