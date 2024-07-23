#!/bin/bash
#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
. ./scripts/_utils.sh

# COS_API_KEY="QbGLfn1sJ4MXFeDzZ1aUA7qM88mKH9fsJDUb9F3pJQqQ"
# COS_ENDPOINT="s3.us-east.cloud-object-storage.appdomain.cloud"
# COS_BUCKET_NAME="web-components"
# COS_WBC_VERSION="0.0.1"

COS_TOKEN=$(curl -X "POST" "https://iam.cloud.ibm.com/oidc/token" \
     -H 'Accept: application/json' \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode "apikey=${COS_API_KEY}" \
     --data-urlencode "response_type=cloud_iam" \
     --data-urlencode "grant_type=urn:ibm:params:oauth:grant-type:apikey" | jq -r '.access_token')

echo " COS_BUCKET_NAME: ${COS_ENDPOINT}"
echo " COS_BUCKET_NAME: ${COS_BUCKET_NAME}"
echo " COS_TOKEN: ${COS_TOKEN}"
echo " COS_URL: https://${COS_ENDPOINT}/${COS_BUCKET_NAME}"

cd dist

for COS_WBC_DIR in * ; do
  if  [[ $COS_WBC_DIR == aca-wbc* ]];
  then
    uploadWbcDirectory $COS_ENDPOINT $COS_BUCKET_NAME $COS_TOKEN $COS_WBC_VERSION $COS_WBC_DIR
  fi
done

