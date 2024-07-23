#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clientWbcs_wbcsLocalStorage_listManyByQuery() {
    local FUNCTION_NAME="_clientWbcs_wbcsLocalStorage_listManyByQuery"
    local RET_VAL=$(
        ls -ltr "${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/client-wbc/projects" |
            awk '{ print $9 }' |
            tail -n +2 |
            grep -v "\..*" |
            grep -v "client-" |
            sort
    )
    echo "${RET_VAL}"
}
