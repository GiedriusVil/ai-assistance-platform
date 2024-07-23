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
. ./.scripts/client-wbcs/lib/--env-vars-reader.sh
#
#       --> required environment variables are validated for existance
#
. ./.scripts/client-wbcs/lib/--env-vars-validator.sh
#
#       --> available functions are imported/exported
#
. ./.scripts/client-wbcs/lib/--index-api.sh
# -------------------------------------------------------------------------------------
