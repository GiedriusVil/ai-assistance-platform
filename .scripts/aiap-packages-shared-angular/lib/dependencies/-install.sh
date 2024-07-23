#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_aiapPackagesSharedAngular_dependencies_install() {
    local FUNCTION_NAME="_aiapPackagesSharedAngular_dependencies_install"

    local DIR_AIAP_PACKAGES_SHARED_ANGULAR="./aiap-packages-shared-angular"
    cd "${DIR_AIAP_PACKAGES_SHARED_ANGULAR}"

    if
        [ "${AIAP_ENVIRONMENT}" = "production" ]
    then
        _loggers_warn "${FUNCTION_NAME}" "Installing dependencies for production"
        _loggers_emptyLine

        yarn install \
            --network-timeout 1000000 \
            --production
    else
        _loggers_warn "${FUNCTION_NAME}" "Installing dependencies"
        _loggers_emptyLine
        yarn install \
            --network-timeout 1000000
    fi
    if
        [ ! "${AIAP_SKIP_NGCC}" = true ]
    then
        _loggers_warn "${FUNCTION_NAME}" "Compiling angular libraries with ngcc"
        _loggers_warn "${FUNCTION_NAME}" "AIAP_SKIP_NGCC: ${AIAP_SKIP_NGCC}"
        yarn run ngcc
    fi

    cd "${LOCAL_HOME_DIR}"
}
