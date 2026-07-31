#!/bin/bash
# titan-power.cn 服务器自动部署（cron 轮询 GitHub，与恒矽架构一致）
# 原理：每 2 分钟检查 GitHub main 分支，有新提交则拉取并重建
#
# 服务器一次性安装（root 执行）：
#   1) 配置 GitHub 拉取凭证（私有仓库需要只读 token）：
#      cd /root/titan-power
#      git remote set-url origin https://<TOKEN>@github.com/lvfengjim-ship-it/titan-power.git
#   2) 安装 cron 任务：
#      (crontab -l 2>/dev/null; echo '*/2 * * * * /root/titan-power/scripts/auto-deploy.sh >> /var/log/titan-deploy.log 2>&1') | crontab -
#
# 日常更新流程：Mac 端 push 到 GitHub main → 服务器 2 分钟内自动完成部署
set -e
cd "$(dirname "$0")/.."

git fetch origin main -q
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
  exit 0
fi

echo "[$(date '+%F %T')] new commits: $LOCAL -> $REMOTE, deploying..."
git reset --hard origin/main -q
docker compose up -d --build
docker compose restart caddy 2>/dev/null || true
echo "[$(date '+%F %T')] deploy done: $(git rev-parse --short HEAD)"
