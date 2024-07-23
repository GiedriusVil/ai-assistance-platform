#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clients_versions_queryId() {
  local FUNCTION_NAME="_clients_versions_queryId"

  local CLIENT_VERSION="${1}"

  local RET_VAL=$(
    echo "${CLIENT_VERSION}" | jq -r '.id'
  )

  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
