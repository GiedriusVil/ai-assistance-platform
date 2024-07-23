#!/bin/bash
#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
export NODE_OPTIONS=--max_old_space_size=4096

ng version

APPLICATION=tenant-customizer

production=0

while [[ "$#" -gt 0 ]]; do
  case $1 in
  --production) production=1 ;;
  *) ;;
  esac
  shift
done

_echoInfo() {
  echo "\033[1;36m$1\033[0m"
}

_echoError() {
  echo "\033[1;31m$1\033[0m"
}

printLineSeparator() {
  _echoInfo "# ----------------------------------------------------------------------------"
}

buildClientLib() {
  LIBRARY=0
  CONFIGURATION="production"
  while [[ "$#" -gt 0 ]]; do
    case $1 in
    --lib) LIBRARY="$2" ;;
    --configuration) CONFIGURATION="$2" ;;
    *) ;;
    esac
    shift
  done
  printLineSeparator
  _echoInfo "# Building library..."
  _echoInfo "# "
  _echoInfo "# LIBRARY: ${LIBRARY}"
  _echoInfo "# CONFIGURATION: ${CONFIGURATION}"
  _echoInfo "# "
  _echoInfo "# "
  ng build $LIBRARY --configuration $CONFIGURATION
}

buildClientApp() {
  printLineSeparator
  _echoInfo "# Building application..."
  _echoInfo "# "
  _echoInfo "# APPLICATION: ${APPLICATION}"
  _echoInfo "# "
  _echoInfo "# "
  ng build --aot --output-hashing none --single-bundle true
}
