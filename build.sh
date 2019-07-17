#!/usr/bin/env bash

set -e

rm -Rf dist/assets/*

npm run build:prod -- \
    --env.outputPath=./dist

gh-pages commit -m "$(git log -1 --pretty=%B)"
