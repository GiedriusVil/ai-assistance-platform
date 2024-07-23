#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_packageJsons_localStorage_refreshPackageJsonRegistry() {
  local FUNCTION_NAME="_packageJsons_localStorage_refreshPackageJsonRegistry"
  _loggers_warn "${FUNCTION_NAME}" "Initialized"
  local RET_VAL=$(
    find "$(pwd)" -name package.json | grep -v "node_modules" | grep -v "/dist/"
  )
  echo "${RET_VAL}" >"${DIR_SCRIPTS_LOCAL_STORAGE}/${FILE_PACKAGE_JSON_REGISTRY}"
  _loggers_warn "${FUNCTION_NAME}" "Succeeded"
}
