/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const channelParameter = (flatClient) => {
    let defaultEndpoint = false;
    const DEFAULT_ENDPOINT = ramda.path(['defaultEndpoint'], flatClient);
    if (lodash.isBoolean(DEFAULT_ENDPOINT)) {
        defaultEndpoint = DEFAULT_ENDPOINT;
    }
    const RET_VAL = {
        name: ramda.path(['name'], flatClient),
        id: ramda.path(['id'], flatClient),
        defaultEndpoint: defaultEndpoint,
        authorizationType: ramda.path(['authorizationType'], flatClient),
        serviceUrl: ramda.path(['serviceUrl'], flatClient),
        versionDate: ramda.path(['versionDate'], flatClient),
        iamApiKey: ramda.path(['iamApiKey'], flatClient),
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
        'WATSON_TRANSLATOR_CLIENT_PROVIDER', 
        [
        'NAME',
        'ID',
        'DEFAULT_ENDPOINT',
        'AUTHORIZATION_TYPE',
        'SERVICE_URL',
        'VERSION_DATE',
        'IAM_API_KEY',
        ]
    );
    const PARAMS = channelParameters(CLIENTS_FLAT);
    const RET_VAL = provider.isEnabled('WATSON_TRANSLATOR_CLIENT_PROVIDER_ENABLED', false, {
        services: PARAMS,
    });

    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
