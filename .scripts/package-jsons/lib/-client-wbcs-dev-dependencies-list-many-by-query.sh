#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/package-jsons/lib/-dev-dependencies-list-many-by-query.sh

_packageJson_clientWbcsDevDependencies_listManyByQuery() {
  local FUNCTION_NAME="_packageJson_clientWbcsDevDependencies_listManyByQuery"

  export PACKAGE_JSON_PATH_QUERY="/client-wbc/"
  export PACKAGE_JSON_PATH_NQUERY="/client-wbc/projects/"

  local RET_VAL=$(
    _packageJsons_devDependencies_listManyByQuery
  )

  _loggers_debug "${FUNCTION_NAME}"
  echo "${RET_VAL}"
}
