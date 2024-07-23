#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/base-aiap/lib/-applications-get-one-by-id.sh
. ./.scripts/base-aiap/lib/-applications-query-id.sh

_servers_dependencies_install() {
    local FUNCTION_NAME="_servers_dependencies_install"

    _loggers_debug "${FUNCTION_NAME}" "AIAP_ENVIRONMENT: ${AIAP_ENVIRONMENT}"
    _loggers_debug "${FUNCTION_NAME}" "AIAP_SKIP_NGCC: ${AIAP_SKIP_NGCC}"
    _loggers_debug "${FUNCTION_NAME}" "AIAP_CONTRAST_ENABLED: ${AIAP_CONTRAST_ENABLED}"
    _loggers_debug "${FUNCTION_NAME}" "AIAP_LERNA_CLEAN_ENABLED: ${AIAP_LERNA_CLEAN_ENABLED}"
    _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

    if
        [ "${AIAP_CONTRAST_ENABLED}" = true ]
    then
        local CONTRAST_NODE_LIB=@contrast/agent
        _loggers_warn "${FUNCTION_NAME}" " Installing ${CONTRAST_NODE_LIB} global node library!"
        yarn global add "${CONTRAST_NODE_LIB}"
    fi

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
        [ "${AIAP_LERNA_CLEAN_ENABLED}" = true ]
    then
        _loggers_warn "${FUNCTION_NAME}" "# Lerna clean..."
        yarn lerna clean --yes
    fi

    _loggers_warn "${FUNCTION_NAME}" "Cleaning up ./node_modules/ folder --> cause of high level security issues!"
    rm -rf ./node_modules/node-gyp/test
    rm -rf ./node_modules/public-encrypt/test/
}
