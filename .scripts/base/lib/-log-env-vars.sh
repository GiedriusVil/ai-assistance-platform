#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_base_logEnvVars() {
  local FUNCTION_NAME="_base_logEnvVars"
  _loggers_debug "${FUNCTION_NAME}"

  _loggers_info "${FUNCTION_NAME}" "LOCAL_OS_TYPE: ${LOCAL_OS_TYPE}"
  _loggers_info "${FUNCTION_NAME}" "LOCAL_CPU_TYPE: ${LOCAL_CPU_TYPE}"
  _loggers_info "${FUNCTION_NAME}" "LOCAL_HOME_DIR: ${LOCAL_HOME_DIR}"
  _loggers_info "${FUNCTION_NAME}" "LOCAL_FILE_DOT_ENV: ${LOCAL_FILE_DOT_ENV}"
}
