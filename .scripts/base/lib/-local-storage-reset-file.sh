#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_base_localStorage_reset_file() {
  local FUNCTION_NAME="_base_localStorage_reset_file"
  _loggers_debug "${FUNCTION_NAME}"

  local FILE_RELATIVE_PATH="${1}"

  if
    [ -z "${FILE_RELATIVE_PATH}" ]
  then
    _loggers_error "${FUNCTION_NAME}"
    _loggers_error "${FUNCTION_NAME}" "Missing mandatory 1st paramter (FILE_RELATIVE_PATH)!"
    _loggers_error "${FUNCTION_NAME}"
    exit 1
  fi

  rm "${FILE_RELATIVE_PATH}"

  touch "${FILE_RELATIVE_PATH}"
}
