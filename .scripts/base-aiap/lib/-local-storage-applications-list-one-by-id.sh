#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/base-aiap/lib/-local-storage-applications-list-many-by-query.sh

_baseAiap_localStorage_applications_listOneById() {
  local FUNCTION_NAME="_baseAiap_localStorage_applications_listOneById"

  local AIAP_APPLICATION_ID="$1"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

  if
    [ -z "${AIAP_APPLICATION_ID}" ]
  then
    _loggers_error "${FUNCTION_NAME}"
    _loggers_error "${FUNCTION_NAME}" "Missing required 1st input parameter!"
    _loggers_error "${FUNCTION_NAME}"
    exit 1
  fi

  local APPLICATIONS=$(
    _baseAiap_localStorage_applications_listManyByQuery
  )

  local RET_VAL=""

  for APPLICATION in $APPLICATIONS; do
    if
      [ "${AIAP_APPLICATION_ID}" = "${APPLICATION}" ]
    then
      RET_VAL="{ \"id\": \"${APPLICATION}\" }"
      break
    fi
  done

  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"

  echo "${RET_VAL}"
}
