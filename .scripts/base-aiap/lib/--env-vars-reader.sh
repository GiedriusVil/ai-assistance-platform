#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/base/lib/--env-vars-reader.sh

export AIAP_ENVIRONMENT="development"
export AIAP_SKIP_NGCC=false
export AIAP_CONTRAST_ENABLED=false
export AIAP_LERNA_CLEAN_ENABLED=false

export AIAP_PACKAGES_SHARED_ANGULAR_DIR="./aiap-packages-shared-angular"
export AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECT_ID=""
export AIAP_PACKAGES_SHARED_ANGULAR_SKIP=false

export AIAP_PACKAGES_SHARED_DIR="./aiap-packages-shared"

export AIAP_APPLICATION_ID=""

export AIAP_APPLICATION_CLIENT_VERSION_SKIP=false
export AIAP_APPLICATION_CLIENT_VERSION_ID=""
export AIAP_APPLICATION_CLIENT_PROJECTS_SKIP=false
export AIAP_APPLICATION_CLIENT_PROJECT_ID=""

export AIAP_APPLICATION_CLIENT_WBCS_SKIP=false
export AIAP_APPLICATION_CLIENT_WBC_ID=""
export AIAP_APPLICATION_CLIENT_WBC_PROJECTS_SKIP=false
export AIAP_APPLICATION_CLIENT_WBC_PROJECT_ID=""

export PACKAGE_JSON_RELATIVE_PATH=""

ALL_ARGS=("$@")
while [[ "$#" -gt 0 ]]; do
    case $1 in
    --aiap-environment)
        export AIAP_ENVIRONMENT="$2"
        ;;
    --aiap-skip-ngcc)
        export AIAP_SKIP_NGCC="$2"
        ;;
    --aiap-contrast-enabled)
        export AIAP_CONTRAST_ENABLED="$2"
        ;;
    --aiap-lerna-clean-enabled)
        export AIAP_LERNA_CLEAN_ENABLED="$2"
        ;;
    --aiap-packages-shared-angular-skip)
        export AIAP_PACKAGES_SHARED_ANGULAR_SKIP="$2"
        ;;
    --aiap-packages-shared-angular-client-project-id)
        export AIAP_PACKAGES_SHARED_ANGULAR_CLIENT_PROJECT_ID="$2"
        ;;
    --aiap-application-id)
        export AIAP_APPLICATION_ID="$2"
        ;;
    --aiap-application-client-version-skip)
        export AIAP_APPLICATION_CLIENT_VERSION_SKIP="$2"
        ;;
    --aiap-application-client-version-id)
        export AIAP_APPLICATION_CLIENT_VERSION_ID="$2"
        ;;
    --aiap-application-client-projects-skip)
        export AIAP_APPLICATION_CLIENT_PROJECTS_SKIP="$2"
        ;;
    --aiap-application-client-project-id)
        export AIAP_APPLICATION_CLIENT_PROJECT_ID="$2"
        ;;
    --aiap-application-client-wbcs-skip)
        export AIAP_APPLICATION_CLIENT_WBCS_SKIP="$2"
        ;;
    --aiap-application-client-wbc-id)
        export AIAP_APPLICATION_CLIENT_WBC_ID="$2"
        ;;
    --aiap-application-client-wbc-projects-skip)
        export AIAP_APPLICATION_CLIENT_WBC_PROJECTS_SKIP="$2"
        ;;
    --aiap-application-client-wbc-project-id)
        export AIAP_APPLICATION_CLIENT_WBC_PROJECT_ID="$2"
        ;;
    --aiap-application-client-wbc-project-id)
        export AIAP_APPLICATION_CLIENT_WBC_PROJECT_ID="$2"
        ;;
    *) ;;
    esac
    shift
done
set -- "${ALL_ARGS[@]}"
