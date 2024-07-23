#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/clients/lib/dependencies/--index-api.sh

. ./.scripts/clients/lib/projects/--index-api.sh
. ./.scripts/clients/lib/projects-local-storage/--index-api.sh

. ./.scripts/clients/lib/versions/--index-api.sh
. ./.scripts/clients/lib/versions-local-storage/--index-api.sh

. ./.scripts/clients/lib/-build-one-by-id.sh
. ./.scripts/clients/lib/-e2e-build-one-by-id.sh
. ./.scripts/clients/lib/-e2e-kill-watch.sh
. ./.scripts/clients/lib/-e2e-watch-one-by-id.sh
