#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_aiapPackagesShared_deleteDists() {
    local FUNCTION_NAME="_aiapPackagesShared_deleteDists"
    _loggers_debug "${FUNCTION_NAME}"

    local DIR_AIAP_PACKAGES_SHARED="${LOCAL_HOME_DIR}/aiap-packages-shared"
    _loggers_debug "${FUNCTION_NAME}" "DIR_AIAP_PACKAGES_SHARED: ${DIR_AIAP_PACKAGES_SHARED}"

    local PACKAGES=""
    if
        [ -d "${DIR_AIAP_PACKAGES_SHARED}" ]
    then
        PACKAGES=$(
            ls -ltr "${DIR_AIAP_PACKAGES_SHARED}" |
                awk '{ print $9 }' |
                tail -n +2
        )
    fi

    _loggers_debug "${FUNCTION_NAME}" "PACKAGES: \n\n${PACKAGES}\n"

    for PACKAGE in $PACKAGES; do
        local TMP_DIR_PACKAGE_DIST="${DIR_AIAP_PACKAGES_SHARED}/${PACKAGE}/dist"
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
