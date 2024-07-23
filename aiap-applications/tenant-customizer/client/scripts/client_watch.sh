#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
export NODE_OPTIONS=--max_old_space_size=4096
APP_NAME=tenant-customizer

watch_client_shared_carbon() {
  ng build client-shared-carbon --watch
}

watch_client_shared_utils() {
  wait-on -l "../../../aiap-packages-shared-angular/dist/client-shared-carbon/public-api.d.ts" && ng build client-shared-utils --watch
}

watch_client_shared_services() {
  wait-on -l "../../../aiap-packages-shared-angular/dist/client-shared-utils/public-api.d.ts" && ng build client-shared-services --watch
}

watch_client_shared_components() {
  wait-on -l "../../../aiap-packages-shared-angular/dist/client-shared-services/public-api.d.ts" && ng build client-shared-components --watch
}

watch_client_shared_views() {
  wait-on -l "../../../aiap-packages-shared-angular/dist/client-shared-components/public-api.d.ts" && ng build client-shared-views --watch
}

watch_client_shared() {
  wait-on -l "../../../aiap-packages-shared-angular/dist/client-shared-views/public-api.d.ts" && ng build aca-client-shared --watch
}

watch_client_services() {
  wait-on -l "dist/aca-client-shared/public-api.d.ts" && ng build aca-client-services --watch
}

watch_client_components() {
  wait-on -l "dist/aca-client-services/public-api.d.ts" && ng build aca-client-components --watch
}

watch_client_views() {
  wait-on -l "dist/aca-client-components/public-api.d.ts" && ng build aca-client-views --watch
}

watch_client() {
  wait-on -l "dist/aca-client-views/public-api.d.ts" && ng build --output-hashing none --single-bundle true --watch --progress
}

rm -rf dist/*
rm -rf ../../../aiap-packages-shared-angular/dist/*
echo "Starting libraries!" &
watch_client_shared_carbon &
watch_client_shared_utils &
watch_client_shared_services &
watch_client_shared_components &
watch_client_shared_views &
watch_client_shared &
watch_client_services &
watch_client_components &
watch_client_views &
watch_client
