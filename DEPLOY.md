# Titan Power 网站 — Mac Studio 部署指南

与恒矽传感器（sensor-hx）一致的架构：GitHub 拉取 + Docker Compose 一键部署。

## 首次部署（只做一次）

```bash
# 1. 安装 OrbStack（若已安装 Docker/Desktop 可跳过）
brew install orbstack && open -a OrbStack

# 2. 克隆仓库
git clone https://github.com/lvfengjim-ship-it/titan-power.git
cd titan-power

# 3. 配置密钥（DeepSeek 必填，YouTube 可选）
cp .env.example .env.local   # 或直接按下步创建
cat > .env << EOL
DEEPSEEK_API_KEY=你的_deepseek_key
YOUTUBE_API_KEY=你的_youtube_key   # 可选，不配则视频页显示内置缓存数据
EOL

# 4. 修改 docker-compose.yml 中的数据库密码与 APP_SECRET（可选但建议）

# 5. 构建并启动（数据库迁移会在启动时自动执行）
docker compose up -d --build
```

访问 http://localhost:3000 。绑定 www.titan-power.cn 时，在 DNS 将域名解析到服务器，
前置 Nginx/Caddy 反向代理到 3000 端口即可。

## 日常更新（一条命令）

```bash
cd titan-power && git pull && docker compose up -d --build
```

## 说明

- 首次启动会自动建库建表（drizzle migrate，幂等）。
- `DEEPSEEK_API_KEY`：AI 投资评估报告与视频中文解读所需；未配置时评估页提示服务未配置。
- `YOUTUBE_API_KEY`：每日 08:00 自动抓取海外前沿技术视频（核能/氢能/储能等）；
  未配置时视频页展示前端内置缓存数据。
- 数据持久化在 `mysql-data` volume 中；联系表单留资存入 `contacts` 表。
