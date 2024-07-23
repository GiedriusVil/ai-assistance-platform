/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'policy-engine-api-reset-engine-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getConfiguration } = require('../configuration');

const resetEngine = async (orgId = null) => {
    let configuration;
    let requestUrl;
    let requestOptions;
    let additionalOptions;
    try {
        configuration = getConfiguration();
        requestUrl = configuration?.policyEngineAPI?.client?.url + '/reset-one';
        if (
            lodash.isEmpty(requestUrl)
        ) {
            const MESSAGE = `Missing required configuration.policyEngineAPI.client.url`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        requestOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientId: orgId
            }),
        };
        additionalOptions = {
          allowGetBody: true,
        };
        const RET_VAL = await execHttpPostRequest({}, requestOptions, additionalOptions);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { configuration, requestUrl, requestOptions });
        logger.error('resetEngine', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    resetEngine
};
