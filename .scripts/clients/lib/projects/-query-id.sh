#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clients_projects_queryId() {
  local FUNCTION_NAME="_clients_projects_queryId"

  local CLIENT_PROJECT="${1}"

  local RET_VAL=$(
    echo "${CLIENT_PROJECT}" | jq -r '.id'
  )

  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
