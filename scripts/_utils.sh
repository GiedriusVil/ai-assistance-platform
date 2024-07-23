#!/bin/bash
#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
. ./scripts/_utils-loggers.sh
. ./scripts/_utils-set-env.sh
. ./scripts/_utils-eslint.sh
. ./scripts/_utils-validators.sh
. ./scripts/_utils-app-client-wbc.sh
. ./scripts/_utils-app-client.sh
. ./scripts/_utils-app-server.sh

buildWidget() {
  _checkAppParams
  _echoInfo "# Building widget"
  if [ -d "./$AIAP_DIR_APPLICATIONS/$AIAP_APPLICATION/widget" ]; then
    cd ./$AIAP_DIR_APPLICATIONS/$AIAP_APPLICATION/widget
    DIR_CURRENT="$(pwd)"
    _echoInfo "# DIR_CURRENT: ${DIR_CURRENT}"
    _echoInfo "# "
    _echoInfo "# "
    yarn run widget:build
    cd ../../..
  else
    echo "# ${AIAP_APPLICATION} - doesn't have widget!"
  fi
}

installWidgetLibs() {
  _checkAppParams

  PRODUCTION=$1
  SKIP_NGCC=$2
  _echoInfo "# Installing widget libraries"
  if [ -d "./$AIAP_DIR_APPLICATIONS/$AIAP_APPLICATION/widget" ]; then
    cd ./$AIAP_DIR_APPLICATIONS/$AIAP_APPLICATION/widget
    DIR_CURRENT="$(pwd)"
    _echoInfo "# DIR_CURRENT: ${DIR_CURRENT}"
    _echoInfo "# IS_PRODUCTION: ${PRODUCTION}"
    _echoInfo "# SKIP_NGCC: ${SKIP_NGCC}"
    _echoInfo "# "
    _echoInfo "# "
    if [ $PRODUCTION -gt 0 ]; then
      yarn install --network-timeout 1000000 --production
    else
      yarn install --network-timeout 1000000
    fi
  else
    _echoInfo "# ${AIAP_APPLICATION} - doesn't have widget!"
  fi
}

cleanWidget() {
  _checkAppParams
  cd ./$AIAP_DIR_APPLICATIONS/$AIAP_APPLICATION
  _echoInfo "# CLEANING... ./widget/package-lock.json"
  rm -rf ./widget/package-lock.json
  _echoInfo "# CLEANING... ./widget/yarn.lock"
  rm -rf ./widget/yarn.lock
  _echoInfo "# CLEANING... ./widget/node_modules"
  rm -rf ./widget/node_modules
  _echoInfo "# CLEANED ./widget"
}

cleanClient() {
  _checkAppParams

  cd ./$AIAP_DIR_APPLICATIONS/$AIAP_APPLICATION
  _echoInfo "# CLEANING... ./client"
  rm -rf ./client/package-lock.json
  rm -rf ./client/yarn.lock
  rm -rf ./client/node_modules
  _echoInfo "# CLEANED ./client"
}

removeSources() {
  _checkAppParams
  cd ./$AIAP_DIR_APPLICATIONS/$AIAP_APPLICATION
  DIR_CURRENT="$(pwd)"
  _echoInfo "# DIR_CURRENT: ${DIR_CURRENT}"
  _echoInfo "# "
  _echoInfo "# "
}
