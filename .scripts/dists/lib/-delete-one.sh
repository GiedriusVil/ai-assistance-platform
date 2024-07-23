#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_dists_deleteOne() {
    local FUNCTION_NAME="_dists_deleteOne"
    local DIST_PATH="${1}"
    _loggers_debug "${FUNCTION_NAME}" "DIST_PATH: ${DIST_PATH}"
    rm -rf "${DIST_PATH}"
}
