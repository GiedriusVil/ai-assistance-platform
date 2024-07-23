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

_clientWbcs_wbcs_buildManyByQuery() {
  local FUNCTION_NAME="_clientWbcs_wbcs_buildManyByQuery"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
  if
    [ "${AIAP_APPLICATION_CLIENT_WBCS_SKIP}" = true ]
  then
    _loggers_warn "${FUNCTION_NAME}" "Skipping..."
  else
    local CLIENT_WBCS_IDS=$(
      _clientWbcs_wbcsLocalStorage_listManyByQuery
    )
    if
      [ -z "${CLIENT_WBCS_IDS[0]}" ]
    then
      _loggers_warn "${FUNCTION_NAME}" "${AIAP_APPLICATION_ID} client-wbcs are missing. Skiping build."
    else
      for CLIENT_WBCS_ID in $CLIENT_WBCS_IDS; do
        yarn run client-wbcs:wbcs:build-one-by-id \
          --aiap-environment "${AIAP_ENVIRONMENT}" \
          --aiap-application-id "${AIAP_APPLICATION_ID}" \
          --aiap-application-client-wbc-id "${CLIENT_WBCS_ID}"
      done
    fi
  fi
}
