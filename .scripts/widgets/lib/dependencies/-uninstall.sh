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

_widgets_dependencies_uninstall(){

    local FUNCTION_NAME="_widgets_dependencies_install"
    local DIR_AIAP_APPLICATION="${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}"
    local CURRENT_DIR=""

    _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
    _loggers_debug "${FUNCTION_NAME}" "DIR_AIAP_APPLICATION: ${DIR_AIAP_APPLICATION}"


    cd $DIR_AIAP_APPLICATION
    

    if [ -d "$DIR_AIAP_APPLICATION/widget" ]; then

      cd $DIR_AIAP_APPLICATION/widget
      CURRENT_DIR="$(pwd)"

     _loggers_info "${FUNCTION_NAME}" "# CURRENT_DIR ${CURRENT_DIR}"

     _loggers_info "${FUNCTION_NAME}" "# CLEANING... ./widget/package-lock.json"

      rm -rf package-lock.json

      _loggers_info "${FUNCTION_NAME}" "# CLEANING... ./widget/yarn.lock"

      rm -rf yarn.lock

      _loggers_info "${FUNCTION_NAME}" "# CLEANING... ./widget/node_modules"

      rm -rf node_modules

      _loggers_info "${FUNCTION_NAME}" "# CLEANED ./widget"
    else
      _loggers_error "# ${AIAP_APPLICATION_ID} - doesn't have widget!"
      exit 1
    fi

}
