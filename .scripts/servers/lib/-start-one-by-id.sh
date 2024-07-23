#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_servers_startOneById() {
    local FUNCTION_NAME="_servers_startOneById"

    local DIR_AIAP_APPLICATION="${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}"
    local SERVER_INDEX_JS="${DIR_AIAP_APPLICATION}/packages/server/dist/index.js"
    local SERVER_CONFIG_FILE=external
    
    local INSPECT_PARAM=""

    if
       [ "${AIAP_CONTRAST_ENABLED}" = true ]
    then
        RUNTIME_REQUIRES+=(-r @contrast/agent)
        RUNTIME_PARAMS+=(--configFile="./contrast_security.yml")
    fi

    case $AIAP_ENVIRONMENT in
    development)
        RUNTIME_REQUIRES+=(-r dotenv/config)
        RUNTIME_PARAMS+=(dotenv_config_path=$AIAP_DIR_CONFIG/$AIAP_APPLICATION_ID-local.env)
        ;;
    production) ;;
    *)
        _loggers_error "${FUNCTION_NAME}"  "# Missing proper AIAP_ENVIRONMENT variable value. Possible values [development, production]. Passed by --aiap-environment parameter!"
        exit 1
        ;;
    esac

    if
        [ "${AIAP_IS_INSPECT}" = true ]
    then
        INSPECT_PARAM=--inspect=
        INSPECT_PARAM+=$(
            cat "${AIAP_DIR_CONFIG}/${AIAP_APPLICATION_ID}-local.env" | sed -n 's/^PORT=//p'
        )0
    fi

    if
        [ "${AIAP_IS_INSPECT_BRK}" = true ]
    then
        INSPECT_PARAM=--inspect-brk=
        INSPECT_PARAM+=$(
            cat "${AIAP_DIR_CONFIG}/${AIAP_APPLICATION_ID}-local.env" | sed -n 's/^PORT=//p'
)0
    fi

    if
        [ "${AIAP_ESLINT_CHECK}" = true ]
    then
       _servers_packages_executeServerESLint4OneById "${DIR_AIAP_APPLICATION}"
    fi

    _loggers_info "${FUNCTION_NAME}" "Starting server...."
    _loggers_info "${FUNCTION_NAME}" "OS_NAME: ${LOCAL_OS_TYPE}"
    _loggers_info "${FUNCTION_NAME}" "SERVER_INDEX_JS: ${SERVER_INDEX_JS}"
    _loggers_info "${FUNCTION_NAME}" "IS_CONTRAST_ENABLED: ${AIAP_CONTRAST_ENABLED}"
    _loggers_info "${FUNCTION_NAME}" "RUNTIME_REQUIRES: ${RUNTIME_REQUIRES[@]}"
    _loggers_info "${FUNCTION_NAME}" "RUNTIME_PARAMS: ${RUNTIME_PARAMS[@]}"
    _loggers_info "${FUNCTION_NAME}" "SERVER_CONFIG_FILE: ${SERVER_CONFIG_FILE}"
    _loggers_info "# "

    {
      node $INSPECT_PARAM "${RUNTIME_REQUIRES[@]}" $SERVER_INDEX_JS "${RUNTIME_PARAMS[@]}"
    } || {
      exit 1
    }

}
