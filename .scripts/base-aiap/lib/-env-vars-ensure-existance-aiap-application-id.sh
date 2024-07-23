#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/base-aiap/lib/-applications-get-one-by-id.sh
. ./.scripts/base-aiap/lib/-applications-query-id.sh

_envVars_ensureExistance_aiapApplicationId() {
  local FUNCTION_NAME="_envVars_ensureExistance_aiapApplicationId"
  _loggers_debug "${FUNCTION_NAME}"

  local APPLICATION=$(
    _baseAiap_applications_getOneById
  )
  local APPLICATION_ID=$(
    _baseAiap_applications_queryId "${APPLICATION}"
  )
  export AIAP_APPLICATION_ID="${APPLICATION_ID}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
}
