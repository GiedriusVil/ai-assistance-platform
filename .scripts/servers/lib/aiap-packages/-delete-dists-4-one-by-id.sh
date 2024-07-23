#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_servers_aiapPackages_deleteDists4OneById() {
    local FUNCTION_NAME="_servers_aiapPackages_deleteDists4OneById"
    local DIR_AIAP_PACKAGES="${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/aiap-packages"
    _loggers_debug "${FUNCTION_NAME}" "DIR_AIAP_PACKAGES: ${DIR_AIAP_PACKAGES}"

    local PACKAGES=""
    if
        [ -d "${DIR_AIAP_PACKAGES}" ]
    then
        PACKAGES=$(
            ls -ltr "${DIR_AIAP_PACKAGES}" |
                awk '{ print $9 }' |
                tail -n +2
        )
    fi
    _loggers_debug "${FUNCTION_NAME}" "PACKAGES: \n\n${PACKAGES}\n"
    for PACKAGE in $PACKAGES; do
        local TMP_DIR_PACKAGE_DIST="${DIR_AIAP_PACKAGES}/${PACKAGE}/dist"
        if
            [ -d "${TMP_DIR_PACKAGE_DIST}" ]
        then
            rm -rf "${TMP_DIR_PACKAGE_DIST}"
            _loggers_debug "${FUNCTION_NAME}" "Removed -> ${TMP_DIR_PACKAGE_DIST}"
        else
            _loggers_warn "${FUNCTION_NAME}" "Missing -> ${TMP_DIR_PACKAGE_DIST}"
        fi
    done
}
