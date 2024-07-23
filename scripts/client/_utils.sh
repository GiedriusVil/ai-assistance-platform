#!/bin/bash
#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#

uploadWbcDirectory() {
  TMP_COS_ENDPOINT=$1
  TMP_COS_BUCKET_NAME=$2
  TMP_COS_TOKEN=$3
  TMP_WBC_VERSION=$4
  TMP_WBC_DIR=$5

  echo "# COS_ENDPOINT: ${TMP_COS_ENDPOINT}"
  echo "# COS_BUCKET_NAME: ${TMP_COS_BUCKET_NAME}"
  echo "# COS_TOKEN: ${TMP_COS_BUCKET_NAME}"
  echo "# WBC_VERSION: ${TMP_WBC_VERSION}"
  echo "# WBC_DIR: ${TMP_WBC_DIR}"

  cd $TMP_WBC_DIR
  for WBC_FILE in *; do

    if [[ $WBC_FILE != assets ]]; then
      echo "WBC_FILE : ${WBC_FILE}"
      curl -X "PUT" "https://${TMP_COS_ENDPOINT}/${TMP_COS_BUCKET_NAME}/${TMP_WBC_VERSION}/${TMP_WBC_DIR}/${WBC_FILE}" -H "Authorization: Bearer ${COS_TOKEN}" -d @./$WBC_FILE
    fi
  done
  pwd
  cd ..
  pwd
}
