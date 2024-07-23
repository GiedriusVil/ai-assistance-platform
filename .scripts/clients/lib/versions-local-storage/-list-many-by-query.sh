#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clients_versionsLocalStorage_listManyByQuery() {
    local FUNCTION_NAME="_clients_versionsLocalStorage_listManyByQuery"
    local RET_VAL=$(
        ls -ltr "${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/client/projects" |
            awk '{ print $9 }' |
            tail -n +2 |
            grep -v "\..*" |
            grep "client-v[0-9]" |
            sort
    )
    echo "${RET_VAL}"
}
