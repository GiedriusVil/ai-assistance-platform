#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clients_buildOneById() {
  local FUNCTION_NAME="_clients_buildOneById"

  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

  cd ./aiap-applications/${AIAP_APPLICATION_ID}/client

  if
    [ "${AIAP_APPLICATION_ID}" = "portal" ]
  then
    _loggers_debug "${FUNCTION_NAME}" "Standard Angular application build..."
    yarn run ng build \
      --configuration "${AIAP_ENVIRONMENT}"
  else
    _loggers_debug "${FUNCTION_NAME}" "Web Component Angular application build..."
    yarn run ng build \
      --configuration "${AIAP_ENVIRONMENT}" \
      --output-hashing none \
      --single-bundle true \
      --aot
  fi

  if
    [ "${AIAP_ENVIRONMENT}" = "development" ]
  then
    node "${LOCAL_HOME_DIR}/scripts/edit-map-source-root.js" \
      --app "${AIAP_APPLICATION_ID}" \
      --dir './dist/client'
  fi

  cd "${LOCAL_HOME_DIR}"
}
