#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/base-aiap/lib/--env-vars-reader.sh

. ./.scripts/base-aiap/lib/-env-vars-ensure-existance-aiap-application-id.sh

_envVars_ensureExistance_aiapApplicationId

export AIAP_IS_INSPECT=false
export AIAP_IS_INSPECT_BRK=false
export AIAP_ESLINT_CHECK=false
export AIAP_ESLINT_REPORTS=false
export AIAP_ESLINT_FIX=false

export AIAP_DIR_CONFIG="../aiap-configuration"

ALL_ARGS=("$@")
while [[ "$#" -gt 0 ]]; do
    case $1 in
    --aiap-dir-inspect)
        export AIAP_IS_INSPECT="$2"
        ;;
    --aiap-dir-inspect-brk)
        export AIAP_IS_INSPECT_BRK="$2"
        ;;
    --aiap-config-dir)
        export AIAP_DIR_CONFIG="$2"
        ;;
    --aiap-eslint-check)
        export AIAP_ESLINT_CHECK="$2"
        ;;
    --aiap-eslint-reports)
        export AIAP_ESLINT_REPORTS="$2"
        ;;
    --aiap-eslint-fix)
        export AIAP_ESLINT_FIX="$2"
        ;;
    *) ;;
    esac
    shift
done
set -- "${ALL_ARGS[@]}"
