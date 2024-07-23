#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/base/lib/-ensure-env-var-key.sh
. ./.scripts/base/lib/-ensure-env-var-value.sh

. ./.scripts/base/lib/-get-env-variable-key-from-line.sh

. ./.scripts/base/lib/-local-storage-ensure-existance-file.sh
. ./.scripts/base/lib/-local-storage-read-lines-from-file.sh
. ./.scripts/base/lib/-local-storage-reset-file.sh

_base_localStorage_saveEnvVariable2_file() {
  local FUNCTION_NAME="_base_localStorage_saveEnvVariable2_file"
  _loggers_debug "${FUNCTION_NAME}"

  _base_ensure_evnVarKey
  _base_ensure_evnVarValue

  local FILE_RELATIVE_PATH="${1}"
  _base_localStorage_ensureExistance_file "${FILE_RELATIVE_PATH}"

  local PARAM_ENV_VAR_KEY="${ENV_VAR_KEY}"
  local PARAM_ENV_VAR_VALUE="${ENV_VAR_VALUE}"

  _loggers_debug "${FUNCTION_NAME}" "ENV_VAR_KEY: ${ENV_VAR_KEY}"
  _loggers_debug "${FUNCTION_NAME}" "ENV_VAR_VALUE: ${ENV_VAR_VALUE}"

  local FILE_LINES=$(
    _base_localStorage_readLinesFrom_file "${FILE_RELATIVE_PATH}"
  )

  _base_localStorage_reset_file "${FILE_RELATIVE_PATH}"

  local TMP_KEY_STATUS=""

  for FILE_LINE in $FILE_LINES; do
    local TMP_ENV_VAR_KEY=$(
      _base_getEnvVariableKey_fromLine "${FILE_LINE}"
    )
    if
      [ "${PARAM_ENV_VAR_KEY}" = "${TMP_ENV_VAR_KEY}" ]
    then
      echo "${PARAM_ENV_VAR_KEY}=\"${PARAM_ENV_VAR_VALUE}\"" >>"${FILE_RELATIVE_PATH}"
      TMP_KEY_STATUS="REPLACED"
    else
      echo "${FILE_LINE}" >>"${FILE_RELATIVE_PATH}"
    fi
  done

  if
    [ ! "${TMP_KEY_STATUS}" = "REPLACED" ]
  then
    echo "${PARAM_ENV_VAR_KEY}=\"${PARAM_ENV_VAR_VALUE}\"" >>"${FILE_RELATIVE_PATH}"
  fi

}
