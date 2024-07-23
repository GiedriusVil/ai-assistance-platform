#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_aiapPackagesSharedAngular_dependencies_uninstall() {
    local FUNCTION_NAME="_aiapPackagesSharedAngular_dependencies_uninstall"

    local DIR_AIAP_PACKAGES_SHARED_ANGULAR="./aiap-packages-shared-angular"
    cd "${DIR_AIAP_PACKAGES_SHARED_ANGULAR}"

    _loggers_warn "${FUNCTION_NAME}"
    _loggers_warn "${FUNCTION_NAME}" "Removing ${DIR_AIAP_PACKAGES_SHARED_ANGULAR}/dist"
    _loggers_warn "${FUNCTION_NAME}"
    rm -rf dist

    _loggers_warn "${FUNCTION_NAME}"
    _loggers_warn "${FUNCTION_NAME}" "Removing ${DIR_AIAP_PACKAGES_SHARED_ANGULAR}/node_modules"
    _loggers_warn "${FUNCTION_NAME}"

    rm -rf node_modules

    _loggers_warn "${FUNCTION_NAME}"
    _loggers_warn "${FUNCTION_NAME}" "Removing ${DIR_AIAP_PACKAGES_SHARED_ANGULAR}/yarn.lock"
    _loggers_warn "${FUNCTION_NAME}"
    rm -rf yarn.lock

    cd "${LOCAL_HOME_DIR}"
}
