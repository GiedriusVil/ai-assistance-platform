#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/clients/lib/projects-local-storage/-get-selected.sh
. ./.scripts/clients/lib/projects-local-storage/-list-one-by-id.sh

_clients_projects_getOneById() {
  local FUNCTION_NAME="_client_projects_getOneById"
  local RET_VAL=""
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_CLIENT_PROJECT_ID: ${AIAP_APPLICATION_CLIENT_PROJECT_ID}"
  if
    [ -z "${AIAP_APPLICATION_CLIENT_PROJECT_ID}" ]
  then
    RET_VAL=$(
      _clients_projectsLocalStorage_getSelected
    )
  else
    RET_VAL=$(
      _clients_projectsLocalStorage_listOneById "${AIAP_APPLICATION_CLIENT_PROJECT_ID}"
    )
  fi
  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
