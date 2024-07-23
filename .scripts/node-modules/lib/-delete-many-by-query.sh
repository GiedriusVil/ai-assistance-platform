#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_nodeModules_deleteManyByQuery() {
    local FUNCTION_NAME="_nodeModules_deleteManyByQuery"
    local TMP_PATH=$1
    local TMP_PATH_2_NODE_MODULES="${TMP_PATH}node_modules"

    if
        [ -d "${TMP_PATH_2_NODE_MODULES}" ]
    then
        _loggers_debug "${FUNCTION_NAME}" "TMP_PATH_2_NODE_MODULES: ${TMP_PATH_2_NODE_MODULES}"
        rm -rf "${TMP_PATH_2_NODE_MODULES}"
        _loggers_debug "${FUNCTION_NAME}" "Removed"
    else
        _loggers_warn "${FUNCTION_NAME}" "Folder ${TMP_PATH_2_NODE_MODULES} does not exists!"
    fi

}
