#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_baseAiap_localStorage_applications_listManyByQuery() {
  local FUNCTION_NAME="_baseAiap_localStorage_applications_listManyByQuery"
  _loggers_debug "${FUNCTION_NAME}"

  local RET_VAL=$(
    ls -ltr "${LOCAL_HOME_DIR}/aiap-applications" | awk '{ print $9 }' | tail -n +2 | grep -v "\..*" | sort
  )

  echo "${RET_VAL}"
}
