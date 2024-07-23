#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clientWbcs_wbcs_queryId() {
  local FUNCTION_NAME="_clientWbcs_wbcs_queryId"

  local CLIENT_VERSION="${1}"

  local RET_VAL=$(
    echo "${CLIENT_VERSION}" | jq -r '.id'
  )

  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
