#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_servers_root_watch() {
    local FUNCTION_NAME="_servers_root_watch"
    _loggers_debug "${FUNCTION_NAME}"
    tsc --build --watch --verbose
}
