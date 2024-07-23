#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_baseAiap_applications_queryId() {
  local FUNCTION_NAME="_baseAiap_applications_queryId"

  local APPLICATION="${1}"

  local RET_VAL=$(
    echo "${APPLICATION}" | jq -r '.id'
  )

  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
