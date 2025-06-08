#!/bin/bash

set -ex

echo "拉取最新代码..."
git fetch && git reset --hard origin/master

echo "Deploying webconsole-ui ..."
npm run build
cp -r ./dist/* /home/www/