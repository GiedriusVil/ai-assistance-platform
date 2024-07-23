#!/bin/bash
# uncomment to debug the script
# set -x
# ------------------
# This script:
# - checks Helm client and Tiller versions. Installs/updates Helm client version based on Tiller|target|local version. Skips Tiller installation if not needed or already installed;
# - Connects to aidt-chart Helm repository
# - lists all existing Helm releases in the specified project and defines new release name;
# - downloads required configs based on specified ENV variables
# - deploys Helm chart into specified cluster/project.
# - prints additional deployment details
# ------------------
# Copy the script below into your app code repo (e.g. ./bin/helm-deploy.sh) and 'source' it from your pipeline job
#    source ./bin/helm-deploy.sh
# ------------------
# Properties file:
#   buildprops: "build.properties"
# Inherited ENV vars from build.properties:
#   REGISTRY_URL
#   REGISTRY_NAMESPACE
#   IMAGE_NAME
#   IMAGE_TAG
# Required ENV vars:
#   AIDT_CHARTS_REPO
#   AIDT_CHARTS_USER
#   AIDT_CHARTS_PASSWORD
#   CHART_NAME
#   CONFIG_FILE
#   TENANT_ID - only for Analytics and Aggregated Insights Dashboard API and WA-ETL deployment
#   TENANT_CONFIG_FILE - only for Analytics and Aggregated Insights Dashboard API and WA-ETL deployment
#   DICTIONARY_CONFIG_FILE - only for WA-ETL specific cases
#   CONFIG_REPO_BASE_URL
#   CONFIG_REPO_TOKEN
#   PROJECT_NAME
# Optional ENV vars:
#   HELM_VERSION (Default: local Helm client version) - this Helm target version to be used
#   HELM_DEBUG (Default: false)
#   HELM_REINSTALL (Default: false)
#   HELM_TLS_OPTION (Default: null)
#   HELM_UPGRADE_EXTRA_FLAGS (Default: null) - use this to specify Chart's version, e.g "--version 1.0.0"
#   RHOS_SERVER_ADDRESS
#   RHOS_SERVER_PORT
#   RHOS_LOGIN_TOKEN
#   RELEASE_NAME (Default: $IMAGE_NAME)
# Exports ENV vars:
#   N/A
# Updates build.properties file with:
#   N/A
# ------------------

# Mapping cluster name to the common ENV variable
echo "=========================================================="
echo "SETTING CLUSTER NAME FROM PIPELINE CONFIG"
CLUSTER_NAME=$PIPELINE_KUBERNETES_CLUSTER_NAME

if [ -z "${APP_DIR}" ]; then
  APP_DIR="aiap-applications"
fi

echo "=========================================================="
echo "LISTING ENV VARIABLES"
if [ -f build.properties ]; then 
  echo "-- From \"build.properties\" inherited from previous job --"
  cat build.properties | grep -v -i password
else 
  echo "WARNING! \"build.properties\" file does not exist. Check CI/CD configuration."
  # also run 'env' command to find all available env variables
  # or learn more about the available environment variables at:
  # https://cloud.ibm.com/docs/services/ContinuousDelivery/pipeline_deploy_var.html#deliverypipeline_environment
fi 
echo ""
echo "-- From current job config --"
echo "HELM_VERSION=${HELM_VERSION}"
echo "AIDT_CHARTS_REPO=${AIDT_CHARTS_REPO}"
echo "CHART_NAME=${CHART_NAME}"
echo "CONFIG_FILE=${CONFIG_FILE}"
echo "CONFIG_REPO_BASE_URL=${CONFIG_REPO_BASE_URL}"
echo "CLUSTER_NAME=${CLUSTER_NAME}"
echo "PROJECT_NAME=${PROJECT_NAME}"
echo "APP_NAME=${APP_NAME}"
echo ""

# Only if running outside of IBM Continuous delivery pipeline
if [ ! -z "${RHOS_SERVER_ADDRESS}" ]; then
  echo "=========================================================="
  echo "Logging into the cluster with provided master server and API token"
  echo "RHOS_SERVER_ADDRESS=${RHOS_SERVER_ADDRESS}"
  echo "RHOS_SERVER_PORT=${RHOS_SERVER_PORT}"
  echo "RHOS_LOGIN_TOKEN=${RHOS_LOGIN_TOKEN}"
  oc login --server="https://${RHOS_SERVER_ADDRESS}:${RHOS_SERVER_PORT}" --token=${RHOS_LOGIN_TOKEN}
fi

# Verify project existence and use as deployment target
echo "=========================================================="
echo "SWITCHING TO PROJECT: ${PROJECT_NAME}"
if oc get projects | grep ${PROJECT_NAME}; then
  echo -e "Project ${PROJECT_NAME} already exists and will be used as deployment target"
  oc project ${PROJECT_NAME}
else
  oc new-project ${PROJECT_NAME}
  echo -e "New project '${PROJECT_NAME}' has been created."
  oc project ${PROJECT_NAME}
fi

echo "=========================================================="
echo "CHECKING HELM VERSION "
set +e
LOCAL_VERSION=$( helm version --client ${HELM_TLS_OPTION} | grep SemVer: | sed "s/^.*SemVer:\"v\([0-9.]*\).*/\1/" )
set -e
if [ "${CLIENT_VERSION}" != "${LOCAL_VERSION}" ]; then
  echo -e "Local Helm client v${LOCAL_VERSION} - does not match target version. Installing Helm client v${CLIENT_VERSION}"
  WORKING_DIR=$(pwd)
  mkdir ~/tmpbin && cd ~/tmpbin
  curl -L https://get.helm.sh/helm-v${CLIENT_VERSION}-linux-amd64.tar.gz -o helm.tar.gz && tar -xzvf helm.tar.gz
  cd linux-amd64
  export PATH=$(pwd):$PATH
  cd $WORKING_DIR
fi

echo "=========================================================="
echo -e "CHECKING HELM RELEASES IN PROJECT: ${PROJECT_NAME}"
helm list ${HELM_TLS_OPTION}

echo "=========================================================="
echo "DEFINING RELEASE NAME"
if [ -z "$RELEASE_NAME" ]; then
  if [[ "${PROJECT_NAME}" != "default" ]]; then
    echo "Prefixing image (app) name with namespace if not 'default' as Helm needs unique release names across namespaces"
    RELEASE_NAME="${PROJECT_NAME}-${IMAGE_NAME}"
  else
    RELEASE_NAME=${IMAGE_NAME}
  fi
fi
echo -e "Release name: ${RELEASE_NAME}"

# This is needed to automate cron-job deployments
if [ -z "${HELM_REINSTALL}" ]; then HELM_REINSTALL=false ; fi
if [ "${HELM_REINSTALL}" == true ]; then
  echo "=========================================================="
  echo "DELETING PREVIOUS RELEASE: ${RELEASE_NAME}"
  helm uninstall ${RELEASE_NAME}
fi

# Only for Insights Analytics, ETL and Aggregated Analytics microservice requiring tenant config to be passed as secret
if [ -n "$TENANT_CONFIG_FILE" ]; then
  echo "DOWNLOADING TENANT CONFIG: ${TENANT_CONFIG_FILE}"
  mkdir tenants
  curl -f -H "Authorization: token $CONFIG_REPO_TOKEN" -H "Accept: application/vnd.github.v3.raw" -o tenants/${TENANT_ID}.json -L $CONFIG_REPO_BASE_URL/contents/$TENANT_CONFIG_FILE
  echo "=========================================================="
  echo -e "CREATING SECRET: \"${RELEASE_NAME}-tenants\" for TENANT ID: \"${TENANT_ID}\""
  oc create secret generic ${RELEASE_NAME}-tenants \
      --from-file=tenants/${TENANT_ID}.json --dry-run -o yaml | oc apply -f -
fi

# For file based config mounting, e.g. like ACA Text Classifier. This config will be mounted on pod's file system during the deployment
if [ -n "$ADDITIONAL_APP_CONFIG_FILE" ]; then
  echo "DOWNLOADING ADDITIONAL APP CONFIG: ${ADDITIONAL_APP_CONFIG_FILE}"
  mkdir local-env
  curl -f -H "Authorization: token $CONFIG_REPO_TOKEN" -H "Accept: application/vnd.github.v3.raw" -o local-env/config.json -L $CONFIG_REPO_BASE_URL/contents/$ADDITIONAL_APP_CONFIG_FILE
  echo "=========================================================="
  echo -e "CREATING SECRET: \"${RELEASE_NAME}-config\" from: \"${ADDITIONAL_APP_CONFIG_FILE}\""
  oc create secret generic ${RELEASE_NAME}-config \
      --from-file=local-env/config.json --dry-run -o yaml | oc apply -f -
fi

# Optional ETL config for specific WA-ETL cases
if [ -n "${DICTIONARY_CONFIG_FILE}" ]; then
  echo "=========================================================="
  echo "DOWNLOADING ADDITIONAL ETL DICTIONARY CONFIG: ${DICTIONARY_CONFIG_FILE}"
  curl -f -H "Authorization: token $CONFIG_REPO_TOKEN" -H "Accept: application/vnd.github.v3.raw" -o tenants/${TENANT_ID}-dictionary.json -L $CONFIG_REPO_BASE_URL/contents/$DICTIONARY_CONFIG_FILE
  echo "=========================================================="
  echo "CREATING SECRET: ${RELEASE_NAME}-tenants"
  oc create secret generic ${RELEASE_NAME}-dictionary \
      --from-file=tenants/${TENANT_ID}-dictionary.json --dry-run -o yaml | oc apply -f -
fi

echo "=========================================================="
echo "DEPLOYING HELM CHART: ${CHART_NAME}"
IMAGE_REPOSITORY=${REGISTRY_URL}/${REGISTRY_NAMESPACE}
IMAGE_PULL_SECRET_NAME="ibmcloud-toolchain-${PIPELINE_TOOLCHAIN_ID}-${REGISTRY_URL}"

if [ -z "${HELM_DEBUG}" ]; then HELM_DEBUG=false ; fi
# Using 'upgrade --install" for rolling updates. Note that subsequent updates will occur in the same namespace the release is currently deployed in, ignoring the explicit--namespace argument".
if [ "${HELM_DEBUG}" == true ]; then
  echo "=========================================================="
  echo "DEBUGING DEPLOYMENT WITH DRY RUN"
  echo -e "Dry run into: ${CLUSTER_NAME}/${PROJECT_NAME}."
  helm upgrade ${RELEASE_NAME} ${APP_DIR}/${APP_NAME}/infrastructure/rhos/helm ${HELM_TLS_OPTION} --install --debug --dry-run \
    --set imageRepository=${IMAGE_REPOSITORY},imageName=${IMAGE_NAME},imageTag=${IMAGE_TAG},imagePullSecretName=${IMAGE_PULL_SECRET_NAME} \
    --set gitConfigEnabled=${GIT_CONFIG_ENABLED},gitConfigUrl=${GIT_CONFIG_URL},gitConfigFile=${GIT_CONFIG_FILE},gitConfigPersonalToken=${GIT_CONFIG_PERSONAL_TOKEN} \
     ${HELM_UPGRADE_EXTRA_FLAGS}
fi
echo "=========================================================="
echo -e "DEPLOYING TO CLUSTER/PROJECT: ${CLUSTER_NAME}/${PROJECT_NAME}."
helm upgrade ${RELEASE_NAME} ${APP_DIR}/${APP_NAME}/infrastructure/rhos/helm ${HELM_TLS_OPTION} --install \
  --set imageRepository=${IMAGE_REPOSITORY},imageName=${IMAGE_NAME},imageTag=${IMAGE_TAG},imagePullSecretName=${IMAGE_PULL_SECRET_NAME} \
  --set gitConfigEnabled=${GIT_CONFIG_ENABLED},gitConfigUrl=${GIT_CONFIG_URL},gitConfigFile=${GIT_CONFIG_FILE},gitConfigPersonalToken=${GIT_CONFIG_PERSONAL_TOKEN} \
  ${HELM_UPGRADE_EXTRA_FLAGS}

# Dump events that occured during the rollout
echo "=========================================================="
echo "SHOWING LAST EVENTS"
oc get events --sort-by=.metadata.creationTimestamp

echo ""
echo -e "Status for release: ${RELEASE_NAME}"
helm status ${HELM_TLS_OPTION} ${RELEASE_NAME}

echo ""
echo -e "History for release: ${RELEASE_NAME}"
helm history ${HELM_TLS_OPTION} ${RELEASE_NAME}

echo ""
echo "=========================================================="
echo "DEPLOYMENT SUCCEEDED"
