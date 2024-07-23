#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_servers_root_build() {
    local FUNCTION_NAME="_servers_root_build"
    _loggers_debug "${FUNCTION_NAME}"
    cd ./aiap-applications/$AIAP_APPLICATION_ID
    tsc --build --verbose
}
