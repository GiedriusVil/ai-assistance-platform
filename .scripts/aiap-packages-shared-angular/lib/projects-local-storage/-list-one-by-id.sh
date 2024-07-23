#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/aiap-packages-shared-angular/lib/projects-local-storage/-list-many-by-query.sh

_aiapPackagesSharedAngular_projectsLocalStorage_listOneById() {
  local FUNCTION_NAME="_aiapPackagesSharedAngular_projectsLocalStorage_listOneById"
  local AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECT_ID="$1"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECT_ID}"
  if
    [ -z "${AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECT_ID}" ]
  then
    _loggers_error "${FUNCTION_NAME}"
    _loggers_error "${FUNCTION_NAME}" "Missing required 1st input parameter!"
    _loggers_error "${FUNCTION_NAME}"
    exit 1
  fi
  local AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECTS=$(
    _aiapPackagesSharedAngular_projectsLocalStorage_listManyByQuery
  )
  local RET_VAL=""
  for AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECT in $AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECTS; do
    if
      [ "${AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECT_ID}" = "${AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECT}" ]
    then
      RET_VAL="{ \"id\": \"${AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECT}\" }"
      break
    fi
  done
  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
