/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-service-models-test-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { findOneById } = require('./find-one-by-id');

const testOneById = async (context, params) => {
    const USER_ID = ramda.path(['user', 'id'], context);
    const TENANT_ID = ramda.path(['user', 'session', 'tenant', 'id'], context);

    const ID = ramda.path(['id'], params);
    const PHRASE = ramda.path(['phrase'], params);
    try {
        const MODEL = await findOneById(context, { id: ID });
        if (
            lodash.isEmpty(TENANT_ID)
        ) {
            const MESSAGE = `Missing required context.user.session.tenant.id parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (
            lodash.isEmpty(ID)
        ) {
            const MESSAGE = `Missing required params.id parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (
            lodash.isEmpty(MODEL)
        ) {
            const MESSAGE = `Unable retrieve classifier model!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        const SERVICE_URL = ramda.path(['serviceUrl'], MODEL);
        if (
            lodash.isEmpty(SERVICE_URL)
        ) {
            const MESSAGE = `Missing model.serviceUrl attribute!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        const REQUEST_URL = `${SERVICE_URL}/api/classifier/predict`;
        const REQUEST_BODY = {
            tenantId: TENANT_ID,
            modelId: ID,
            text: PHRASE,
        }
        const REQUEST_OPTIONS = {
            url: REQUEST_URL,
            body: REQUEST_BODY,
            options: {
              timeout: 10000,
            },
        }
        const SERVICE_RESPONSE = await execHttpPostRequest({}, REQUEST_OPTIONS);
        const RET_VAL = ramda.path(['body'], SERVICE_RESPONSE);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { USER_ID, TENANT_ID, ID });
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    testOneById,
}
