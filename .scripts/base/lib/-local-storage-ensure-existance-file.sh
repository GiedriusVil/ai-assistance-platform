#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_base_localStorage_ensureExistance_file() {
  local FUNCTION_NAME="_base_localStorage_ensureExistance_file"
  # _loggers_infoX "${FUNCTION_NAME}"

  local FILE_RELATIVE_PATH="${1}"

  if
    [ -z "${FILE_RELATIVE_PATH}" ]
  then
    _loggers_error "${FUNCTION_NAME}"
    _loggers_error "${FUNCTION_NAME}" "Missing mandatory 1st paramter (FILE_RELATIVE_PATH)!"
    _loggers_error "${FUNCTION_NAME}"
    exit 1
  fi
  if
    [ ! -e "${FILE_RELATIVE_PATH}" ]
  then
    touch "${FILE_RELATIVE_PATH}"
    _loggers_warn "${FUNCTION_NAME}"
    _loggers_warn "${FUNCTION_NAME}" "Was absent -> had to create!"
    _loggers_warn "${FUNCTION_NAME}"
  fi
}
