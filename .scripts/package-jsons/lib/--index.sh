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
. ./.scripts/package-jsons/lib/--env-vars-reader.sh
#
#       --> required environment variables are validated for existance
#
. ./.scripts/package-jsons/lib/--env-vars-validator.sh
#
#       --> available functions are imported/exported
#
. ./.scripts/package-jsons/lib/--index-api.sh
# -------------------------------------------------------------------------------------
