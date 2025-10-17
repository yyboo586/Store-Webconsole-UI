#!/bin/bash

set -e

# 日志函数
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] $1"
}

error() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] $1" >&2
}

# 定义产物目录
BUILD_DIR="./dist"
PACKAGE_DIR="./package"
PACKAGE_NAME="webconsole-ui_$(date '+%Y%m%d_%H%M%S')"

log "[1] 检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
  error "Node.js 未安装，请先安装 Node.js"
  exit 1
fi
log "Node.js 版本: $(node -v)"
log "NPM 版本: $(npm -v)"

log "[2] 清理旧的构建文件和产物目录..."
rm -rf ${BUILD_DIR}
rm -rf ${PACKAGE_DIR}

log "[3] 安装依赖..."
if [ ! -d "node_modules" ]; then
  log "首次构建，安装依赖包..."
  npm install
else
  log "node_modules 已存在，跳过安装"
fi

log "[4] 构建前端项目..."
if ! npm run build; then
  error "构建失败，请检查代码"
  exit 1
fi

log "[5] 检查构建结果..."
if [ ! -d "${BUILD_DIR}" ]; then
  error "构建产物目录不存在，构建可能失败"
  exit 1
fi

log "[6] 创建产物目录..."
mkdir -p ${PACKAGE_DIR}/${PACKAGE_NAME}

log "[7] 拷贝文件到产物目录..."
cp -r ${BUILD_DIR}/* ${PACKAGE_DIR}/${PACKAGE_NAME}/
cp ./deploy.sh ${PACKAGE_DIR}/${PACKAGE_NAME}/

log "[8] 压缩打包..."
cd ${PACKAGE_DIR}
tar -czf ${PACKAGE_NAME}.tar.gz ${PACKAGE_NAME}
cd ..

log "[9] 清理临时目录..."
rm -rf ${PACKAGE_DIR}/${PACKAGE_NAME}

log "[10] 打包完成！"
log "[11] 产物位置: ${PACKAGE_DIR}/${PACKAGE_NAME}.tar.gz"
log "========================================"
log "部署说明："
log "1. 上传 ${PACKAGE_DIR}/${PACKAGE_NAME}.tar.gz 到目标服务器"
log "2. 解压: tar -xzf ${PACKAGE_NAME}.tar.gz"
log "3. 进入目录: cd ${PACKAGE_NAME}"
log "4. 执行部署: sudo ./deploy.sh"
log "========================================"

