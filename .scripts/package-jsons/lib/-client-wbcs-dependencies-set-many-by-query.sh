#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/package-jsons/lib/-client-wbcs-dependencies-list-many-by-query.sh

_packageJson_clientWbcsDependencies_setManyByQuery() {
  local FUNCTION_NAME="_packageJson_clientWbcsDependencies_setManyByQuery"

  export PACKAGE_JSON_PATH_QUERY="/client-wbc/"
  export PACKAGE_JSON_PATH_NQUERY="/client-wbc/projects/"

  local SOURCES=$(
    _packageJson_clientWbcsDependencies_listManyByQuery |
      jq -r ".[].source"
  )

  for SOURCE in $SOURCES; do
    _loggers_debug "${FUNCTION_NAME}" "Initialized - SOURCE: ${SOURCE}"
    jq \
      --arg PACKAGE_JSON_DEPENDENCY_NAME "$PACKAGE_JSON_DEPENDENCY_NAME" \
      --arg PACKAGE_JSON_DEPENDENCY_VERSION "$PACKAGE_JSON_DEPENDENCY_VERSION" \
      '.dependencies.[$PACKAGE_JSON_DEPENDENCY_NAME] = $PACKAGE_JSON_DEPENDENCY_VERSION' "${SOURCE}" >"${SOURCE}.tmp" && mv "${SOURCE}.tmp" "${SOURCE}"
    rm -rf "${SOURCE}.tmp"
    _loggers_debug "${FUNCTION_NAME}" "Succeeded - SOURCE: ${SOURCE}"
  done

}
