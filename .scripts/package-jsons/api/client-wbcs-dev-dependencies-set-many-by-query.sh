#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

export DISABLE_ENV_VARS_ENSURE_EXISTANCE_AIAP_APPLICATION_ID=true

. ./.scripts/package-jsons/lib/--index.sh

_packageJson_clientWbcsDevDependencies_setManyByQuery
