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

. ./.scripts/client-wbcs/lib/projects/-get-one-by-id.sh
. ./.scripts/client-wbcs/lib/projects/-query-id.sh

_clientWbcs_projects_buildOneById() {
  local FUNCTION_NAME="_clientWbcs_projects_buildOneById"

  local AIAP_APPLICATION_CLIENT_WBC_PROJECT=$(
    _clientWbcs_projects_getOneById
  )
  local AIAP_APPLICATION_CLIENT_WBC_PROJECT_ID=$(
    _clientWbcs_projects_queryId "${AIAP_APPLICATION_CLIENT_WBC_PROJECT}"
  )

  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_CLIENT_WBC_PROJECT_ID: ${AIAP_APPLICATION_CLIENT_WBC_PROJECT_ID}"

  local DIR_AIAP_APPLICATION_CLIENT_WBC="./aiap-applications/${AIAP_APPLICATION_ID}/client-wbc"
  cd "${DIR_AIAP_APPLICATION_CLIENT_WBC}"

  yarn run ng build "${AIAP_APPLICATION_CLIENT_WBC_PROJECT_ID}"

  cd "${LOCAL_HOME_DIR}"
}
