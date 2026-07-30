#!/bin/bash
# titan-power.cn 阿里云一键部署脚本（在服务器项目根目录执行：bash deploy-aliyun.sh）
# 功能：装 Docker（如需）→ 配置大陆镜像加速 → 生成 .env → docker compose 启动
set -e

echo "=== titan-power.cn 部署开始 ==="

# ---------- 1. 安装 Docker ----------
if ! command -v docker >/dev/null 2>&1; then
  echo "[1/5] 安装 Docker..."
  if command -v apt-get >/dev/null 2>&1; then
    # Ubuntu / Debian（走阿里云镜像）
    apt-get update
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg 2>/dev/null || true
    . /etc/os-release
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu ${VERSION_CODENAME:-jammy} stable" > /etc/apt/sources.list.d/docker.list
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin || apt-get install -y docker.io docker-compose-plugin
  elif command -v yum >/dev/null 2>&1; then
    # Alibaba Cloud Linux / CentOS
    yum install -y yum-utils
    yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  else
    echo "无法识别包管理器，请手动安装 Docker 后重跑本脚本"; exit 1
  fi
  systemctl enable --now docker
else
  echo "[1/5] Docker 已安装：$(docker --version)"
fi

# compose 子命令检查
if ! docker compose version >/dev/null 2>&1; then
  echo "缺少 docker compose 插件，尝试安装..."
  if command -v apt-get >/dev/null 2>&1; then apt-get install -y docker-compose-plugin
  elif command -v yum >/dev/null 2>&1; then yum install -y docker-compose-plugin
  fi
fi

# ---------- 2. 大陆镜像加速 ----------
if [ ! -f /etc/docker/daemon.json ]; then
  echo "[2/5] 配置 Docker 镜像加速..."
  mkdir -p /etc/docker
  cat > /etc/docker/daemon.json <<'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1ms.run"
  ]
}
EOF
  systemctl restart docker
else
  echo "[2/5] /etc/docker/daemon.json 已存在，跳过镜像加速配置"
fi

# ---------- 3. 生成 .env ----------
if [ ! -f .env ]; then
  echo "[3/5] 生成 .env..."
  INGEST_TOKEN=$(cat /proc/sys/kernel/random/uuid 2>/dev/null | tr -d '-' || openssl rand -hex 16)
  echo "INGEST_TOKEN=$INGEST_TOKEN" > .env
  echo "DEEPSEEK_API_KEY=" >> .env
  echo ""
  echo ">>> 请编辑 .env 填入 DEEPSEEK_API_KEY（AI 投资评估功能需要）："
  echo ">>>   vi .env    或    sed -i 's/DEEPSEEK_API_KEY=/DEEPSEEK_API_KEY=sk-你的key/' .env"
  echo ""
  echo ">>> 请将下面这个 INGEST_TOKEN 复制到 Mac 抓取端的 .env（两边必须一致）："
  echo ">>>   $INGEST_TOKEN"
  echo ""
  read -p "填好 DEEPSEEK_API_KEY 后按回车继续（直接回车则稍后自己改 .env 再执行 docker compose up -d）..."
else
  echo "[3/5] .env 已存在，跳过生成"
fi

# ---------- 4. 启动 ----------
echo "[4/5] 构建并启动容器..."
docker compose up -d --build

# ---------- 5. 验证 ----------
echo "[5/5] 等待服务就绪..."
sleep 8
docker compose ps
echo ""
echo "健康检查："
curl -s http://127.0.0.1/api/health || curl -s http://127.0.0.1:3000/api/health || echo "（80 端口未响应，可查看 docker compose logs）"
echo ""
echo "=== 部署完成 ==="
echo "访问：https://titan-power.cn （需 DNS 已指向本机、80/443 已在轻量防火墙放行）"
echo "Caddy 首次访问会自动签发 HTTPS 证书（约 30 秒），查看：docker compose logs caddy"
echo "查看应用日志：docker compose logs -f app"
