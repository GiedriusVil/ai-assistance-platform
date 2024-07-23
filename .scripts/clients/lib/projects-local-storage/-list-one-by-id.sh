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

. ./.scripts/clients/lib/projects-local-storage/-list-many-by-query.sh

_clients_projectsLocalStorage_listOneById() {
  local FUNCTION_NAME="_clients_projectsLocalStorage_listOneById"
  local AIAP_APPLICATION_CLIENT_PROJECT_ID="${1}"
  if
    [ -z "${AIAP_APPLICATION_CLIENT_PROJECT_ID}" ]
  then
    _loggers_error "${FUNCTION_NAME}"
    _loggers_error "${FUNCTION_NAME}" "Missing required 1st input parameter -> AIAP_APPLICATION_CLIENT_PROJECT_ID!"
    _loggers_error "${FUNCTION_NAME}"
    exit 1
  fi
  local AIAP_APPLICATION_CLIENT_PROJECTS=$(
    _clients_projectsLocalStorage_listManyByQuery
  )
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_CLIENT_PROJECT_ID: ${AIAP_APPLICATION_CLIENT_PROJECT_ID}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_CLIENT_PROJECTS: ${AIAP_APPLICATION_CLIENT_PROJECTS}"
  local RET_VAL=""
  for AIAP_APPLICATION_CLIENT_PROJECT in $AIAP_APPLICATION_CLIENT_PROJECTS; do
    if
      [ "${AIAP_APPLICATION_CLIENT_PROJECT_ID}" = "${AIAP_APPLICATION_CLIENT_PROJECT}" ]
    then
      RET_VAL="{ \"id\": \"${AIAP_APPLICATION_CLIENT_PROJECT}\" }"
      break
    fi
  done
  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
