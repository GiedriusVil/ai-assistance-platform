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
. ./.scripts/clients/lib/--env-vars-reader.sh
#
#       --> required environment variables are validated for existance
#
. ./.scripts/clients/lib/--env-vars-validator.sh
#
#       --> available functions are imported/exported
#
. ./.scripts/clients/lib/--index-api.sh
# -------------------------------------------------------------------------------------
