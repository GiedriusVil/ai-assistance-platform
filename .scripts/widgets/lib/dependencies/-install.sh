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

_widgets_dependencies_install() {

    local FUNCTION_NAME="_widgets_dependencies_install"
    local DIR_AIAP_APPLICATION="${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}"
    local CURRENT_DIR=""

    _loggers_debug "${FUNCTION_NAME}" "AIAP_ENVIRONMENT: ${AIAP_ENVIRONMENT}"
    _loggers_debug "${FUNCTION_NAME}" "AIAP_SKIP_NGCC: ${AIAP_SKIP_NGCC}"
    _loggers_debug "${FUNCTION_NAME}" "AIAP_CONTRAST_ENABLED: ${AIAP_CONTRAST_ENABLED}"
    _loggers_debug "${FUNCTION_NAME}" "AIAP_LERNA_CLEAN_ENABLED: ${AIAP_LERNA_CLEAN_ENABLED}"
    _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
    _loggers_debug "${FUNCTION_NAME}" "DIR_AIAP_APPLICATION: ${DIR_AIAP_APPLICATION}"


    if [ -d "$DIR_AIAP_APPLICATION/widget" ]; then

      cd $DIR_AIAP_APPLICATION/widget
      CURRENT_DIR="$(pwd)"
      _loggers_info "${FUNCTION_NAME}" "# CURRENT_DIR: ${CURRENT_DIR}"
      _loggers_info "${FUNCTION_NAME}" "# AIAP_ENVIRONMENT: ${AIAP_ENVIRONMENT}"
      _loggers_info "${FUNCTION_NAME}" "# AIAP_SKIP_NGCC: ${AIAP_SKIP_NGCC}"
      _loggers_info "# "
      _loggers_info "# "

      if
          [ "${AIAP_ENVIRONMENT}" = "production" ]
      then
          _loggers_warn "${FUNCTION_NAME}" "Installing dependencies for production"
          _loggers_emptyLine
          yarn install \
              --network-timeout 1000000 \
              --production
      else
          _loggers_warn "${FUNCTION_NAME}" "Installing dependencies"
          _loggers_emptyLine
          yarn install \
              --network-timeout 1000000
      fi
    else
      _loggers_error "# ${AIAP_APPLICATION_ID} - doesn't have widget!"
      exit 1
    fi

}
