#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_servers_buildOneById() {
    local FUNCTION_NAME="_servers_buildOneById"

    local DIR_APPLICATION="${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}"
    local ADDITIONAL_OPTIONS=""
    if [ "${AIAP_ENVIRONMENT}" = "development" ]; then
        ADDITIONAL_OPTIONS+="--sourceMap"
    fi

    _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
    _loggers_debug "${FUNCTION_NAME}" "DIR_APPLICATION: ${DIR_APPLICATION}"
    _loggers_debug "${FUNCTION_NAME}" "ADDITIONAL_OPTIONS: ${ADDITIONAL_OPTIONS}"
    local VERSION=$(date +%s)
    echo "{ \"build\": { \"timestamp\": ${VERSION} }}" >./aiap-packages-shared/aca-utils-metadata/lib/metadata.json
    {
        yarn run servers:root:build \
            --aiap-application-id "${AIAP_APPLICATION_ID}"
    } || {
        exit 1
    }
    cd "${DIR_APPLICATION}"

    {
        tsc --build \
            --verbose \
            --force "${ADDITIONAL_OPTIONS}"
    } || {
        exit 1
    }

    cd "${LOCAL_HOME_DIR}"

}
