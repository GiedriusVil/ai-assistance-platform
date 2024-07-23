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

_clients_versions_buildManyByQuery() {
  local FUNCTION_NAME="_clients_versions_buildManyByQuery"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

  if
    [ "${AIAP_APPLICATION_CLIENT_VERSIONS_SKIP}" = true ]
  then
    _loggers_warn "${FUNCTION_NAME}" "Skipping..."
  else
    local CLIENT_VERSION_IDS=$(
      _clients_versionsLocalStorage_listManyByQuery
    )

    _loggers_debug "${FUNCTION_NAME}" "CLIENT_VERSION_IDS_LENGTH: "

    if
      [ -z "${CLIENT_VERSION_IDS[0]}" ]
    then
      _loggers_warn "${FUNCTION_NAME}" "${AIAP_APPLICATION_ID} client-versions are missing. Skiping build."
    else
      for CLIENT_VERSION_ID in $CLIENT_VERSION_IDS; do
        yarn run clients:versions:build-one-by-id \
          --aiap-environment "${AIAP_ENVIRONMENT}" \
          --aiap-application-id "${AIAP_APPLICATION_ID}" \
          --aiap-application-client-version-id "${CLIENT_VERSION_ID}"
      done
    fi
  fi
}
