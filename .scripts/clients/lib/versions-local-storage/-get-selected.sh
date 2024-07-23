#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/clients/lib/versions-local-storage/-list-many-by-query.sh
. ./.scripts/clients/lib/versions-local-storage/-list-one-by-id.sh

_clients_versionsLocalStorage_getSelected() {
  local FUNCTION_NAME="_clients_versionsLocalStorage_getSelected"

  local CLIENT_VERSION_IDS=$(
    _clients_versionsLocalStorage_listManyByQuery
  )
  local RET_VAL=""
  while
    true
  do
    _loggers_emptyLine
    _loggers_info "${FUNCTION_NAME}" "Select one of available ${AIAP_APPLICATION_ID} client versions."
    _loggers_emptyLine
    select CLIENT_VERSION_ID in $CLIENT_VERSION_IDS exit; do
      _loggers_emptyLine
      case $CLIENT_VERSION_ID in
      exit)
        RET_VAL=""
        break
        ;;
      *)
        RET_VAL=$(
          _clients_versionsLocalStorage_listOneById "${CLIENT_VERSION_ID}"
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
