#!/bin/bash
#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
. ./scripts/_utils-loggers.sh

SKIP_ESLINT=0

while [[ "$#" -gt 0 ]]; do
  case $1 in
  --skip-eslint) SKIP_ESLINT=1 ;;
  *) ;;
  esac
  shift
done

handleExecuteESLintError() {
  if [[ $? -ne 0 ]]; then
    _echoError "# "
    _echoError "# "
    _echoError "# Eslint check failed -> FIRST FIX ISSUES!"
    _echoError "# "
    exit 1
  fi
}

executeESLint() {
  _ESLINT_PATH=$1
  _ESLINT_REPORT_ENABLED=$2
  _ESLINT_REPORT_TYPE=$3
  _ESLINT_REPORT_FILE=$4
  _ESLINT_ISSUES_FIX=$5

  _ADDITIONAL_FLAGS=''
  _echoInfo "# ESLINT_PATH: ${_ESLINT_PATH} ..."
  _echoInfo "# ESLINT_REPORT_ENABLED: ${_ESLINT_REPORT_ENABLED}"
  _echoInfo "# ESLINT_REPORT_TYPE: ${_ESLINT_REPORT_TYPE}"
  _echoInfo "# ESLINT_REPORT_FILE: ${_ESLINT_REPORT_FILE}"
  _echoInfo "# "

  if [ ! -z "$_ESLINT_ISSUES_FIX" ] && [ $_ESLINT_ISSUES_FIX -gt 0 ]; then
    _echoInfo "# ESLINT - ADDING FIX FLAG"
    _ADDITIONAL_FLAGS="--fix $_ADDITIONAL_FLAGS"
  fi

  if [ $_ESLINT_REPORT_ENABLED -gt 0 ]; then
    yarn run eslint $_ESLINT_PATH --no-error-on-unmatched-pattern -f $_ESLINT_REPORT_TYPE -o $_ESLINT_REPORT_FILE $_ADDITIONAL_FLAGS
  else
    yarn run eslint $_ESLINT_PATH --no-error-on-unmatched-pattern $_ADDITIONAL_FLAGS
  fi
  handleExecuteESLintError
}

executeServerESLint() {

  TMP_CURRENT_DIR=$(pwd)
  ESLINT_FILE_PATTERN='\.(js|jsx)$'

  _echoInfoYellow "# "
  _echoInfoYellow "# Executing eslint on identified source code changes"
  _echoInfoYellow "# CURRENT_DIR: ${TMP_CURRENT_DIR}"
  _echoInfoYellow "# "
  GIT_DIFF_FILES=($(git diff --name-only HEAD | grep -E $ESLINT_FILE_PATTERN | xargs))
  for GIT_FILE in "${GIT_DIFF_FILES[@]}"; do
    _echoInfoYellow "# Validating file -> $GIT_FILE"
  done
  _echoInfoYellow "# "

  yarn run eslint $GIT_DIFF_FILES --no-error-on-unmatched-pattern
  handleExecuteESLintError
}

executeServerESLintV1() {
  if [ $SKIP_ESLINT -gt 0 ]; then
    _echoInfo "# Eslint check skipped!"
    _echoInfo "# "
    printLineSeparator
  else
    _checkAppParams

    APPLICATION_PATH=./$AIAP_DIR_APPLICATIONS/$AIAP_APPLICATION
    ESLINT_REPORT_ENABLED=$1
    ESLINT_ISSUES_FIX=$2

    ESLINT_PATH=./aiap-packages-shared/**
    ESLINT_REPORT_TYPE=html
    ESLINT_REPORT_FILE="eslint.aiap-packages-shared.html"
    executeESLint "${ESLINT_PATH}" $ESLINT_REPORT_ENABLED $ESLINT_REPORT_TYPE $ESLINT_REPORT_FILE $ESLINT_ISSUES_FIX

    ESLINT_PATH="${APPLICATION_PATH}/aiap-packages/**"
    ESLINT_REPORT_TYPE=html
    ESLINT_REPORT_FILE="eslint.${AIAP_APPLICATION}.aiap-packages.html"
    executeESLint "${ESLINT_PATH}" $ESLINT_REPORT_ENABLED $ESLINT_REPORT_TYPE $ESLINT_REPORT_FILE $ESLINT_ISSUES_FIX

    ESLINT_PATH="${APPLICATION_PATH}/packages/**"
    ESLINT_REPORT_TYPE=html
    ESLINT_REPORT_FILE="eslint.${AIAP_APPLICATION}.packages.html"
    executeESLint "${ESLINT_PATH}" $ESLINT_REPORT_ENABLED $ESLINT_REPORT_TYPE $ESLINT_REPORT_FILE $ESLINT_ISSUES_FIX

    printLineSeparator
    _echoInfo "# Eslint check passed - let's ROCK ;)"
    _echoInfo "#"
  fi
}
