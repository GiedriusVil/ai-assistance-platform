#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------
#
#       --> passed parameters are read & exported environment variables
#
. ./.scripts/base-aiap/lib/--env-vars-reader.sh
#
#       --> required environment variables are validated for existance
#
. ./.scripts/base-aiap/lib/--env-vars-validator.sh
#
#       --> available functions are imported/exported
#
. ./.scripts/base-aiap/lib/--index-api.sh
# -------------------------------------------------------------------------------------
