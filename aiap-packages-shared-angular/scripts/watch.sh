#!/bin/bash
#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#

. ./scripts/_utils.sh

watch_client_shared_carbon() {
  ng build client-shared-carbon --watch
}

watch_client_shared_utils() {
  wait-on -l "dist/client-shared-carbon/public-api.d.ts" && ng build client-shared-utils --watch
}

watch_client_shared_services() {
  wait-on -l "dist/client-shared-utils/public-api.d.ts" && ng build client-shared-services --watch
}

watch_client_shared_components() {
  wait-on -l "dist/client-shared-components/public-api.d.ts" && ng build client-shared-components --watch
}

watch_client_shared_views() {
  wait-on -l "dist/client-shared-views/public-api.d.ts" && ng build client-shared-views --watch
}

rm -rf dist/*
echo "Starting shared libraries!" &
watch_client_shared_utils &
watch_client_shared_services &
watch_client_shared_components &
watch_client_shared_views
