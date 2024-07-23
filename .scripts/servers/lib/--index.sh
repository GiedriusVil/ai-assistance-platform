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
. ./.scripts/servers/lib/--env-vars-reader.sh
#
#       --> required environment variables are validated for existance
#
. ./.scripts/servers/lib/--env-vars-validator.sh
#
#       --> available functions are imported/exported
#
. ./.scripts/servers/lib/--index-api.sh
# -------------------------------------------------------------------------------------
