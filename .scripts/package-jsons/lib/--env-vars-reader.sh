#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/base-aiap/lib/--env-vars-reader.sh

. ./.scripts/loggers/lib/--index-api.sh

if
    [ "${DISABLE_ENV_VARS_ENSURE_EXISTANCE_AIAP_APPLICATION_ID}" = true ]
then
    _loggers_warn "package-jsons/lib/--env-vars-reader.sh" "DISABLE_ENV_VARS_ENSURE_EXISTANCE_AIAP_APPLICATION_ID: ${DISABLE_ENV_VARS_ENSURE_EXISTANCE_AIAP_APPLICATION_ID}"
else
    . ./.scripts/base-aiap/lib/-env-vars-ensure-existance-aiap-application-id.sh
    _envVars_ensureExistance_aiapApplicationId
fi

export PACKAGE_JSON_PATH_QUERY=""
export PACKAGE_JSON_PATH_NQUERY=""
export PACKAGE_JSON_DEPENDENCY_NAME=""
export PACKAGE_JSON_DEPENDENCY_VERSION=""

ALL_ARGS=("$@")
while [[ "$#" -gt 0 ]]; do
    case $1 in
    --package-json-path-query)
        export PACKAGE_JSON_PATH_QUERY="$2"
        ;;
    --package-json-path-nquery)
        export PACKAGE_JSON_PATH_NQUERY="$2"
        ;;
    --package-json-path-query)
        export PACKAGE_JSON_PATH_QUERY="$2"
        ;;
    --package-json-dependency-name)
        export PACKAGE_JSON_DEPENDENCY_NAME="$2"
        ;;
    --package-json-dependency-version)
        export PACKAGE_JSON_DEPENDENCY_VERSION="$2"
        ;;
    *) ;;
    esac
    shift
done
set -- "${ALL_ARGS[@]}"
