#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/-enable-trailing-new-line.sh

_loggers_debug() {
  _loggers_enableLoggerTrailingNewLine
  if
    [ "${LOGGER_IS_ENABLED_DEBUG}" = true ]
  then
    local TMP_1ST_PARAM="${1}${LOCAL_STRING_050_SPACES}"
    TMP_1ST_PARAM="${TMP_1ST_PARAM:0:50}"
    local TMP_LINE="# DEBUG # ${TMP_1ST_PARAM} #     ${2}"
    echo -e "\033[1;36m${TMP_LINE}\033[0m" >&2
  fi
}
