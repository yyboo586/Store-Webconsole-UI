#!/bin/bash

set -e

# 日志函数
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] $1"
}

error() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] $1" >&2
}

# 配置
DEPLOY_DIR="/home/www"
BACKUP_BASE_DIR="${DEPLOY_DIR}/backups"
PROJECT_NAME="webconsole-ui"

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then 
  error "请使用root权限运行此脚本"
  exit 1
fi

log "================================================"
log "开始部署 ${PROJECT_NAME} 前端项目..."
log "================================================"

# 检查部署目录是否存在
if [ ! -d "${DEPLOY_DIR}" ]; then
  log "================================================"
  log "检测到首次部署，创建部署目录..."
  log "================================================"
  mkdir -p ${DEPLOY_DIR}
  FIRST_DEPLOY=true
else
  log "================================================"
  log "检测到已有部署，执行升级部署..."
  log "================================================"
  FIRST_DEPLOY=false
fi

# 备份旧文件（升级场景）
if [ "${FIRST_DEPLOY}" = false ] && [ "$(ls -A ${DEPLOY_DIR})" ]; then
  BACKUP_DIR="${BACKUP_BASE_DIR}/backup_$(date '+%Y%m%d_%H%M%S')"
  log "================================================"
  log "备份当前版本到 ${BACKUP_DIR}..."
  log "================================================"
  mkdir -p ${BACKUP_DIR}
  # 排除 backups 目录本身
  rsync -a --exclude='backups' ${DEPLOY_DIR}/ ${BACKUP_DIR}/ 2>/dev/null || cp -r ${DEPLOY_DIR}/* ${BACKUP_DIR}/ 2>/dev/null || true
  
  # 只保留最近3个备份
  if [ -d "${BACKUP_BASE_DIR}" ]; then
    cd ${BACKUP_BASE_DIR}
    ls -dt backup_* 2>/dev/null | tail -n +4 | xargs rm -rf 2>/dev/null || true
    cd - > /dev/null
  fi
fi

log "================================================"
log "清理旧文件..."
log "================================================"
# 清理旧文件，但保留 backups 目录
find ${DEPLOY_DIR} -mindepth 1 -maxdepth 1 ! -name 'backups' -exec rm -rf {} + 2>/dev/null || true

log "================================================"
log "拷贝文件到 ${DEPLOY_DIR}..."
log "================================================"
cp -r ./* ${DEPLOY_DIR}/

# 检查是否有 nginx 服务
if command -v nginx &> /dev/null; then
  log "================================================"
  log "检测到 Nginx, 测试配置..."
  log "================================================"
  if nginx -t 2>&1; then
    log "Nginx 配置正常"
    log "重新加载 Nginx 配置..."
    systemctl reload nginx || nginx -s reload || true
    log "✓ Nginx 已重新加载"
  else
    log "警告: Nginx 配置测试失败，请手动检查配置"
  fi
else
  log "未检测到 Nginx, 跳过重载步骤"
fi

log "================================================"
log "✓ ${PROJECT_NAME} 部署完成！"
log "================================================"
log "部署目录: ${DEPLOY_DIR}"
if [ "${FIRST_DEPLOY}" = false ] && [ -d "${BACKUP_DIR}" ]; then
  log "备份位置: ${BACKUP_DIR}"
  log "如需回滚，执行: cp -r ${BACKUP_DIR}/* ${DEPLOY_DIR}/"
fi
log "================================================"

exit 0