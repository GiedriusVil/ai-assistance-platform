#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

remove_sources() {
  local REFERENCE_PATH="$1"
  local CONTENTS=""
  CONTENTS=$(ls "$REFERENCE_PATH" 2>/dev/null)
  local FILTERED_CONTENTS=""

  _loggers_debug "${FUNCTION_NAME}" "Removing sources of $REFERENCE_PATH started"

  if [ -n "$CONTENTS" ]; then
    FILTERED_CONTENTS=$(echo "$CONTENTS" | grep -vE '^dist$|^package.json$')

    for CONTENT in $FILTERED_CONTENTS; do
      rm -rf "${REFERENCE_PATH}/${CONTENT}"
    done
  fi

  _loggers_debug "${FUNCTION_NAME}" "Removing sources of ${REFERENCE_PATH} finished"
}

_servers_packages_removeSources4OneById() {

  local FUNCTION_NAME="_servers_startOneById"
  local DIR_AIAP_APPLICATION="${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}"
  local CURRENT_DIR=""
  local TSCONFIG_FILE_PATH=""
  local TSCONFIG_REFERENCES=""
  local TSCONFIG_FILE=""
  local REFERENCE_PATH=""

  cd $DIR_AIAP_APPLICATION

  CURRENT_DIR="$(pwd)"
  TSCONFIG_FILE_PATH="${CURRENT_DIR}/tsconfig.json"

  TSCONFIG_FILE=$(cat "$TSCONFIG_FILE_PATH")
  TSCONFIG_REFERENCES_PATHS=$(echo "$TSCONFIG_FILE" | jq -r '.references[].path')
  echo "${TSCONFIG_REFERENCES}"

  for LIBRARY_PATH in $TSCONFIG_REFERENCES_PATHS; do
    remove_sources "$LIBRARY_PATH"
  done

  _loggers_info "${FUNCTION_NAME}" "TS sources removal finished"
}
