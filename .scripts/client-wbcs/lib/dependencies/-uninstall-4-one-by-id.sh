#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clientWbcs_dependencies_uninstall4OneById() {
    local FUNCTION_NAME="_clientWbcs_dependencies_uninstall4OneById"

    local DIR_AIAP_APPLICATION_CLIENT_WBC="./aiap-applications/${AIAP_APPLICATION_ID}/client-wbc"
    cd "${DIR_AIAP_APPLICATION_CLIENT_WBC}"

    _loggers_debug "${FUNCTION_NAME}" "DIR_AIAP_APPLICATION_CLIENT_WBC: ${DIR_AIAP_APPLICATION_CLIENT_WBC}"

    _loggers_warn "${FUNCTION_NAME}"
    _loggers_warn "${FUNCTION_NAME}" "Removing ${DIR_AIAP_APPLICATION_CLIENT_WBC}/dist"
    _loggers_warn "${FUNCTION_NAME}"
    rm -rf dist

    _loggers_warn "${FUNCTION_NAME}"
    _loggers_warn "${FUNCTION_NAME}" "Removing ${DIR_AIAP_APPLICATION_CLIENT_WBC}/node_modules"
    _loggers_warn "${FUNCTION_NAME}"

    rm -rf node_modules

    _loggers_warn "${FUNCTION_NAME}"
    _loggers_warn "${FUNCTION_NAME}" "Removing ${DIR_AIAP_APPLICATION_CLIENT_WBC}/yarn.lock"
    _loggers_warn "${FUNCTION_NAME}"
    rm -rf yarn.lock

    cd "${LOCAL_HOME_DIR}"
}
