#!/usr/bin/env bash

# This script adds the Version of the corresponding javascript package in the line 6 of the generated css.

# Read the package.json version property
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')

# Set OUTPUT env varible to change output directory
OUTPUT="${OUTPUT:-lib/css/}"

# Add the package version to the header of the css output file
sed -i '' "6s/^/Version: ${PACKAGE_VERSION}\ /" $OUTPUT*.css
