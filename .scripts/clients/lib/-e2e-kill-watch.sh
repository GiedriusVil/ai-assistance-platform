#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clients_e2e_killWatch() {
  local FUNCTION_NAME="_clients_e2e_killWatch"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
  _loggers_debug "${FUNCTION_NAME}" "pgrep -f 'clients:e2e-watch-one-by-id'"
  pgrep -f 'clients:e2e-watch-one-by-id'
  pgrep -f 'clients:e2e-watch-one-by-id' | xargs kill -9
  _loggers_debug "${FUNCTION_NAME}" "pgrep -f 'ng build'"
  pgrep -f 'ng build'
  pgrep -f 'ng build' | xargs kill -9
}
