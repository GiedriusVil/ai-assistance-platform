#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/clients/lib/versions/-get-one-by-id.sh
. ./.scripts/clients/lib/versions/-query-id.sh

_clients_versions_buildOneById() {
  local FUNCTION_NAME="_clients_versions_buildOneById"

  local AIAP_APPLICATION_CLIENT_VERSION=$(
    _clients_versions_getOneById
  )
  local AIAP_APPLICATION_CLIENT_VERSION_ID=$(
    _clients_versions_queryId "${AIAP_APPLICATION_CLIENT_VERSION}"
  )

  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_CLIENT_VERSION_ID: ${AIAP_APPLICATION_CLIENT_VERSION_ID}"

  cd ./aiap-applications/${AIAP_APPLICATION_ID}/client

  yarn run ng build "${AIAP_APPLICATION_CLIENT_VERSION_ID}" \
    --configuration "${AIAP_ENVIRONMENT}" \
    --output-hashing none \
    --single-bundle true \
    --aot

  cd "${LOCAL_HOME_DIR}"
}
