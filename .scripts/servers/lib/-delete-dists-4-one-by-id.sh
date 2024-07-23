#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_servers_deleteDists4OneById() {
    local FUNCTION_NAME="_servers_deleteDists4OneById"

    _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

    yarn run aiap-packages-shared:delete-dists

    yarn run servers:aiap-packages:delete-dists-4-one-by-id \
        --aiap-application-id "${AIAP_APPLICATION_ID}"

    yarn servers:packages:delete-dists-4-one-by-id \
        --aiap-application-id "${AIAP_APPLICATION_ID}"
}
