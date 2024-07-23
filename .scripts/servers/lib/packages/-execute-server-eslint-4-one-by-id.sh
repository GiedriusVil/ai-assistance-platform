#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

executeESLint() {
  local FUNCTION_NAME="_servers_packages_executeServerESLint4OneById"
  local ESLINT_ADDITIONAL_FLAGS=''
  local AIAP_ESLINT_PATH=$1
  local AIAP_ESLINT_REPORT_TYPE=$2
  local AIAP_ESLINT_REPORT_FILE=$3

  _loggers_info "${FUNCTION_NAME}" "# AIAP_ESLINT_PATH: ${AIAP_ESLINT_PATH} ..."
  _loggers_info "${FUNCTION_NAME}" "# AIAP_ESLINT_REPORTS: ${AIAP_ESLINT_REPORTS}"
  _loggers_info "${FUNCTION_NAME}" "# AIAP_ESLINT_FIX: ${AIAP_ESLINT_FIX}"
  _loggers_info "${FUNCTION_NAME}" "# AIAP_ESLINT_REPORT_TYPE: ${AIAP_ESLINT_REPORT_TYPE}"
  _loggers_info "${FUNCTION_NAME}" "# AIAP_ESLINT_REPORT_FILE: ${AIAP_ESLINT_REPORT_FILE}"

  if [ "${AIAP_ESLINT_FIX}" = true ]; then
    _loggers_info "${FUNCTION_NAME}" "# ESLINT - ADDING FIX FLAG"
    ESLINT_ADDITIONAL_FLAGS="--fix $ESLINT_ADDITIONAL_FLAGS"
  fi

  if [ "${AIAP_ESLINT_REPORTS}" = true ]; then
    {
      yarn run eslint $AIAP_ESLINT_PATH --no-error-on-unmatched-pattern -f $AIAP_ESLINT_REPORT_TYPE -o $AIAP_ESLINT_REPORT_FILE $AIAP_ESLINT_PATH
    } ||
      {
        exit 1
      }
  else
    {
      yarn run eslint $AIAP_ESLINT_PATH --no-error-on-unmatched-pattern $AIAP_ESLINT_PATH
    } || {
      exit 1
    }
  fi
}

_servers_packages_executeServerESLint4OneById() {
  local APPLICATION_PATH=""
  local ESLINT_PATH=""
  local ESLICT_REPORT_TYPE=""
  local ESLINT_REPORT_FILE=""

  APPLICATION_PATH=./$AIAP_DIR_APPLICATIONS/$AIAP_APPLICATION

  ESLINT_PATH=./aiap-packages-shared/**
  ESLINT_REPORT_TYPE=html
  ESLINT_REPORT_FILE="eslint.aiap-packages-shared.html"
  executeESLint "${ESLINT_PATH}" $ESLINT_REPORT_TYPE $ESLINT_REPORT_FILE

  ESLINT_PATH="${APPLICATION_PATH}/aiap-packages/**"
  ESLINT_REPORT_TYPE=html
  ESLINT_REPORT_FILE="eslint.${AIAP_APPLICATION}.aiap-packages.html"
  executeESLint "${ESLINT_PATH}" $ESLINT_REPORT_TYPE $ESLINT_REPORT_FILE

  ESLINT_PATH="${APPLICATION_PATH}/packages/**"
  ESLINT_REPORT_TYPE=html
  ESLINT_REPORT_FILE="eslint.${AIAP_APPLICATION}.packages.html"
  executeESLint "${ESLINT_PATH}" $ESLINT_REPORT_TYPE $ESLINT_REPORT_FILE

  _echoInfo "# Eslint check passed - let's ROCK ;)"
  _echoInfo "#"
}
