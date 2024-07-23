#!/bin/bash
# uncomment to debug the script
# set -x
# ------------------
# This script:
# - logins into RHOS cluster with provided API key and server address
# - checks project existence / creates target project
# - configures / pathes cluster Service Account with Image Pull Secret providing access to the private container registry (using an IBM Cloud API Key provided in job configuration);
# ------------------
# Copy the script below into your app code repo (e.g. ./bin/ibmcloud/pre-deploy.sh) and 'source' it from your pipeline job
#    source ./bin/ibmcloud/pre-deploy.sh
# ------------------
# Properties file:
#   buildprops: "build.properties"
# Inherits ENV vars from CI/CD pipeline config
#   PIPELINE_BLUEMIX_API_KEY
#   PIPELINE_KUBERNETES_CLUSTER_NAME
#   PIPELINE_TOOLCHAIN_ID
#   REGISTRY_URL
# Required ENV vars:
#   PROJECT_NAME
#   RHOS_SERVER_ADDRESS
#   RHOS_SERVER_PORT
#   RHOS_LOGIN_TOKEN
# Optional ENV vars:
#   CHART_ROOT (default: null)
#   CLUSTER_SERVICE_ACCOUNT_NAME (default: "default")
#   REGISTRY_API_KEY (default: $PIPELINE_BLUEMIX_API_KEY)
# Exports ENV vars:
#   N/A
# Updates build.properties file with:
#   N/A
# ------------------

echo "=========================================================="
echo "LISTING ENV VARIABLES"
echo "From job config:"
echo "RHOS_CLUSTER_NAME=${PIPELINE_KUBERNETES_CLUSTER_NAME}"
echo "PROJECT_NAME=${PROJECT_NAME}"

# View build properties
if [ -f build.properties ]; then 
  echo "From build.properties:"
  cat build.properties | grep -v -i password
  source build.properties
else 
  echo "build.properties : not found"
fi 
# also run 'env' command to find all available env variables
# or learn more about the available environment variables at:
# https://cloud.ibm.com/docs/services/ContinuousDelivery/pipeline_deploy_var.html#deliverypipeline_environment

if [ ! -z "${RHOS_SERVER_ADDRESS}" ]; then
  echo "=========================================================="
  echo "Logging into the cluster with provided master server and API token"
  echo "RHOS_SERVER_ADDRESS=${RHOS_SERVER_ADDRESS}"
  echo "RHOS_SERVER_PORT=${RHOS_SERVER_PORT}"
  echo "RHOS_LOGIN_TOKEN=${RHOS_LOGIN_TOKEN}"
  oc login --server="https://${RHOS_SERVER_ADDRESS}:${RHOS_SERVER_PORT}" --token=${RHOS_LOGIN_TOKEN}
fi

# Verify project existence
echo "Switching to target project"
if oc get projects | grep ${PROJECT_NAME}; then
  echo -e "Project ${PROJECT_NAME} already exists and will be used as deployment target"
  oc project ${PROJECT_NAME}
else
  oc new-project ${PROJECT_NAME}
  echo -e "New project '${PROJECT_NAME}' has been created."
  oc project ${PROJECT_NAME}
fi

# Use oc authorization to check if deployment can be performed in this project
echo "Checking ability to create a deployment in ${PROJECT_NAME} project"
oc auth can-i create deployment

# Check cluster availability
# echo "=========================================================="
# echo "CHECKING CLUSTER readiness"
# if [ -z "${KUBERNETES_MASTER_ADDRESS}" ]; then
#   IP_ADDR=$( ibmcloud ks workers --cluster ${RHOS_CLUSTER_NAME} | grep normal | head -n 1 | awk '{ print $2 }' )
#   if [ -z "${IP_ADDR}" ]; then
#     echo -e "${RHOS_CLUSTER_NAME} not created or workers not ready"
#     exit 1
#   fi
# fi

# Grant access to private image registry
# https://docs.openshift.com/container-platform/4.5/openshift_images/managing_images/using-image-pull-secrets.html#images-allow-pods-to-reference-images-from-secure-registries_using-image-pull-secrets
echo "=========================================================="
echo -e "CONFIGURING ACCESS to private image registry ${REGISTRY_URL}"
IMAGE_PULL_SECRET_NAME="ibmcloud-toolchain-${PIPELINE_TOOLCHAIN_ID}-${REGISTRY_URL}"

echo -e "Checking for presence of ${IMAGE_PULL_SECRET_NAME} imagePullSecret for this toolchain"
if ! oc get secret ${IMAGE_PULL_SECRET_NAME}; then
  echo -e "${IMAGE_PULL_SECRET_NAME} not found in ${PROJECT_NAME} project, creating it"
  # for Container Registry, docker username is 'token' and email does not matter
  if [ -z "${REGISTRY_API_KEY}" ]; then REGISTRY_API_KEY=${PIPELINE_BLUEMIX_API_KEY}; fi
  oc create secret docker-registry ${IMAGE_PULL_SECRET_NAME} --docker-server=${REGISTRY_URL} --docker-password=${REGISTRY_API_KEY} --docker-username=iamapikey --docker-email=a@b.com
else
  echo -e "Project ${PROJECT_NAME} already has an imagePullSecret for this toolchain."
fi

echo "Checking ability to pass pull secret via Helm chart (see also https://cloud.ibm.com/docs/containers/cs_images.html#images)"
CHART_PULL_SECRET=$( grep 'pullSecret' ${CHART_ROOT}/values.yaml || : )
if [ -z "${CHART_PULL_SECRET}" ]; then
  echo "INFO: Chart is not expecting an explicit private registry imagePullSecret. Patching the cluster default serviceAccount to pass it implicitly instead."
  echo "      Learn how to inject pull secrets into the deployment chart at: https://kubernetes.io/docs/concepts/containers/images/#referring-to-an-imagepullsecrets-on-a-pod"
  echo "      or check out this chart example: https://github.com/open-toolchain/hello-helm/tree/master/chart/hello"
  if [ -z "${CLUSTER_SERVICE_ACCOUNT_NAME}" ]; then CLUSTER_SERVICE_ACCOUNT_NAME="default" ; fi
  SERVICE_ACCOUNT=$(oc get serviceaccount ${CLUSTER_SERVICE_ACCOUNT_NAME}  -o json)
  if ! echo ${SERVICE_ACCOUNT} | jq -e '. | has("imagePullSecrets")' > /dev/null ; then
    oc patch serviceaccount ${CLUSTER_SERVICE_ACCOUNT_NAME} -p '{"imagePullSecrets":[{"name":"'"${IMAGE_PULL_SECRET_NAME}"'"}]}'
  else
    if echo ${SERVICE_ACCOUNT} | jq -e '.imagePullSecrets[] | select(.name=="'"${IMAGE_PULL_SECRET_NAME}"'")' > /dev/null ; then 
      echo -e "Pull secret already found in ${CLUSTER_SERVICE_ACCOUNT_NAME} serviceAccount"
    else
      echo "Inserting toolchain pull secret into ${CLUSTER_SERVICE_ACCOUNT_NAME} serviceAccount"
      oc patch serviceaccount ${CLUSTER_SERVICE_ACCOUNT_NAME} --type='json' -p='[{"op":"add","path":"/imagePullSecrets/-","value":{"name": "'"${IMAGE_PULL_SECRET_NAME}"'"}}]'
    fi
  fi
  echo "${CLUSTER_SERVICE_ACCOUNT_NAME} serviceAccount:"
  oc get serviceaccount ${CLUSTER_SERVICE_ACCOUNT_NAME} -o yaml
  echo -e "Project ${PROJECT_NAME} authorizing with private image registry using patched ${CLUSTER_SERVICE_ACCOUNT_NAME} serviceAccount"  
else
  echo -e "Project ${PROJECT_NAME} authorized with private image registry using Helm chart imagePullSecret"
fi
