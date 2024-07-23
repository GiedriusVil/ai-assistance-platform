#!/bin/bash
# uncomment to debug the script
# set -x
# ------------------
# This script:
# - lints Dockerfile
# - ensures container registry namespace existence
# - removes old images from container registry
# ------------------
# Copy the script below into your app code repo (e.g. ./bin/pre-build-check.sh) and 'source' it from your pipeline job
#    source ./bin/pre-build-check.sh
# ------------------
# Properties file:
#   buildprops: "build.properties"
# Requires ENV vars:
#   DOCKER_ROOT (Default: .)
#   DOCKER_FILE (Default: Dockerfile)
#   KEEP_LATEST_IMAGES (Default: 1)
# Exports ENV vars:
#   N/A
# Updates build.properties file with:
#   N/A
# ------------------
# Input env variables (can be received via pipeline/stage/job config, environment properties.file or custom environment variables
echo "=========================================================="
echo "LISTING ENV VARIABLES"
echo "From job config:"
echo "REGISTRY_URL=${REGISTRY_URL}"
echo "REGISTRY_NAMESPACE=${REGISTRY_NAMESPACE}"
echo "IMAGE_NAME=${IMAGE_NAME}"
echo "BUILD_NUMBER=${BUILD_NUMBER}"
echo "ARCHIVE_DIR=${ARCHIVE_DIR}"

# View build properties
if [ -f build.properties ]; then 
  echo "From build.properties:"
  cat build.properties | grep -v -i password
else 
  echo "build.properties : not found"
fi 
# also run 'env' command to find all available env variables
# or learn more about the available environment variables at:
# https://console.bluemix.net/docs/services/ContinuousDelivery/pipeline_deploy_var.html#deliverypipeline_environment

echo "=========================================================="
echo "Checking for Dockerfile at the repository root"
if [ -z "${DOCKER_ROOT}" ]; then DOCKER_ROOT=. ; fi
if [ -z "${DOCKER_FILE}" ]; then DOCKER_FILE=Dockerfile ; fi
if [ -f ${DOCKER_ROOT}/${DOCKER_FILE} ]; then 
echo -e "Dockerfile found at: ${DOCKER_FILE}"
else
    echo "Dockerfile not found at: ${DOCKER_FILE}"
    exit 1
fi
echo "Linting Dockerfile"
npm install -g dockerlint
dockerlint -f ${DOCKER_ROOT}/${DOCKER_FILE}

echo "=========================================================="
echo "Checking registry namespace existence: ${REGISTRY_NAMESPACE}"
NS=$( bx cr namespaces | grep ${REGISTRY_NAMESPACE} ||: )
if [ -z "${NS}" ]; then
    echo "Registry namespace ${REGISTRY_NAMESPACE} not found, creating it."
    bx cr namespace-add ${REGISTRY_NAMESPACE}
    echo "Registry namespace ${REGISTRY_NAMESPACE} created."
else 
    echo "Registry namespace ${REGISTRY_NAMESPACE} found."
fi
echo -e "Listing images in ${REGISTRY_NAMESPACE} namespace"
bx cr images --restrict ${REGISTRY_NAMESPACE}

echo "=========================================================="
if [ -z "${KEEP_LATEST_IMAGES}" ]; then 
  KEEP=1
else 
  KEEP=$KEEP_LATEST_IMAGES
fi 
echo -e "PURGING REGISTRY, only keeping last ${KEEP} image(s) based on image digests"
COUNT=0
LIST=$( bx cr images --restrict ${REGISTRY_NAMESPACE}/${IMAGE_NAME} --no-trunc --format '__not_implemented__ __not_implemented__@__not_implemented__' | sort -r -u | awk '{print $2}' | sed '$ d' )
while read -r IMAGE_URL ; do
  if [[ "$COUNT" -lt "$KEEP" ]]; then
    echo "Keeping image digest: ${IMAGE_URL}"
  else
    bx cr image-rm "${IMAGE_URL}"
  fi
  COUNT=$((COUNT+1)) 
done <<< "$LIST"
if [[ "$COUNT" -gt 1 ]]; then
  echo "Content of image registry"
  bx cr images
fi
