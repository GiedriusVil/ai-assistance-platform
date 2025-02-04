#!/bin/bash
# uncomment to debug the script
# set -x
# ------------------
# This script:
# - checks the IBM Container Service cluster is ready and has a namespace required;
# - configures K8s Service Account and Image Pull Secret with access to the private container registry (using an IBM Cloud API Key provided in job configuration);
# ------------------
# Copy the script below into your app code repo (e.g. ./bin/ibmcloud/pre-deploy.sh) and 'source' it from your pipeline job
#    source ./bin/ibmcloud/pre-deploy.sh
# ------------------
# Properties file:
#   buildprops: "build.properties"
# Requires ENV vars:
#   CLUSTER_NAMESPACE
# Exports ENV vars:
#   N/A
# Updates build.properties file with:
#   N/A
# ------------------

echo "=========================================================="
echo "LISTING ENV VARIABLES"
echo "From job config:"
echo "PIPELINE_KUBERNETES_CLUSTER_NAME=${PIPELINE_KUBERNETES_CLUSTER_NAME}"
echo "CLUSTER_NAMESPACE=${CLUSTER_NAMESPACE}"
# echo "Use for custom Kubernetes cluster target:"
# echo "KUBERNETES_MASTER_ADDRESS=${KUBERNETES_MASTER_ADDRESS}"
# echo "KUBERNETES_MASTER_PORT=${KUBERNETES_MASTER_PORT}"
# echo "KUBERNETES_SERVICE_ACCOUNT_TOKEN=${KUBERNETES_SERVICE_ACCOUNT_TOKEN}"
# View build properties
if [ -f build.properties ]; then 
  echo "From build.properties:"
  cat build.properties | grep -v -i password
else 
  echo "build.properties : not found"
fi 
# also run 'env' command to find all available env variables
# or learn more about the available environment variables at:
# https://cloud.ibm.com/docs/services/ContinuousDelivery/pipeline_deploy_var.html#deliverypipeline_environment

# If custom cluster credentials available, connect to this cluster instead
if [ ! -z "${KUBERNETES_MASTER_ADDRESS}" ]; then
  kubectl config set-cluster custom-cluster --server=https://${KUBERNETES_MASTER_ADDRESS}:${KUBERNETES_MASTER_PORT} --insecure-skip-tls-verify=true
  kubectl config set-credentials sa-user --token="${KUBERNETES_SERVICE_ACCOUNT_TOKEN}"
  kubectl config set-context custom-context --cluster=custom-cluster --user=sa-user --namespace="${CLUSTER_NAMESPACE}"
  kubectl config use-context custom-context
fi
# Use kubectl auth to check if the kubectl client configuration is appropriate
# check if the current configuration can create a deployment in the target namespace
echo "Check ability to create a kubernetes deployment in ${CLUSTER_NAMESPACE} using kubectl CLI"
kubectl auth can-i create deployment --namespace ${CLUSTER_NAMESPACE}

#Check cluster availability
echo "=========================================================="
echo "CHECKING CLUSTER readiness and namespace existence"
if [ -z "${KUBERNETES_MASTER_ADDRESS}" ]; then
  IP_ADDR=$( ibmcloud ks workers --cluster ${PIPELINE_KUBERNETES_CLUSTER_NAME} | grep normal | head -n 1 | awk '{ print $2 }' )
  if [ -z "${IP_ADDR}" ]; then
    echo -e "${PIPELINE_KUBERNETES_CLUSTER_NAME} not created or workers not ready"
    exit 1
  fi
fi
echo "Configuring cluster namespace"
if kubectl get namespace ${CLUSTER_NAMESPACE}; then
  echo -e "Namespace ${CLUSTER_NAMESPACE} found."
else
  kubectl create namespace ${CLUSTER_NAMESPACE}
  echo -e "Namespace ${CLUSTER_NAMESPACE} created."
fi

# Grant access to private image registry from namespace $CLUSTER_NAMESPACE
# reference https://cloud.ibm.com/docs/containers/cs_cluster.html#bx_registry_other
echo "=========================================================="
echo -e "CONFIGURING ACCESS to private image registry from namespace ${CLUSTER_NAMESPACE}"
IMAGE_PULL_SECRET_NAME="ibmcloud-toolchain-${PIPELINE_TOOLCHAIN_ID}-${REGISTRY_URL}"

echo -e "Checking for presence of ${IMAGE_PULL_SECRET_NAME} imagePullSecret for this toolchain"
if ! kubectl get secret ${IMAGE_PULL_SECRET_NAME} --namespace ${CLUSTER_NAMESPACE}; then
  echo -e "${IMAGE_PULL_SECRET_NAME} not found in ${CLUSTER_NAMESPACE}, creating it"
  # for Container Registry, docker username is 'token' and email does not matter
  if [ -z "${PIPELINE_BLUEMIX_API_KEY}" ]; then PIPELINE_BLUEMIX_API_KEY=${IBM_CLOUD_API_KEY}; fi #when used outside build-in kube job
  kubectl --namespace ${CLUSTER_NAMESPACE} create secret docker-registry ${IMAGE_PULL_SECRET_NAME} --docker-server=${REGISTRY_URL} --docker-password=${PIPELINE_BLUEMIX_API_KEY} --docker-username=iamapikey --docker-email=a@b.com
else
  echo -e "Namespace ${CLUSTER_NAMESPACE} already has an imagePullSecret for this toolchain."
fi
echo "Checking ability to pass pull secret via Helm chart (see also https://cloud.ibm.com/docs/containers/cs_images.html#images)"
CHART_PULL_SECRET=$( grep 'pullSecret' ${CHART_ROOT}/values.yaml || : )
if [ -z "${CHART_PULL_SECRET}" ]; then
  echo "INFO: Chart is not expecting an explicit private registry imagePullSecret. Patching the cluster default serviceAccount to pass it implicitly instead."
  echo "      Learn how to inject pull secrets into the deployment chart at: https://kubernetes.io/docs/concepts/containers/images/#referring-to-an-imagepullsecrets-on-a-pod"
  echo "      or check out this chart example: https://github.com/open-toolchain/hello-helm/tree/master/chart/hello"
  if [ -z "${KUBERNETES_SERVICE_ACCOUNT_NAME}" ]; then KUBERNETES_SERVICE_ACCOUNT_NAME="default" ; fi
  SERVICE_ACCOUNT=$(kubectl get serviceaccount ${KUBERNETES_SERVICE_ACCOUNT_NAME}  -o json --namespace ${CLUSTER_NAMESPACE} )
  if ! echo ${SERVICE_ACCOUNT} | jq -e '. | has("imagePullSecrets")' > /dev/null ; then
    kubectl patch --namespace ${CLUSTER_NAMESPACE} serviceaccount/default -p '{"imagePullSecrets":[{"name":"'"${IMAGE_PULL_SECRET_NAME}"'"}]}'
  else
    if echo ${SERVICE_ACCOUNT} | jq -e '.imagePullSecrets[] | select(.name=="'"${IMAGE_PULL_SECRET_NAME}"'")' > /dev/null ; then 
      echo -e "Pull secret already found in ${KUBERNETES_SERVICE_ACCOUNT_NAME} serviceAccount"
    else
      echo "Inserting toolchain pull secret into ${KUBERNETES_SERVICE_ACCOUNT_NAME} serviceAccount"
      kubectl patch --namespace ${CLUSTER_NAMESPACE} serviceaccount/${KUBERNETES_SERVICE_ACCOUNT_NAME} --type='json' -p='[{"op":"add","path":"/imagePullSecrets/-","value":{"name": "'"${IMAGE_PULL_SECRET_NAME}"'"}}]'
    fi
  fi
  echo "${KUBERNETES_SERVICE_ACCOUNT_NAME} serviceAccount:"
  kubectl get serviceaccount ${KUBERNETES_SERVICE_ACCOUNT_NAME} --namespace ${CLUSTER_NAMESPACE} -o yaml
  echo -e "Namespace ${CLUSTER_NAMESPACE} authorizing with private image registry using patched ${KUBERNETES_SERVICE_ACCOUNT_NAME} serviceAccount"  
else
  echo -e "Namespace ${CLUSTER_NAMESPACE} authorized with private image registry using Helm chart imagePullSecret"
fi
