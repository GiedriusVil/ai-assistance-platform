#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
export NODE_OPTIONS=--max_old_space_size=4096

APP_NAME={{dashCase name}}

production=0

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --production) production=1;;
        *) ;;
    esac
    shift
done

echo "Build aca-client-shared-utils..."
ng build aca-client-shared-utils

echo "Build aca-client-shared-services..."
ng build aca-client-shared-services

echo "Build aca-client-shared-components..."
ng build aca-client-shared-components

echo "Build aca-client-shared-views..."
ng build aca-client-shared-views

echo "Build aca-client-shared..."
ng build aca-client-shared

echo "Build aca-client-services..."
ng build aca-client-services --configuration production

echo "Build aca-client-components..."
ng build aca-client-components

echo "Build aca-client-views..."
ng build aca-client-views
