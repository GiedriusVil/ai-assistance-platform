#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/client-wbcs/lib/wbcs-local-storage/-list-many-by-query.sh
. ./.scripts/client-wbcs/lib/wbcs-local-storage/-list-one-by-id.sh

_clientWbcs_wbcsLocalStorage_getSelected() {
  local FUNCTION_NAME="_clientWbcs_wbcsLocalStorage_getSelected"

  local CLIENT_WBC_IDS=$(
    _clientWbcs_wbcsLocalStorage_listManyByQuery
  )
  local RET_VAL=""
  while
    true
  do
    _loggers_emptyLine
    _loggers_info "${FUNCTION_NAME}" "Select one of available ${AIAP_APPLICATION_ID} client-projects."
    _loggers_emptyLine
    select CLIENT_WBC_ID in $CLIENT_WBC_IDS exit; do
      _loggers_emptyLine
      case $CLIENT_WBC_ID in
      exit)
        RET_VAL=""
        break
        ;;
      *)
        RET_VAL=$(
          _clientWbcs_wbcsLocalStorage_listOneById "${CLIENT_WBC_ID}"
        )
        break
        ;;
      esac
    done
    if
      [ ! -z "${RET_VAL}" ]
    then
      break
    fi
  done

  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"

  echo "${RET_VAL}"
}
