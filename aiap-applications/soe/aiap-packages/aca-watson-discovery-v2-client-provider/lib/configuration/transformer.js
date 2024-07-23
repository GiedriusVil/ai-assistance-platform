/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const channelParameter = (flatClient) => {
    let username = 'default';
    let password = 'default';
    let defaultEndpoint = false;
    let iamApiKey = 'default';
    let iamUrl = 'default';
    const AUTH_TYPE = ramda.pathOr('default', ['authorizationType'], flatClient);
    if (AUTH_TYPE !== 'iam') {
        username = ramda.path(['username'], flatClient);
        password = ramda.path(['password'], flatClient);
    }
    if (AUTH_TYPE === 'iam') {
        iamApiKey = ramda.path(['iamApiKey'], flatClient);
        iamUrl = ramda.path(['iamUrl'], flatClient);
    }
    const DEFAULT_ENDPOINT = ramda.path(['defaultEndpoint'], flatClient);
    if (lodash.isBoolean(DEFAULT_ENDPOINT)) {
        defaultEndpoint = DEFAULT_ENDPOINT;
    }
    const RET_VAL = {
        name: ramda.path(['name'], flatClient),
        id: ramda.path(['id'], flatClient),
        defaultEndpoint: defaultEndpoint,
        username: username,
        password: password,
        serviceUrl: ramda.path(['serviceUrl'], flatClient),
        versionDate: ramda.path(['versionDate'], flatClient),
        projectId: ramda.path(['projectId'], flatClient),
        collectionName: ramda.path(['collectionName'], flatClient),
        authorizationType: ramda.path(['authorizationType'], flatClient),
        iamApiKey: iamApiKey,
        iamUrl: iamUrl
    };
    return RET_VAL;
}

const channelParameters = (flatChannels) => {
    const RET_VAL = [];
    if (!ramda.isNil(flatChannels)) {
        for(let flatChannel of flatChannels){
            if (!ramda.isNil(flatChannel)) {
                RET_VAL.push(channelParameter(flatChannel));
            }
        }
    }
    return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const CLIENTS_FLAT = provider.getKeys(
        'WATSON_DISCOVERY_V2_CLIENT_PROVIDER', 
        [
        'NAME',
        'ID',
        'DEFAULT_ENDPOINT',
        'USERNAME',
        'PASSWORD',
        'SERVICE_URL',
        'VERSION_DATE',
        'PROJECT_ID',
        'COLLECTION_NAME',
        'AUTHORIZATION_TYPE',
        'IAM_API_KEY',
        'IAM_URL',
        ]
    );
    const PARAMS = channelParameters(CLIENTS_FLAT);
    const RET_VAL = provider.isEnabled('WATSON_DISCOVERY_V2_CLIENT_PROVIDER_ENABLED', false, {
        maxRetries: rawConfiguration.WATSON_DISCOVERY_V2_CLIENT_PROVIDER_MAX_RETRIES,
        backoffDelay: rawConfiguration.WATSON_DISCOVERY_V2_CLIENT_PROVIDER_BACKOFF_DELAY,
        unavailableMessage: rawConfiguration.WATSON_DISCOVERY_V2_CLIENT_PROVIDER_UNAVAILABLE_MESSAGE,
        resultsLimit: rawConfiguration.WATSON_DISCOVERY_V2_CLIENT_PROVIDER_RESULTS_LIMIT,
        services: PARAMS,
        poller: {
            interval: rawConfiguration.WATSON_DISCOVERY_V2_CLIENT_PROVIDER_POLLER_INTERVAL,
          },
    });

    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
