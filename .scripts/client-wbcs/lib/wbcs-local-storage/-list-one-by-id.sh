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

. ./.scripts/client-wbcs/lib/wbcs-local-storage/-list-many-by-query.sh

_clientWbcs_wbcsLocalStorage_listOneById() {
  local FUNCTION_NAME="_clientWbcs_wbcsLocalStorage_listOneById"

  local AIAP_APPLICATION_CLIENT_WBC_ID="${1}"
  if
    [ -z "${AIAP_APPLICATION_CLIENT_WBC_ID}" ]
  then
    _loggers_error "${FUNCTION_NAME}"
    _loggers_error "${FUNCTION_NAME}" "Missing required 1st input parameter -> AIAP_APPLICATION_CLIENT_WBC_ID!"
    _loggers_error "${FUNCTION_NAME}"
    exit 1
  fi
  local AIAP_APPLICATION_CLIENT_WBCS=$(
    _clientWbcs_wbcsLocalStorage_listManyByQuery
  )
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_CLIENT_WBC_ID: ${AIAP_APPLICATION_CLIENT_WBC_ID}"
  local RET_VAL=""
  for AIAP_APPLICATION_CLIENT_WBC in $AIAP_APPLICATION_CLIENT_WBCS; do
    if
      [ "${AIAP_APPLICATION_CLIENT_WBC_ID}" = "${AIAP_APPLICATION_CLIENT_WBC}" ]
    then
      RET_VAL="{ \"id\": \"${AIAP_APPLICATION_CLIENT_WBC}\" }"
      break
    fi
  done
  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
