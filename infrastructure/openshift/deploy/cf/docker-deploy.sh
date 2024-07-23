#!/bin/bash
set -e

CONFIG_FILE=$1
MANIFEST_FILE=$2
DOCKER_IMAGE=$3
NAME=$4

# Validate variables
printHelp() {
  echo "Deploying application to Bluemix"
  echo "Mandatory params: "
  echo "  CONFIG_REPO_TOKEN"
  echo "  CONFIG_REPO_BASE_URL (sample: https://github.ibm.com/api/v3/repos/aca/[repo_name]"
  echo "  CF_DOCKER_PASSWORD"
  echo "  CF_DOCKER_USER"
  echo "Usage: "
  echo "  ci-deploy.sh config-file-name manifest-file-name docker-image [app-name]"
}

if [[ "$CONFIG_REPO_TOKEN" = "-h" || "$CONFIG_REPO_BASE_URL" = "-h" || "$CONFIG_FILE" = "-h" || "$MANIFEST_FILE" = "-h" || "$DOCKER_IMAGE" = "-h" || "$CF_DOCKER_PASSWORD" = "-h" || "$CF_DOCKER_USER" = "-h" ]]; then
 printHelp
 exit 0
fi

if [[ -z "${CONFIG_REPO_TOKEN}" ]]; then
 echo "Error: Configuration repository token must be set"
 printHelp
 exit 1
fi

if [[ -z "${CONFIG_REPO_BASE_URL}" ]]; then
 echo "Error: Configuration repository base URL must be set"
 printHelp
 exit 1
fi

if [[ -z "${CONFIG_FILE}" ]]; then
  echo "Error: Configuration file name must be set"
  printHelp
  exit 1
fi

if [[ -z "${MANIFEST_FILE}" ]]; then
  echo "Error: Manifest file to be updated must be set"
  printHelp
  exit 1
fi

if [[ -z "${DOCKER_IMAGE}" ]]; then
  echo "Error: docker image must be set"
  printHelp
  exit 1
fi

if [[ -z "${CF_DOCKER_PASSWORD}" ]]; then
 echo "Error: CF_DOCKER_PASSWORD must be set"
 printHelp
 exit 1
fi

if [[ -z "${CF_DOCKER_USER}" ]]; then
 echo "Error: CF_DOCKER_USER must be set"
 printHelp
 exit 1
fi

# Get configuration file from config repository
curl -f -H "Authorization: token $CONFIG_REPO_TOKEN" -H "Accept: application/vnd.github.v3.raw" -O -L $CONFIG_REPO_BASE_URL/contents/$CONFIG_FILE

# Grep all environment variables and append to manifest file
TMP_MANIFEST_FILE="tmp_manifest.yml"

# Grep version from build step
DOCKER_IMAGE_VERSION=`cat version.tmp`

cat $MANIFEST_FILE > $TMP_MANIFEST_FILE
echo "  env:" >> $TMP_MANIFEST_FILE
cat $CONFIG_FILE | awk -F= '$0 !~ /^(#|$)/ { print "    "$1": "substr($0, index($0,"=")+1, length($0))}' >> $TMP_MANIFEST_FILE

# Push application
cf push $NAME --docker-image $DOCKER_IMAGE:$DOCKER_IMAGE_VERSION --docker-username $CF_DOCKER_USER -f $TMP_MANIFEST_FILE

# rm $CONFIG_FILE
rm $TMP_MANIFEST_FILE
