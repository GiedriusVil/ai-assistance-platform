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
. ./.scripts/base-aiap/lib/-local-storage-applications-list-one-by-id.sh

_baseAiap_localStorage_applications_getSelected() {
  local FUNCTION_NAME="_baseAiap_localStorage_applications_getSelected"

  local APPLICATION_IDS=$(
    _baseAiap_localStorage_applications_listManyByQuery
  )

  local RET_VAL=""

  while
    true
  do
    _loggers_emptyLine
    _loggers_info "${FUNCTION_NAME}" "Select one of available AIAP applications."
    _loggers_emptyLine

    select APPLICATION_ID in $APPLICATION_IDS exit; do
      _loggers_emptyLine
      case $APPLICATION_ID in
      exit)
        RET_VAL=""
        break
        ;;
      *)
        RET_VAL=$(
          _baseAiap_localStorage_applications_listOneById "${APPLICATION_ID}"
        )
        break
        ;;
      esac
    done
    if
      [ ! -z "${RET_VAL}" ]
    then
      break
    fi
  done

  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: ${RET_VAL}"

  echo "${RET_VAL}"
}
