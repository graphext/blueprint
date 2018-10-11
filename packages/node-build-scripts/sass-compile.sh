#!/usr/bin/env bash

if [ $# -eq 0 ]; then
  echo "Usage: [OUTPUT=dir] sass-compile <directory> [...args]"
  exit 1
fi

# set OUTPUT env varible to change output directory
OUTPUT="${OUTPUT:-lib/css/}"

# dependencies are hoisted to root node_modules, so load packages from there
ROOT_NM=../../node_modules

$ROOT_NM/.bin/node-sass-chokidar \
  --importer $ROOT_NM/node-sass-package-importer/dist/cli.js \
  --output $OUTPUT \
  --source-map true \
  $@

# Read the package.json version property
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')

# Add the package version to the header of the css output file
sed -i '' "6s/^/Version: ${PACKAGE_VERSION}\ /" $OUTPUT*.css
