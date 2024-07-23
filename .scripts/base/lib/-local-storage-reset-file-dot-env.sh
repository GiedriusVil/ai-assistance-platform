#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/base/lib/-local-storage-reset-file.sh

_base_localStorage_reset_fileDotEnv() {
  local FUNCTION_NAME="_base_localStorage_reset_fileDotEnv"
  _loggers_debug "${FUNCTION_NAME}"

  _loggers_info "${FUNCTION_NAME}" "LOCAL_FILE_DOT_ENV: ${LOCAL_FILE_DOT_ENV}"
  _loggers_info "${FUNCTION_NAME}" "LOCAL_FILE_DOT_ENV (absolute): ${LOCAL_HOME_DIR}/${LOCAL_FILE_DOT_ENV}"

  _base_localStorage_reset_file "${LOCAL_FILE_DOT_ENV}"
}
