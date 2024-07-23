#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/base-aiap/lib/--env-vars-reader.sh

. ./.scripts/base-aiap/lib/-env-vars-ensure-existance-aiap-application-id.sh

_envVars_ensureExistance_aiapApplicationId

export AIAP_IMAGE_BUILD_FILE_PATH=""
export AIAP_IMAGE_PUSH_URL=""
export AIAP_IMAGE_PUSH_USERNAME=""
export AIAP_IMAGE_PUSH_PASSWORD=""

export AIAP_DIR_CONFIG="../aiap-configuration"

ALL_ARGS=("$@")
while [[ "$#" -gt 0 ]]; do
    case $1 in
    --aiap-image-build-file-path)
        export AIAP_IMAGE_BUILD_FILE_PATH="$2"
        ;;
    --aiap-image-push-url)
        export AIAP_IMAGE_PUSH_URL="$2"
        ;;
    --aiap-image-push-username)
        export AIAP_IMAGE_PUSH_USERNAME="$2"
        ;;
    --aiap-image-push-password)
        export AIAP_IMAGE_PUSH_PASSWORD="$2"
        ;;
    *) ;;
    esac
    shift
done
set -- "${ALL_ARGS[@]}"
