#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/client-wbcs/lib/wbcs/-get-one-by-id.sh
. ./.scripts/client-wbcs/lib/wbcs/-query-id.sh

__watch_client_shared_carbon() {
  yarn run ng build client-shared-carbon --watch
}

__watch_client_shared_utils() {
  wait-on -l "../../../aiap-packages-shared-angular/dist/client-shared-carbon/public-api.d.ts" &&
    yarn run ng build client-shared-utils --watch
}

__watch_client_shared_services() {
  wait-on -l "../../../aiap-packages-shared-angular/dist/client-shared-utils/public-api.d.ts" &&
    yarn run ng build client-shared-services --watch
}

__watch_client_shared_components() {
  wait-on -l "../../../aiap-packages-shared-angular/dist/client-shared-services/public-api.d.ts" &&
    yarn run ng build client-shared-components --watch
}

__watch_client_shared_views() {
  wait-on -l "../../../aiap-packages-shared-angular/dist/client-shared-components/public-api.d.ts" &&
    yarn run ng build client-shared-views --watch
}

__watch_client_shared() {
  wait-on -l "../../../aiap-packages-shared-angular/dist/client-shared-views/public-api.d.ts" &&
    yarn run ng build client-utils --watch
}

__watch_client_services() {
  wait-on -l "dist/client-utils/public-api.d.ts" &&
    yarn run ng build client-services --watch
}

__watch_client_components() {
  wait-on -l "dist/client-services/public-api.d.ts" &&
    yarn run ng build client-components --watch
}

__watch_client_views() {
  wait-on -l "dist/client-components/public-api.d.ts" &&
    yarn run ng build client-views --watch
}

__watch_client() {
  local TMP_AIAP_APPLICATION_CLIENT_WBC_ID="${1}"
  wait-on -l "dist/client-views/public-api.d.ts" &&
    yarn run ng build "${TMP_AIAP_APPLICATION_CLIENT_WBC_ID}" \
      --configuration "${AIAP_ENVIRONMENT}" \
      --aot \
      --output-hashing none \
      --single-bundle true \
      --watch \
      --progress
}

_clientsWbcs_wbcs_e2eWatchOneById() {
  local FUNCTION_NAME="_clientsWbcs_wbcs_e2eWatchOneById"

  local AIAP_APPLICATION_CLIENT_WBC=$(
    _clientWbcs_wbcs_getOneById
  )
  local AIAP_APPLICATION_CLIENT_WBC_ID=$(
    _clientWbcs_wbcs_queryId "${AIAP_APPLICATION_CLIENT_WBC}"
  )

  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_CLIENT_WBC_ID: ${AIAP_APPLICATION_CLIENT_WBC_ID}"

  cd ./aiap-applications/${AIAP_APPLICATION_ID}/client

  rm -rf dist/client-utils
  rm -rf dist/client-services
  rm -rf dist/client-components
  rm -rf dist/client-views

  rm -rf ../../../aiap-packages-shared-angular/dist/*

  echo "Starting libraries!" &
  __watch_client_shared_carbon &
  __watch_client_shared_utils &
  __watch_client_shared_services &
  __watch_client_shared_components &
  __watch_client_shared_views &
  __watch_client_shared &
  __watch_client_services &
  __watch_client_components &
  __watch_client_views &
  __watch_client "${AIAP_APPLICATION_CLIENT_WBC_ID}"
}
