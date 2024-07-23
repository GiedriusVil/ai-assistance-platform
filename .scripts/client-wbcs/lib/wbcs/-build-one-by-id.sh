#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/client-wbcs/lib/wbcs/-get-one-by-id.sh
. ./.scripts/client-wbcs/lib/wbcs/-query-id.sh

_clientWbcs_wbcs_buildOneById() {
  local FUNCTION_NAME="_clientWbc_clientWbcs_buildOneById"

  local AIAP_APPLICATION_CLIENT_WBC=$(
    _clientWbcs_wbcs_getOneById
  )
  local AIAP_APPLICATION_CLIENT_WBC_ID=$(
    _clientWbcs_wbcs_queryId "${AIAP_APPLICATION_CLIENT_WBC}"
  )

  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_CLIENT_WBC_ID: ${AIAP_APPLICATION_CLIENT_WBC_ID}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_ENVIRONMENT: ${AIAP_ENVIRONMENT}"

  local DIR_AIAP_APPLICATION_CLIENT_WBC="./aiap-applications/${AIAP_APPLICATION_ID}/client-wbc"
  cd "${DIR_AIAP_APPLICATION_CLIENT_WBC}"

  yarn run ng build "${AIAP_APPLICATION_CLIENT_WBC_ID}" \
    --configuration "${AIAP_ENVIRONMENT}" \
    --output-hashing none \
    --single-bundle true \
    --aot

  cd "${LOCAL_HOME_DIR}"
}
