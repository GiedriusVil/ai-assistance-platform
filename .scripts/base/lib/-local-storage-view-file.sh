#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_base_localStorage_view_file() {
  local FUNCTION_NAME="_base_localStorage_view_file"
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

  _loggers_emptyLine
  cat "${FILE_RELATIVE_PATH}"
  _loggers_emptyLine

}
