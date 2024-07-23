/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'policy-engine-api-reset-engine-all';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getConfiguration } = require('../configuration');
const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const resetAllEngines = async (orgId = null) => {
    const ENGINE_SERVICE_ENDPOINT = getConfiguration()?.policyEngineAPI?.client?.url + '/reset-all';
    if (lodash.isEmpty(ENGINE_SERVICE_ENDPOINT) || lodash.isNil(ENGINE_SERVICE_ENDPOINT)) {
        const MESSAGE = `[ACA] Missing engine url![URL: ${ENGINE_SERVICE_ENDPOINT}]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const REQUEST_OPTIONS = {
        url: ENGINE_SERVICE_ENDPOINT,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clientId: orgId
        }),
    };
    const ADDITIONAL_OPTIONS = {
      allowGetBody: true,
    };

    try {
        const RET_VAL = await execHttpPostRequest({}, REQUEST_OPTIONS, ADDITIONAL_OPTIONS);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('resetAllEngines', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    resetAllEngines
};
