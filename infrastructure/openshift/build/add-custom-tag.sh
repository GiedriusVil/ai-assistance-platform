#!/bin/bash
# uncomment to debug the script
# set -x
# ------------------
# This script:
# - marks previously built image with custom tag defined in the stage ENV config.
# ------------------
# Copy the script below into your app code repo (e.g. ./bin/add-custom-tag.sh) and 'source' it from your pipeline job
#    source ./bin/add-custom-tag.sh
# ------------------
# Properties file:
#   buildprops: "build.properties"
# Requires ENV vars:
#   REGISTRY_URL
#   CLUSTER_NAMESPACE
#   IMAGE_NAME
#   IMAGE_TAG
#   CUSTOM_TAG
# Exports ENV vars:
#   N/A
# Updates build.properties file with:
#   N/A
# ------------------
echo -e "Build environment variables:"
echo "REGISTRY_URL=${REGISTRY_URL}"
echo "REGISTRY_NAMESPACE=${REGISTRY_NAMESPACE}"
echo "IMAGE_NAME=${IMAGE_NAME}"
echo "IMAGE_TAG=${IMAGE_TAG}"
echo "CUSTOM_TAG=${CUSTOM_TAG}"
echo "BUILD_NUMBER=${BUILD_NUMBER}"
echo "RELEASE_VERSION=${RELEASE_VERSION}"
echo "=========================================================="
echo -e "Marking image with custom tag: ${CUSTOM_TAG}"
set -x
ibmcloud cr image-tag ${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${CUSTOM_TAG}
set +x
