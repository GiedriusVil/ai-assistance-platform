#!/bin/bash
#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
. ./scripts/_utils-loggers.sh

export AIAP_PLATFORM=ai-assistance-platform
export AIAP_ENVIRONMENT="local"
export AIAP_DIR_HOME="$(pwd)"
export AIAP_DIR_CONFIG="../aiap-configuration"
export AIAP_DIR_APPLICATIONS="aiap-applications"
export AIAP_DIR_CUSTOM_PACKAGES_SHARED=custom-packages-shared
export AIAP_DIR_PACKAGES_SHARED=aiap-packages-shared
export AIAP_DIR_PACKAGES_SHARED_ANGULAR=aiap-packages-shared-angular

export AIAP_APPLICATION=""
export AIAP_WBC=""

export AIAP_IS_INSPECT=0
export AIAP_IS_INSPECT_BRK=0

IS_PRODUCTION=0
IS_REPORT_ENABLED=0
IS_CONTRAST_ENABLED=0
SKIP_NGCC=0

LEARNA_CLEAN=0

ENV_LOCAL=0

DEFAULT_ACTION=1

CONFIGURATION="production"

SHARED=0
STANDALONE=0

ALL_ARGS=("$@")

while [[ "$#" -gt 0 ]]; do
  case $1 in
  --env)
    export AIAP_ENVIRONMENT="$2"
    ;;
  --configuration) CONFIGURATION="$2" ;;
  --production) IS_PRODUCTION=1 ;;
  --report) IS_REPORT_ENABLED=1 ;;
  --contrast) IS_CONTRAST_ENABLED=1 ;;
  --lerna-clean) LEARNA_CLEAN=1 ;;
  --skip-ngcc) SKIP_NGCC=1 ;;
  --configDir)
    export AIAP_DIR_CONFIG="$2"
    ;;
  --appDir) AIAP_DIR_APPLICATIONS="$2" ;;
  --app)
    export AIAP_APPLICATION="$2"
    ;;
  --wbc)
    export AIAP_WBC="$2"
    ;;
  --shared) SHARED=1 ;;
  --standalone) STANDALONE=1 ;;
  --inspect) AIAP_IS_INSPECT=1 ;;
  --inspect-brk) AIAP_IS_INSPECT_BRK=1 ;;
  *) ;;
  esac
  shift
done

printLine
_echoInfo "# ENV_VAR AIAP_PLATFORM: ${AIAP_PLATFORM}"
_echoInfo "# ENV_VAR AIAP_ENVIRONMENT: ${AIAP_ENVIRONMENT}"
_echoInfo "# ENV_VAR AIAP_DIR_CONFIG: ${AIAP_DIR_CONFIG}"
_echoInfo "# ENV_VAR AIAP_DIR_HOME: ${AIAP_DIR_HOME}"
_echoInfo "# ENV_VAR AIAP_DIR_APPLICATIONS: ${AIAP_DIR_APPLICATIONS}"
_echoInfo "# ENV_VAR AIAP_DIR_CUSTOM_PACKAGES_SHARED: ${AIAP_DIR_CUSTOM_PACKAGES_SHARED}"
_echoInfo "# ENV_VAR AIAP_DIR_PACKAGES_SHARED: ${AIAP_DIR_PACKAGES_SHARED}"
_echoInfo "# ENV_VAR AIAP_DIR_PACKAGES_SHARED_ANGULAR: ${AIAP_DIR_PACKAGES_SHARED_ANGULAR}"
_echoInfo "# ENV_VAR AIAP_APPLICATION: ${AIAP_APPLICATION}"
_echoInfo "# ENV_VAR AIAP_WBC: ${AIAP_WBC}"
