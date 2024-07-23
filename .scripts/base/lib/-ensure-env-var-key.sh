#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_base_ensure_evnVarKey() {
  local FUNCTION_NAME="_base_ensure_evnVarKey"
  _loggers_debug "${FUNCTION_NAME}"

  while
    true
  do
    if
      [ ! -z "${ENV_VAR_KEY}" ]
    then
      break
    fi
    _loggers_emptyLine
    read -rep $'Provide environment variable key! \n> ' TMP_ENV_VAR_KEY
    if
      [ -z "$TMP_ENV_VAR_KEY" ]
    then
      _loggers_errorX "${FUNCTION_NAME}" "Provided environment variable key can not be empty!"
    else
      export ENV_VAR_KEY="$TMP_ENV_VAR_KEY"
    fi
    _loggers_emptyLine
  done
}
