#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/base-aiap/lib/-local-storage-applications-get-selected.sh
. ./.scripts/base-aiap/lib/-local-storage-applications-list-one-by-id.sh

_baseAiap_applications_getOneById() {
  local FUNCTION_NAME="_baseAiap_applications_getOneById"
  local RET_VAL=""
  if
    [ -z "${AIAP_APPLICATION_ID}" ]
  then
    RET_VAL=$(
      _baseAiap_localStorage_applications_getSelected
    )
  else
    RET_VAL=$(
      _baseAiap_localStorage_applications_listOneById "${AIAP_APPLICATION_ID}"
    )
  fi
  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"
  echo "${RET_VAL}"
}
