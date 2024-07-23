#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/package-jsons/lib/-local-storage-list-paths-by-query.sh

_packageJsons_dependencies_listManyByQuery() {
  local FUNCTION_NAME="_packageJsons_dependencies_listManyByQuery"

  local PACKAGE_JSON_PATHS=$(
    _packageJsons_localStorage_listPathsByQuery
  )

  local RET_VAL=""
  for PACKAGE_JSON_PATH in $PACKAGE_JSON_PATHS; do
    local DEPENDENCIES="null"
    if
      [ -z "${PACKAGE_JSON_DEPENDENCY_NAME}" ]
    then
      DEPENDENCIES=$(
        cat "${PACKAGE_JSON_PATH}" | jq ".dependencies"
      )
    else
      local VERSION=$(
        cat "${PACKAGE_JSON_PATH}" | jq -r --arg PACKAGE_JSON_DEPENDENCY_NAME "${PACKAGE_JSON_DEPENDENCY_NAME}" '.dependencies.[$PACKAGE_JSON_DEPENDENCY_NAME]'
      )
      DEPENDENCIES=$(
        jq -n \
          --arg PACKAGE_JSON_DEPENDENCY_NAME "${PACKAGE_JSON_DEPENDENCY_NAME}" \
          --arg VERSION "${VERSION}" \
          '
            {
              $PACKAGE_JSON_DEPENDENCY_NAME: $VERSION
            }
          '
      )
    fi

    if
      [ ! "${DEPENDENCIES}" = "null" ]
    then
      DEPENDENCIES=$(
        jq -n \
          --arg SOURCE "${PACKAGE_JSON_PATH}" \
          --argjson DEPENDENCIES "${DEPENDENCIES}" \
          '
            { 
              source: $SOURCE,
              dependencies: $DEPENDENCIES
            }
          '
      )
      if
        [ -z "${RET_VAL}" ]
      then
        RET_VAL="[${DEPENDENCIES}]"
      else
        RET_VAL=$(
          echo "${RET_VAL}" | jq --argjson DEPENDENCIES "${DEPENDENCIES}" '. + [$DEPENDENCIES]'
        )
      fi
    fi
  done

  _loggers_debug "${FUNCTION_NAME}" "RET_VAL: \n\n${RET_VAL}\n"
  echo "${RET_VAL}"
}
