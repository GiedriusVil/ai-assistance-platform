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

_clients_dependencies_install4OneById() {
    local FUNCTION_NAME="_clients_dependencies_install4OneById"

    local DIR_AIAP_APPLICATION_CLIENT="./aiap-applications/${AIAP_APPLICATION_ID}/client"
    cd "${DIR_AIAP_APPLICATION_CLIENT}"

    _loggers_debug "${FUNCTION_NAME}" "AIAP_ENVIRONMENT: ${AIAP_ENVIRONMENT}"
    _loggers_debug "${FUNCTION_NAME}" "AIAP_SKIP_NGCC: ${AIAP_SKIP_NGCC}"
    _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
    _loggers_debug "${FUNCTION_NAME}" "DIR_AIAP_APPLICATION_CLIENT: ${DIR_AIAP_APPLICATION_CLIENT}"

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
