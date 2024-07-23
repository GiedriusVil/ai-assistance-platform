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

_clientWbcs_projectsLocalStorage_listManyByQuery() {
    local FUNCTION_NAME="_clientWbcs_projectsLocalStorage_listManyByQuery"
    local RET_VAL=$(
        ls -ltr "${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/client-wbc/projects" |
            awk '{ print $9 }' |
            tail -n +2 |
            grep -v "\..*" |
            grep "client-" |
            sort
    )
    echo "${RET_VAL}"
}
