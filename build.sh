#!/usr/bin/env bash

set -e

archive() {
    if hash gtar 2>/dev/null; then
        gtar "$@"
    else
        tar "$@"
    fi
}

if [[ -z $1 ]]; then
    echo "Please specify target release file"
    exit;
fi


BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd ${BASE_DIR}

rm -Rf .build && mkdir .build

# backend
if [[ ! -d "./node_modules/" ]]; then
  npm -q install
fi

npm run -q build:prod -- \
        --env.outputPath=.build

(cd .build/ && archive -zcf $1 .)
rm -Rf .build
