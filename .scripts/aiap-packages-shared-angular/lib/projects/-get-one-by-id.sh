#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/aiap-packages-shared-angular/lib/projects-local-storage/-get-selected.sh
. ./.scripts/aiap-packages-shared-angular/lib/projects-local-storage/-list-one-by-id.sh

_aiapPackagesSharedAngular_projects_getOneById() {
  local FUNCTION_NAME="_aiapPackagesSharedAngular_projects_getOneById"
  local RET_VAL=""
  if
    [ -z "${AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECT_ID}" ]
  then
    RET_VAL=$(
      _aiapPackagesSharedAngular_projectsLocalStorage_getSelected
    )
  else
    RET_VAL=$(
      _aiapPackagesSharedAngular_projectsLocalStorage_listOneById "${AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECT_ID}"
    )
  fi
  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
