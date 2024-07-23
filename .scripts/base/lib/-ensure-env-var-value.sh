#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_base_ensure_evnVarValue() {
  local FUNCTION_NAME="_base_ensure_evnVarValue"
  _loggers_debug "${FUNCTION_NAME}"

  while
    true
  do
    if
      [ ! -z "${ENV_VAR_VALUE}" ]
    then
      break
    fi
    _loggers_emptyLine
    read -rep $'Provide environment variable value! \n> ' TMP_ENV_VAR_VALUE
    if
      [ -z "${TMP_ENV_VAR_VALUE}" ]
    then
      _loggers_errorX "${FUNCTION_NAME}" "Provided environment variable value can not be empty!"
    else
      export ENV_VAR_VALUE="${TMP_ENV_VAR_VALUE}"
    fi
    _loggers_emptyLine
  done
}
