#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_aiapPackagesSharedAngular_projectsLocalStorage_listManyByQuery() {
    local FUNCTION_NAME="_aiapPackagesSharedAngular_projectsLocalStorage_listManyByQuery"
    _loggers_debug "${FUNCTION_NAME}"
    _loggers_emptyLine

    local RET_VAL=$(
        ls -ltr "${LOCAL_HOME_DIR}/aiap-packages-shared-angular/projects" | awk '{ print $9 }' | tail -n +2 | grep -v "\..*" | sort
    )

    echo "${RET_VAL}"
}
