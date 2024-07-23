#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/package-jsons/lib/-local-storage-refresh-package-json-registry.sh

_packageJsons_localStorage_listPathsByQuery() {
  local FUNCTION_NAME="_packageJsons_localStorage_listPathsByQuery"

  if
    [ ! -e "${DIR_SCRIPTS_LOCAL_STORAGE}/${FILE_PACKAGE_JSON_REGISTRY}" ]
  then
    _packageJsons_localStorage_refreshPackageJsonRegistry
  fi
  local COMMAND="cat ${DIR_SCRIPTS_LOCAL_STORAGE}/${FILE_PACKAGE_JSON_REGISTRY}"
  if
    [ ! -z "${PACKAGE_JSON_PATH_NQUERY}" ]
  then
    COMMAND="${COMMAND} | grep -v \"${PACKAGE_JSON_PATH_NQUERY}\""
  fi
  if
    [ ! -z "${PACKAGE_JSON_PATH_QUERY}" ]
  then
    COMMAND="${COMMAND} | grep \"${PACKAGE_JSON_PATH_QUERY}\""
  fi
  local RET_VAL=$(
    eval "${COMMAND}"
  )

  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: \n\n${RET_VAL}\n"
  echo "${RET_VAL}"
}
