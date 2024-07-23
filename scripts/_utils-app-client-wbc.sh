#!/bin/bash
#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
. ./scripts/_utils-loggers.sh
. ./scripts/_utils-validators.sh

generate__client_wbc__angular_json() {
  cd ./$AIAP_DIR_APPLICATIONS/$AIAP_APPLICATION/client-wbc
  DIR_CURRENT="$(pwd)"
  _echoInfo "# Generating angular.json ..."
  _echoInfo "# DIR_CURRENT: ${DIR_CURRENT}"
  _echoInfo "# "
  _echoInfo "# "
  node angular-json.js
  cd ../../..
}
