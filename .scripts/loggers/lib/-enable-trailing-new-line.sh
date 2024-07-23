#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

_loggers_enableLoggerTrailingNewLine() {
  if
    [ -z "$LOGGER_TRAILING_NEW_LINE_DISABLED" ]
  then
    echo "" >&2
    export LOGGER_TRAILING_NEW_LINE_DISABLED="TRUE"
  fi
}
