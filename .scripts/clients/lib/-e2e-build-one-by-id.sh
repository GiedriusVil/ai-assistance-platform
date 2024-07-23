#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clients_e2e_buildOneById() {
  local FUNCTION_NAME="_clients_e2e_buildOneById"

  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

  yarn run aiap-packages-shared-angular:projects:build-many-by-query \
    --aiap-application-id "${AIAP_APPLICATION_ID}"

  yarn run clients:projects:build-many-by-query \
    --aiap-application-id "${AIAP_APPLICATION_ID}"

  yarn run clients:build-one-by-id \
    --aiap-application-id "${AIAP_APPLICATION_ID}"

}
