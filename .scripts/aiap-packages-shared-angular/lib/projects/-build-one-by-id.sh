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

. ./.scripts/aiap-packages-shared-angular/lib/projects/-get-one-by-id.sh
. ./.scripts/aiap-packages-shared-angular/lib/projects/-query-id.sh

_aiapPackagesSharedAngular_projects_buildOneById() {
  local FUNCTION_NAME="_aiapPackagesSharedAngular_projects_buildOneById"

  local AIAP_APPLICATION=$(
    _baseAiap_applications_getOneById
  )
  local AIAP_APPLICATION_ID=$(
    _baseAiap_applications_queryId "${AIAP_APPLICATION}"
  )
  local CLIENT_PROJECT=$(
    _aiapPackagesSharedAngular_projects_getOneById
  )
  local CLIENT_PROJECT_ID=$(
    _aiapPackagesSharedAngular_projects_queryId "${CLIENT_PROJECT}"
  )

  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
  _loggers_debug "${FUNCTION_NAME}" "CLIENT_PROJECT_ID: ${CLIENT_PROJECT_ID}"

  cd ./aiap-applications/${AIAP_APPLICATION_ID}/client

  yarn run ng build "${CLIENT_PROJECT_ID}"

  cd "${LOCAL_HOME_DIR}"
}
