#!/bin/bash
# uncomment to debug the script
# set -x
# ------------------
# This script:
# - determines release version from lerna.json, pyproject.toml or package.json file
# - builds a Docker image and pushes it into IBM Container Service private image registry.
# Image tag format: BUILD_NUMBER-BRANCH-COMMIT_ID-TIMESTAMP
# ------------------
# copy the script below into your app code repo (e.g. ./bin/build-docker-image.sh) and 'source' it from your pipeline job
#    source ./bin/build-docker-image.sh
# ------------------
# Properties file:
#   buildprops: "build.properties"
# Requires ENV vars:
#   PIPELINE_BLUEMIX_API_KEY (Default: inherits froom IBM Cloud pipeline stage configuration)
#   DOCKER_ROOT (Default: .)
#   DOCKER_FILE (Default: Dockerfile)
# Optional ENV vars:
#   NPM_REPO_URL (Default: https://registry.npmjs.org/)
#   NODE_ENV (Default: production)
#   VERSION (Default: semantic version number extracted from lerna.json, pyproject.toml or package.json)
# Exports ENV vars:
#   PIPELINE_IMAGE_URL
#   DOCKER_CONFIG
# Updates build.properties file with:
#   IMAGE_NAME
#   IMAGE_TAG
#   RELEASE_VERSION
#   REGISTRY_URL
#   REGISTRY_NAMESPACE
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
# https://cloud.ibm.com/docs/ContinuousDelivery?topic=ContinuousDelivery-deliverypipeline_environment

if [ -z "${NPM_REPO_URL}" ]; then
  echo "Using default npm repository: https://registry.npmjs.org/"
  NPM_REPO_URL=https://registry.npmjs.org/
else
  echo "Using custom npm repository: ${NPM_REPO_URL}"
fi

if [ -z "${NODE_ENV}" ]; then
  echo "Using default node env: production"
  NODE_ENV=production
else
  echo "Using custom node env: ${NODE_ENV}"
fi

# Minting image tag using format: BUILD_NUMBER-BRANCH-COMMIT_ID-TIMESTAMP
# e.g. 3-master-50da6912-20181123114435

TIMESTAMP=$( date -u "+%Y%m%d%H%M%S")
IMAGE_TAG=${TIMESTAMP}
if [ ! -z "${GIT_COMMIT}" ]; then
  GIT_COMMIT_SHORT=$( echo ${GIT_COMMIT} | head -c 8 ) 
  IMAGE_TAG=${GIT_COMMIT_SHORT}-${IMAGE_TAG}
fi
if [ ! -z "${GIT_BRANCH}" ]; then
  SANITIZED=$( echo ${GIT_BRANCH} | sed -r 's/[ /]+/_/g' )
  IMAGE_TAG=${SANITIZED}-${IMAGE_TAG}
fi

IMAGE_TAG=${BUILD_NUMBER}-${IMAGE_TAG}

echo "=========================================================="
echo "Determining build/release version"
if [ -z "${VERSION}" ]; then
  if [ -f "lerna.json" ]; then
    VERSION=`grep -m 1 version lerna.json | cut -c 15- | rev | cut -c 3- | rev` || echo "Could not determine build version. Check lerna.json if it contains version property."
    EXTRA_BUILD_ARGS="BUILD_VERSION=${VERSION} NODE_ENV=${NODE_ENV}"
    echo "Using build version determined from lerna.json: ${VERSION}"
  elif [ -f "pyproject.toml" ]; then
    VERSION=`grep -m 1 version pyproject.toml | cut -c 12- | rev | cut -c 2- | rev` || echo "Could not determine build version. Check pyproject.toml if it contains version property."
    echo "Using build version determined from pyproject.toml: ${VERSION}"
  else
    VERSION=`grep -m 1 version package.json | cut -c 15- | rev | cut -c 3- | rev` || echo "Could not determine build version. Check package.json if it contains version property."
    EXTRA_BUILD_ARGS="BUILD_VERSION=${VERSION} NODE_ENV=${NODE_ENV}"
    echo "Using build version determined from package.json: ${VERSION}"
  fi
else
  echo "Using custom build version: ${VERSION}"
fi
if [ ! -z "${VERSION}" ]; then
  echo "Setting build version as release version: ${VERSION}"
  RELEASE_VERSION=${VERSION}
else
  echo "ERROR: could not determine release version"
  exit 1
fi

# Checking ig buildctl is installed
if which buildctl > /dev/null 2>&1; then
  buildctl --version
else 
  echo "Installing Buildkit builctl"
  curl -sL https://github.com/moby/buildkit/releases/download/v0.8.1/buildkit-v0.8.1.linux-amd64.tar.gz | tar -C /tmp -xz bin/buildctl && mv /tmp/bin/buildctl /usr/bin/buildctl && rmdir --ignore-fail-on-non-empty /tmp/bin
  buildctl --version
fi

# Create the config.json file to make private container registry accessible
export DOCKER_CONFIG=$(mktemp -d -t cr-config-XXXXXXXXXX)
kubectl create secret --dry-run=client --output=json \
  docker-registry registry-dockerconfig-secret \
  --docker-server=${REGISTRY_URL} \
  --docker-password=${PIPELINE_BLUEMIX_API_KEY} \
  --docker-username=iamapikey --docker-email=a@b.com | \
jq -r '.data[".dockerconfigjson"]' | base64 -d > ${DOCKER_CONFIG}/config.json

echo "=========================================================="
echo -e "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
if [ -z "${DOCKER_ROOT}" ]; then DOCKER_ROOT=. ; fi
if [ -z "${DOCKER_FILE}" ]; then DOCKER_FILE=Dockerfile ; fi
if [ -z "$EXTRA_BUILD_ARGS" ]; then
  echo -e ""
else
  for buildArg in $EXTRA_BUILD_ARGS; do
    if [ "$buildArg" == "--build-arg" ]; then
      echo -e ""
    else      
      BUILD_ARGS="${BUILD_ARGS} --opt build-arg:$buildArg"
    fi
  done
fi

# Build docker image and push it to the remote registry
buildctl build \
    --frontend dockerfile.v0 --opt filename=${DOCKER_FILE} --local dockerfile=${DOCKER_ROOT} \
    ${BUILD_ARGS} --local context=${DOCKER_ROOT} \
    --output type=image,name="${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}",push=true

ibmcloud login -a ${PIPELINE_BLUEMIX_TARGET_URL} -r ${IBM_CLOUD_REGION} --apikey ${PIPELINE_BLUEMIX_API_KEY} -c ${PIPELINE_BLUEMIX_BSS_ACCOUNT_GUID}

echo "=========================================================="
echo -e "Inspecting Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
ibmcloud cr image-inspect ${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}

echo "=========================================================="
echo -e "Listing related Docker images"
ibmcloud cr images --restrict ${REGISTRY_NAMESPACE}/${IMAGE_NAME}

# Set PIPELINE_IMAGE_URL for subsequent jobs in stage (e.g. Vulnerability Advisor)
export PIPELINE_IMAGE_URL="$REGISTRY_URL/$REGISTRY_NAMESPACE/$IMAGE_NAME:$IMAGE_TAG"

echo "=========================================================="
# Persist env variables into a properties file (build.properties) so that all pipeline stages consuming this
# build as input and configured with an environment properties file valued 'build.properties'
# will be able to reuse the env variables in their job shell scripts.
cp build.properties $ARCHIVE_DIR/ || :

echo "COPYING JOB VARIABLES into build.properties file"
# IMAGE information from build.properties is used in Helm Chart deployment to set the release name
echo "IMAGE_NAME=${IMAGE_NAME}" >> $ARCHIVE_DIR/build.properties
echo "IMAGE_TAG=${IMAGE_TAG}" >> $ARCHIVE_DIR/build.properties
echo "RELEASE_VERSION=${RELEASE_VERSION}" >> $ARCHIVE_DIR/build.properties
# REGISTRY information from build.properties is used in Helm Chart deployment to generate cluster secret
echo "REGISTRY_URL=${REGISTRY_URL}" >> $ARCHIVE_DIR/build.properties
echo "REGISTRY_NAMESPACE=${REGISTRY_NAMESPACE}" >> $ARCHIVE_DIR/build.properties

echo "File 'build.properties' updated with build variables:"
cat $ARCHIVE_DIR/build.properties | grep -v -i password
