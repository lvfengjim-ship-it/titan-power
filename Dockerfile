# 预构建运行时镜像：无需 npm install，直接运行编译产物
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY dist ./dist
COPY db ./db
EXPOSE 3000
# 数据库迁移在启动时由 boot.js 自动执行（幂等）
CMD ["node", "dist/boot.js"]
