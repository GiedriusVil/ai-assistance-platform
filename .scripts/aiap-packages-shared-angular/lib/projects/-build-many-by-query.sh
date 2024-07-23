#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_aiapPackagesSharedAngular_projects_buildManyByQuery() {
  local FUNCTION_NAME="_aiapPackagesSharedAngular_projects_buildManyByQuery"
  _loggers_debug "${FUNCTION_NAME}"

  local AIAP_APPLICATION=$(
    _baseAiap_applications_getOneById
  )
  local AIAP_APPLICATION_ID=$(
    _baseAiap_applications_queryId "${AIAP_APPLICATION}"
  )

  if
    [ "${AIAP_PACKAGES_SHARED_ANGULAR_SKIP}" = true ]
  then
    _loggers_warn "${FUNCTION_NAME}" "Skipping..."
  else
    local CLIENT_PROJECT_CLIENT_SHARED_CARBON="client-shared-carbon"
    yarn run aiap-packages-shared-angular:projects:build-one-by-id \
      --aiap-application-id "${AIAP_APPLICATION_ID}" \
      --aiap-packages-shared-angular-client-project-id "${CLIENT_PROJECT_CLIENT_SHARED_CARBON}"

    local CLIENT_PROJECT_CLIENT_SHARED_UTILS="client-shared-utils"
    yarn run aiap-packages-shared-angular:projects:build-one-by-id \
      --aiap-application-id "${AIAP_APPLICATION_ID}" \
      --aiap-packages-shared-angular-client-project-id "${CLIENT_PROJECT_CLIENT_SHARED_UTILS}"

    local CLIENT_PROJECT_CLIENT_SHARED_SERVICES="client-shared-services"
    yarn run aiap-packages-shared-angular:projects:build-one-by-id \
      --aiap-application-id "${AIAP_APPLICATION_ID}" \
      --aiap-packages-shared-angular-client-project-id "${CLIENT_PROJECT_CLIENT_SHARED_SERVICES}"

    local CLIENT_PROJECT_CLIENT_SHARED_COMPONENTS="client-shared-components"
    yarn run aiap-packages-shared-angular:projects:build-one-by-id \
      --aiap-application-id "${AIAP_APPLICATION_ID}" \
      --aiap-packages-shared-angular-client-project-id "${CLIENT_PROJECT_CLIENT_SHARED_COMPONENTS}"

    local CLIENT_PROJECT_CLIENT_SHARED_VIEWS="client-shared-views"
    yarn run aiap-packages-shared-angular:projects:build-one-by-id \
      --aiap-application-id "${AIAP_APPLICATION_ID}" \
      --aiap-packages-shared-angular-client-project-id "${CLIENT_PROJECT_CLIENT_SHARED_VIEWS}"
  fi
}
