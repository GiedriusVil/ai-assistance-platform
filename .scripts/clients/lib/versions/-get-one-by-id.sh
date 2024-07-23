#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/clients/lib/versions-local-storage/-get-selected.sh
. ./.scripts/clients/lib/versions-local-storage/-list-one-by-id.sh

_clients_versions_getOneById() {
  local FUNCTION_NAME="_clients_versions_getOneById"
  local RET_VAL=""

  if
    [ -z "${AIAP_APPLICATION_CLIENT_VERSION_ID}" ]
  then
    RET_VAL=$(
      _clients_versionsLocalStorage_getSelected
    )
  else
    RET_VAL=$(
      _clients_versionsLocalStorage_listOneById "${AIAP_APPLICATION_CLIENT_VERSION_ID}"
    )
  fi
  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
