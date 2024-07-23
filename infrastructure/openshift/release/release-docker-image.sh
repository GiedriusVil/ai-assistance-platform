#!/bin/bash
# uncomment to debug the script
# set -x
# ------------------
# This script:
# - marks a Docker image with release version (semantic version) and latest tags
# - stores the image in a dedicated Container registry namespace
# ------------------
# copy the script below into your app code repo (e.g. ./bin/release-docker-image.sh) and 'source' it from your pipeline job
#    source ./bin/release-docker-image.sh
# ------------------
# Properties file:
#   buildprops: "build.properties"
# Requires ENV vars:
#   TARGET_REGISTRY_NAMESPACE
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
echo -e "Marking image with release version: ${RELEASE_VERSION}"
ibmcloud cr image-tag ${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_URL}/${TARGET_REGISTRY_NAMESPACE}/${IMAGE_NAME}:${RELEASE_VERSION}

echo -e "Marking image with tag: latest"
ibmcloud cr image-tag ${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_URL}/${TARGET_REGISTRY_NAMESPACE}/${IMAGE_NAME}:latest