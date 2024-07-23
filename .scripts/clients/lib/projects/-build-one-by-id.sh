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

. ./.scripts/clients/lib/projects/-get-one-by-id.sh
. ./.scripts/clients/lib/projects/-query-id.sh

_clients_projects_buildOneById() {
  local FUNCTION_NAME="_clients_projects_buildOneById"

  local AIAP_APPLICATION_CLIENT_PROJECT=$(
    _clients_projects_getOneById
  )
  local AIAP_APPLICATION_CLIENT_PROJECT_ID=$(
    _clients_projects_queryId "${AIAP_APPLICATION_CLIENT_PROJECT}"
  )
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_CLIENT_PROJECT: ${AIAP_APPLICATION_CLIENT_PROJECT}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_CLIENT_PROJECT_ID: ${AIAP_APPLICATION_CLIENT_PROJECT_ID}"

  cd ./aiap-applications/${AIAP_APPLICATION_ID}/client
  yarn run ng build "${AIAP_APPLICATION_CLIENT_PROJECT_ID}"
  cd "${LOCAL_HOME_DIR}"
}
