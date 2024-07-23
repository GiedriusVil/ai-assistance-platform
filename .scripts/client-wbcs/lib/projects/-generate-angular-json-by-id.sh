#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clientWbcs_projects_generateAngularJsonById(){
    local FUNCTION_NAME="_clientWbcs_projects_generateAngularJsonById"
    local DIR_AIAP_APPLICATION_CLIENT_WBC="./aiap-applications/${AIAP_APPLICATION_ID}/client-wbc"
    _loggers_debug "${FUNCTION_NAME}" "DIR_AIAP_APPLICATION_CLIENT_WBC: ${DIR_AIAP_APPLICATION_CLIENT_WBC}"
    cd "${DIR_AIAP_APPLICATION_CLIENT_WBC}"
    _loggers_debug "${FUNCTION_NAME}" "# Generating angular.json ..."
    node angular-json.js
    cd "${LOCAL_HOME_DIR}"
}
