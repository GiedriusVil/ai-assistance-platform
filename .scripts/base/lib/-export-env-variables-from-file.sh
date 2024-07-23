#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/base/lib/-local-storage-ensure-existance-file.sh

. ./.scripts/base/lib/-export-env-variable.sh

. ./.scripts/base/lib/-get-env-variable-key-from-line.sh
. ./.scripts/base/lib/-get-env-variable-value-from-line.sh

_base_exportEnvVariablesFrom_file() {
  local FUNCTION_NAME="_base_exportEnvVariablesFrom_file"
  _loggers_debug "${FUNCTION_NAME}"

  local FILE_RELATIVE_PATH=${1}

  _base_localStorage_ensureExistance_file "${FILE_RELATIVE_PATH}"

  while read TMP_FILE_ENV_LINE; do
    if [ ! -z "${TMP_FILE_ENV_LINE}" ]; then
      local TMP_KEY=$(
        _base_getEnvVariableKey_fromLine "${TMP_FILE_ENV_LINE}"
      )
      local TMP_VALUE=$(
        _base_getEnvVariableValue_fromLine "${TMP_FILE_ENV_LINE}"
      )
      _base_exportEnvVariable "${TMP_KEY}" "${TMP_VALUE}"
    fi
  done <"${FILE_RELATIVE_PATH}"
}
