#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/package-jsons/lib/-client-wbcs-dependencies-delete-many-by-query.sh
. ./.scripts/package-jsons/lib/-client-wbcs-dependencies-list-many-by-query.sh
. ./.scripts/package-jsons/lib/-client-wbcs-dependencies-set-many-by-query.sh

. ./.scripts/package-jsons/lib/-client-wbcs-dev-dependencies-delete-many-by-query.sh
. ./.scripts/package-jsons/lib/-client-wbcs-dev-dependencies-list-many-by-query.sh
. ./.scripts/package-jsons/lib/-client-wbcs-dev-dependencies-set-many-by-query.sh

. ./.scripts/package-jsons/lib/-dependencies-list-many-by-query.sh
. ./.scripts/package-jsons/lib/-dev-dependencies-list-many-by-query.sh

. ./.scripts/package-jsons/lib/-local-storage-list-paths-by-query.sh
. ./.scripts/package-jsons/lib/-local-storage-refresh-package-json-registry.sh
