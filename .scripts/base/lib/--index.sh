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
. ./.scripts/base/lib/--env-vars-reader.sh
#
#       --> required environment variables are validated for existance
#
. ./.scripts/base/lib/--env-vars-validator.sh
#
#       --> Importing local shell packages
#
. ./.scripts/loggers/lib/--index-api.sh
#
#       --> available functions are imported/exported
#
. ./.scripts/base/lib/--index-api.sh
# -------------------------------------------------------------------------------------
