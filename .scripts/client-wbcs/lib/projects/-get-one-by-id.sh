#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/client-wbcs/lib/projects-local-storage/-get-selected.sh
. ./.scripts/client-wbcs/lib/projects-local-storage/-list-one-by-id.sh

_clientWbcs_projects_getOneById() {
  local FUNCTION_NAME="_clientWbcs_projects_getOneById"
  local RET_VAL=""

  if
    [ -z "${AIAP_APPLICATION_CLIENT_WBC_PROJECT_ID}" ]
  then
    RET_VAL=$(
      _clientWbcs_projectsLocalStorage_getSelected
    )
  else
    RET_VAL=$(
      _clientWbcs_projectsLocalStorage_listOneById "${AIAP_APPLICATION_CLIENT_WBC_PROJECT_ID}"
    )
  fi
  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
