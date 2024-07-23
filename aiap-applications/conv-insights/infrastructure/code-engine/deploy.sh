#!/bin/bash

# START-UTILITY-METHODS
printHelp() {
    echo ""
    echo "Please provide mandatory variables:"
    echo "  IBM_CLOUD_RESOURCE_GROUP -> [DEVELOPMENT, TEST, PRODUCTION]"
    echo "  CODE_ENGINE_PROJECT_NAME -> [cohap-dev, ...]"
    echo "  CODE_ENGINE_APP_NAME -> [coh-conv-insights-dev, ...]"
    echo "Usage: "
    echo "deploy.sh <IBM_CLOUD_RESOURCE_GROUP> <CODE_ENGINE_PROJECT_NAME> <CODE_ENGINE_APP_NAME>"
    echo ""
}
# END-UTILITY-METHODS

IBM_CLOUD_RESOURCE_GROUP=$1
CODE_ENGINE_PROJECT_NAME=$2
CODE_ENGINE_APP_NAME=$3

if [[ -z "${IBM_CLOUD_RESOURCE_GROUP}" ]]; then
    echo "Error: Missing required <IBM_CLOUD_RESOURCE_GROUP> variable!"
    printHelp
    exit 1
fi

if [[ -z "${CODE_ENGINE_PROJECT_NAME}" ]]; then
    echo "Error: Missing required <CODE_ENGINE_PROJECT_NAME> variable!"
    printHelp
    exit 1
fi

if [[ -z "${CODE_ENGINE_APP_NAME}" ]]; then
    echo "Error: Missing required <CODE_ENGINE_APP_NAME> variable!"
    printHelp
    exit 1
fi

echo -e "Deploy environment variables:"
echo "IBM_CLOUD_API_KEY=${IBM_CLOUD_API_KEY}"
echo "IBM_CLOUD_RESOURCE_GROUP=${IBM_CLOUD_RESOURCE_GROUP}"
echo "CODE_ENGINE_PROJECT_NAME=${CODE_ENGINE_PROJECT_NAME}"
echo "CODE_ENGINE_APP_NAME=${CODE_ENGINE_APP_NAME}"

# learn more on code engine application revisions deletion:
# https://cloud.ibm.com/docs/codeengine?topic=codeengine-cli#cli-revision-delete

echo "Logging in to ibm cloud ..."
ibmcloud login --apikey $IBM_CLOUD_API_KEY -a cloud.ibm.com -r eu-de -g $IBM_CLOUD_RESOURCE_GROUP

ibmcloud ce project select --name $CODE_ENGINE_PROJECT_NAME

rev_list=$(ibmcloud ce revision list --output json --application $CODE_ENGINE_APP_NAME | jq -r '.items[].metadata.name')
echo "Revisions found: ${rev_list}"

echo "Deleting revisions ..."

for rev in $rev_list
do
  echo "Deleting revision: ${rev}"
  ibmcloud ce revision delete --name $rev --force
done

echo "Finished"
