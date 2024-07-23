#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/base-aiap/lib/-applications-get-one-by-id.sh
. ./.scripts/base-aiap/lib/-applications-query-id.sh

. ./.scripts/base-aiap/lib/-env-vars-ensure-existance-aiap-application-id.sh

. ./.scripts/base-aiap/lib/-local-storage-applications-get-selected.sh
. ./.scripts/base-aiap/lib/-local-storage-applications-list-many-by-query.sh
. ./.scripts/base-aiap/lib/-local-storage-applications-list-one-by-id.sh
