#!/usr/bin/env bash

set -e

npm run build:prod -- \
    --env.outputPath=./dist

gh-pages commit -m "$(git log -1 --pretty=%B)"
