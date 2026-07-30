#!/bin/bash
# Mac 抓取端定时入口（cron 调用）：每天 08:00 抓一次
# crontab 行（crontab -e 添加）：
#   0 8 * * * /bin/bash "$HOME/titan-power-agent/run-fetch.sh" >> "$HOME/titan-power-agent/fetch.log" 2>&1
set -e
cd "$(dirname "$0")"

# 定位 node（兼容 nvm / homebrew / 官方安装包）
if ! command -v node >/dev/null 2>&1; then
  export PATH="$HOME/.nvm/versions/node/$(ls "$HOME/.nvm/versions/node" 2>/dev/null | tail -1)/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
fi

node fetch-videos.mjs
