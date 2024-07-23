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

_clientWbcs_wbcs_e2eBuildOneById() {
  local FUNCTION_NAME="_clientWbcs_wbcs_e2eBuildOneById"

  local AIAP_APPLICATION_CLIENT_WBC=$(
    _clientWbcs_wbcs_getOneById
  )
  local AIAP_APPLICATION_CLIENT_WBC_ID=$(
    _clientWbcs_wbcs_queryId "${AIAP_APPLICATION_CLIENT_WBC}"
  )

  yarn run aiap-packages-shared-angular:projects:build-many-by-query \
    --aiap-environment "${AIAP_ENVIRONMENT}" \
    --aiap-application-id "${AIAP_APPLICATION_ID}"

  yarn run client-wbcs:projects:build-many-by-query \
    --aiap-environment "${AIAP_ENVIRONMENT}" \
    --aiap-application-id "${AIAP_APPLICATION_ID}"

  yarn run client-wbcs:wbcs:build-one-by-id \
    --aiap-environment "${AIAP_ENVIRONMENT}" \
    --aiap-application-id "${AIAP_APPLICATION_ID}" \
    --aiap-application-client-wbc-id "${AIAP_APPLICATION_CLIENT_WBC_ID}"

}
