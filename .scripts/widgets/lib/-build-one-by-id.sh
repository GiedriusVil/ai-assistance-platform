#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_widgets_buildOneById(){

  local FUNCTION_NAME="_widgets_buildOneById"
  local DIR_APPLICATION="${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}"
  local CURRENT_DIR=""
  local ADDITIONAL_OPTIONS=""
      
  if [ "${AIAP_ENVIRONMENT}" = "development" ]; then
      ADDITIONAL_OPTIONS+="--sourceMap"
  fi

  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
  _loggers_debug "${FUNCTION_NAME}" "DIR_APPLICATION: ${DIR_APPLICATION}"
  _loggers_debug "${FUNCTION_NAME}" "ADDITIONAL_OPTIONS: ${ADDITIONAL_OPTIONS}"

  _loggers_info "# Building widget"

  if [ -d "$DIR_APPLICATION/widget" ]; then

    cd $DIR_APPLICATION/widget

    CURRENT_DIR="$(pwd)"
    _loggers_info  "${FUNCTION_NAME}" "# CURRENT_DIR: ${CURRENT_DIR}"
    _loggers_info "# "
    _loggers_info "# "
    {
      yarn run widget:build "${ADDITIONAL_OPTIONS}"
    } || {
      exit 1
    }

  else
    _loggers_error "# ${AIAP_APPLICATION_ID} - doesn't have widget!"
    exit 1
  fi

  cd "${LOCAL_HOME_DIR}"
}
