#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/client-wbcs/lib/wbcs-local-storage/-get-selected.sh
. ./.scripts/client-wbcs/lib/wbcs-local-storage/-list-one-by-id.sh

_clientWbcs_wbcs_getOneById() {
  local FUNCTION_NAME="_clientWbcs_wbcs_getOneById"
  local RET_VAL=""

  if
    [ -z "${AIAP_APPLICATION_CLIENT_WBC_ID}" ]
  then
    RET_VAL=$(
      _clientWbcs_wbcsLocalStorage_getSelected
    )
  else
    RET_VAL=$(
      _clientWbcs_wbcsLocalStorage_listOneById "${AIAP_APPLICATION_CLIENT_WBC_ID}"
    )
  fi
  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
