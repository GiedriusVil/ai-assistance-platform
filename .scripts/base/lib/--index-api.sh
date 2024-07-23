#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/base/lib/-export-env-variable.sh
. ./.scripts/base/lib/-export-env-variables-from-file-dot-env.sh
. ./.scripts/base/lib/-export-env-variables-from-file.sh

. ./.scripts/base/lib/-get-env-variable-key-from-line.sh
. ./.scripts/base/lib/-get-env-variable-value-from-line.sh

. ./.scripts/base/lib/-local-storage-ensure-existance-file-dot-env.sh
. ./.scripts/base/lib/-local-storage-ensure-existance-file.sh

. ./.scripts/base/lib/-local-storage-read-lines-from-file-dot-env.sh
. ./.scripts/base/lib/-local-storage-read-lines-from-file.sh

. ./.scripts/base/lib/-local-storage-reset-file-dot-env.sh
. ./.scripts/base/lib/-local-storage-reset-file.sh

. ./.scripts/base/lib/-local-storage-save-env-variable-2-file-dot-env.sh
. ./.scripts/base/lib/-local-storage-save-env-variable-2-file.sh

. ./.scripts/base/lib/-local-storage-view-file-dot-env.sh
. ./.scripts/base/lib/-local-storage-view-file.sh

. ./.scripts/base/lib/-log-env-vars.sh
