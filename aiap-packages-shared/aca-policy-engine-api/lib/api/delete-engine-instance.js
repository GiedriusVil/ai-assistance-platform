/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'policy-engine-client-remove-engine';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getConfiguration } = require('../configuration');

const deleteEngineInstance = async (orgId) => {
    let configuration;
    let requestUrl;
    let requestOptions;
    let additionalRequestOptions;
    try {
        configuration = getConfiguration();
        requestUrl = ramda.path(['policyEngineAPI', 'client', 'url'], configuration) + '/delete';
        if (
            lodash.isEmpty(requestUrl)
        ) {
            const MESSAGE = `Missing required configuration.policyEngineApi.client.url parameter`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        requestOptions = {
            url: requestUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientId: orgId
            }),
        };
        additionalRequestOptions = {
          allowGetBody: true,
        };
        const RESPONSE = await execHttpPostRequest({}, requestOptions, additionalRequestOptions);
        const RESPONSE_BODY = ramda.path(['body'], RESPONSE);
        const RET_VAL = JSON.parse(RESPONSE_BODY);
        return RET_VAL
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(MODULE_ID, { configuration, requestUrl, requestOptions });
        logger.error('deleteEngineInstance', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    deleteEngineInstance
};
