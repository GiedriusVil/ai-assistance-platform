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

_base_localStorage_readLinesFrom_file() {
  local FUNCTION_NAME="_base_localStorage_readLinesFrom_file"
  _loggers_debug "${FUNCTION_NAME}"

  local FILE_RELATIVE_PATH="${1}"

  _base_localStorage_ensureExistance_file "${FILE_RELATIVE_PATH}"

  local RET_VAL=()

  while
    read -r TMP_FILE_LINE
  do
    if
      [ ! -z "${TMP_FILE_LINE}" ]
    then
      RET_VAL+=($TMP_FILE_LINE)
    fi

  done <"${FILE_RELATIVE_PATH}"

  echo "${RET_VAL[*]}"
}
