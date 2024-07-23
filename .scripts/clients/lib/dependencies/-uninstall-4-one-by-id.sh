#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clients_dependencies_uninstall4OneById() {
    local FUNCTION_NAME="_clients_dependencies_uninstall4OneById"

    _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION: ${AIAP_APPLICATION}"
    _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

    local DIR_AIAP_APPLICATION_CLIENT="./aiap-applications/${AIAP_APPLICATION_ID}/client"
    cd "${DIR_AIAP_APPLICATION_CLIENT}"

    _loggers_warn "${FUNCTION_NAME}"
    _loggers_warn "${FUNCTION_NAME}" "Removing ${DIR_AIAP_APPLICATION_CLIENT}/dist"
    _loggers_warn "${FUNCTION_NAME}"
    rm -rf dist

    _loggers_warn "${FUNCTION_NAME}"
    _loggers_warn "${FUNCTION_NAME}" "Removing ${DIR_AIAP_APPLICATION_CLIENT}/node_modules"
    _loggers_warn "${FUNCTION_NAME}"

    rm -rf node_modules

    _loggers_warn "${FUNCTION_NAME}"
    _loggers_warn "${FUNCTION_NAME}" "Removing ${DIR_AIAP_APPLICATION_CLIENT}/yarn.lock"
    _loggers_warn "${FUNCTION_NAME}"
    rm -rf yarn.lock

    cd "${LOCAL_HOME_DIR}"
}
